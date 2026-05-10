import { expect, test } from "@playwright/test";
import { z } from "zod";
import { workbenchActionIds } from "../../packages/shared/src/workbenchContract.js";
import { topicInput } from "./fixtures.js";

const actionExecutionOrder = [
  "plan_story",
  "replan_story",
  "polish_plan",
  "brainstorm_plan",
  "audit_story_state",
  "continue",
  "review_candidate",
  "repair_candidate",
  "revise_ai",
  "merge_brief",
  "submission_package",
  "drama_adapt",
  "platform_radar",
  "daily_platform_radar"
] as const;

const runsResponseSchema = z.object({
  runs: z.array(z.object({ action: z.string() }))
});

const dashboardResponseSchema = z.object({
  candidates: z.array(z.object({ actionType: z.string(), status: z.string() })),
  reviews: z.array(z.object({ status: z.string() })),
  submissions: z.array(z.object({ status: z.string() }))
});

const actionResponseSchema = z.object({
  job: z.object({
    id: z.string(),
    action: z.string(),
    status: z.string()
  })
});

const jobResponseSchema = z.object({
  id: z.string(),
  runId: z.string().optional(),
  status: z.string()
});

test("all workbench writing actions run through the real API and create run records", async ({ request }) => {
  const topicResponse = await request.post("/api/topics", { data: topicInput });
  await expect(topicResponse).toBeOK();
  const topic = await topicResponse.json();

  await expect(await request.post(`/api/topics/${topic.id}/select`, { data: { reason: "E2E 真实动作面测试" } })).toBeOK();
  const planResponse = await request.post(`/api/topics/${topic.id}/plans`);
  const plan = await planResponse.json();
  await expect(await request.post(`/api/plans/${plan.id}/complete`)).toBeOK();
  await expect(await request.post(`/api/plans/${plan.id}/confirm`)).toBeOK();

  const manuscriptResponse = await request.post(`/api/topics/${topic.id}/manuscripts`, {
    data: { planId: plan.id, title: topic.title }
  });
  const manuscript = await manuscriptResponse.json();
  await expect(
    await request.put(`/api/manuscripts/${manuscript.id}/text`, {
      data: { text: `# ${topic.title}\n\nE2E 通过真实 API 写入的测试正文。` }
    })
  ).toBeOK();

  for (const action of actionExecutionOrder) {
    const traceId = `api-${Date.now()}-${action}`;
    await expect(
      await request.post("/api/events", {
        data: { type: "action.click", traceId, action, message: action }
      })
    ).toBeOK();
    const actionResponse = await request.post("/api/action", {
      data: {
        action,
        manuscriptId: manuscript.id,
        planId: plan.id,
        targetPlatform: "番茄短故事",
        clientTraceId: traceId,
        instructions: "E2E 逐动作真实 API 测试"
      }
    });
    await expect(actionResponse).toBeOK();
    const result = actionResponseSchema.parse(await actionResponse.json());
    expect(result.job.action).toBe(action);
    expect(result.job.status).toBe("running");
    await expect
      .poll(async () => {
        const jobResponse = await request.get(`/api/action-status?jobId=${encodeURIComponent(result.job.id)}`);
        const job = jobResponseSchema.parse(await jobResponse.json());
        return job.status;
      })
      .toBe("done");
  }

  const runsResponse = await request.get("/api/runs");
  const runs = runsResponseSchema.parse(await runsResponse.json());
  const actions = runs.runs.map((item) => item.action);
  for (const action of workbenchActionIds) {
    expect(actions).toContain(action);
  }

  const jobsResponse = await request.get("/api/jobs");
  const jobs = await jobsResponse.json();
  expect(jobs.jobs.length).toBeGreaterThanOrEqual(workbenchActionIds.length);

  const dashboardResponse = await request.get("/api/dashboard");
  const dashboard = dashboardResponseSchema.parse(await dashboardResponse.json());
  expect(dashboard.candidates.length).toBeGreaterThanOrEqual(3);
  expect(dashboard.candidates.some((item) => item.status === "generated")).toBe(true);
  expect(dashboard.candidates.some((item) => item.status === "approved")).toBe(true);
  expect(dashboard.reviews.some((item) => item.status === "passed")).toBe(true);
  expect(dashboard.submissions.some((item) => item.status === "package-draft")).toBe(true);
});
