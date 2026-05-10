import { expect, test } from "@playwright/test";

test("API health endpoint is available", async ({ request }) => {
  const response = await request.get("/api/health");
  await expect(response).toBeOK();
  const payload = await response.json();
  expect(payload.ok).toBe(true);
  expect(payload.project).toBe("huanwrite");
  expect(payload.api).toMatchObject({ configured: true, provider: "yls", model: "gpt-5.5" });
  expect(typeof payload.counts.topics).toBe("number");
  expect(typeof payload.counts.plans).toBe("number");
  expect(typeof payload.counts.manuscripts).toBe("number");
  expect(typeof payload.counts.runs).toBe("number");
  expect(typeof payload.counts.jobs).toBe("number");
  expect(Array.isArray(payload.actions)).toBe(true);
  expect(Array.isArray(payload.recentJobs)).toBe(true);
});
