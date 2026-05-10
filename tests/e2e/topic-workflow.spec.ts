import { expect, test } from "@playwright/test";
import { topicInput } from "./fixtures.js";
import { z } from "zod";

const dashboardResponseSchema = z.object({
  candidates: z.array(z.object({ id: z.string(), status: z.string() })),
  submissions: z.array(z.object({ sourceId: z.string(), targetPlatform: z.string() }))
});

test("production chain can be completed through API", async ({ request }) => {
  const topicResponse = await request.post("/api/topics", { data: topicInput });
  await expect(topicResponse).toBeOK();
  const topic = await topicResponse.json();
  expect(topic.status).toBe("idea");

  const selectedResponse = await request.post(`/api/topics/${topic.id}/select`, {
    data: { reason: "卖点清晰，冲突可持续升级。" }
  });
  await expect(selectedResponse).toBeOK();
  const selected = await selectedResponse.json();
  expect(selected.status).toBe("selected");

  const planResponse = await request.post(`/api/topics/${topic.id}/plans`);
  await expect(planResponse).toBeOK();
  const plan = await planResponse.json();
  expect(plan.status).toBe("draft");

  await expect(await request.post(`/api/plans/${plan.id}/complete`)).toBeOK();
  await expect(await request.post(`/api/plans/${plan.id}/confirm`)).toBeOK();

  const manuscriptResponse = await request.post(`/api/topics/${topic.id}/manuscripts`, {
    data: { planId: plan.id, title: topic.title }
  });
  await expect(manuscriptResponse).toBeOK();
  const manuscript = await manuscriptResponse.json();
  expect(manuscript.status).toBe("empty");

  const candidateResponse = await request.post(`/api/manuscripts/${manuscript.id}/actions`, {
    data: { planId: plan.id, actionType: "扩写第一章" }
  });
  await expect(candidateResponse).toBeOK();
  const candidate = await candidateResponse.json();
  expect(candidate.status).toBe("generated");

  const reviewResponse = await request.post(`/api/candidates/${candidate.id}/review`);
  await expect(reviewResponse).toBeOK();
  const review = await reviewResponse.json();
  expect(review.status).toBe("passed");

  await expect(await request.post(`/api/candidates/${candidate.id}/merge`)).toBeOK();
  await expect(
    await request.post(`/api/manuscripts/${manuscript.id}/submissions`, { data: { targetPlatform: "番茄短故事" } })
  ).toBeOK();

  const dashboardResponse = await request.get("/api/dashboard");
  await expect(dashboardResponse).toBeOK();
  const dashboard = dashboardResponseSchema.parse(await dashboardResponse.json());
  const mergedCandidate = dashboard.candidates.find((item) => item.id === candidate.id);
  const submission = dashboard.submissions.find((item) => item.sourceId === manuscript.id);
  expect(mergedCandidate?.status).toBe("merged");
  expect(submission?.targetPlatform).toBe("番茄短故事");
});
