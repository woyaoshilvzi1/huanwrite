import { expect, type Page } from "@playwright/test";
import { z } from "zod";

const dashboardPayloadSchema = z.object({
  creativeLanes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      targetPlatform: z.string(),
      targetLength: z.string(),
      creationFocus: z.array(z.string()),
      radarSignals: z.array(z.string()),
      qualityGates: z.array(z.string())
    })
  ),
  manuscripts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      currentPlanId: z.string(),
      workbench: z.object({
        owner: z.string(),
        notes: z.string(),
        laneStatus: z.string(),
        laneProfile: z
          .object({
            laneId: z.string(),
            laneTitle: z.string(),
            track: z.string(),
            creationFocus: z.array(z.string()),
            radarSignals: z.array(z.string()),
            qualityGates: z.array(z.string())
          })
          .optional(),
        qualityGates: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            passed: z.boolean(),
            owner: z.string(),
            note: z.string()
          })
        )
      })
    })
  ),
  topics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      laneProfile: z
        .object({
          laneId: z.string(),
          laneTitle: z.string(),
          creationFocus: z.array(z.string())
        })
        .optional()
    })
  ),
  plans: z.array(
    z.object({
      id: z.string(),
      topicId: z.string(),
      structureCards: z.array(
        z.object({
          title: z.string(),
          summary: z.string(),
          targetWords: z.string(),
          sceneCount: z.string(),
          characters: z.string(),
          goal: z.string(),
          protagonistGoal: z.string(),
          conflict: z.string(),
          change: z.string(),
          turningPoint: z.string(),
          hook: z.string(),
          payoffHook: z.string(),
          oocRisk: z.string(),
          humanNote: z.string()
        })
      ),
      bannedPhrases: z.array(z.string()),
      fatigueWords: z.array(z.string()),
      styleRules: z.array(z.string())
    })
  ),
  planDetails: z.array(z.object({ planId: z.string(), craftCards: z.array(z.string()) })),
  candidates: z.array(z.unknown()),
  reviews: z.array(z.unknown()),
  submissions: z.array(z.unknown())
});

const runsPayloadSchema = z.object({
  runs: z.array(
    z.object({
      id: z.string(),
      action: z.string(),
      manuscriptId: z.string().optional(),
      promptHash: z.string().optional(),
      promptRegistryKey: z.string().optional(),
      model: z.string().optional()
    })
  )
});

const contextPayloadSchema = z.object({
  references: z.array(z.unknown())
});

const radarPayloadSchema = z.object({
  unknowns: z.array(z.unknown()),
  evidence: z.array(z.object({ source: z.string(), summary: z.string(), score: z.number(), usable: z.boolean() })),
  laneMatches: z.array(
    z.object({
      manuscriptId: z.string(),
      title: z.string(),
      laneTitle: z.string(),
      track: z.string(),
      radarSignals: z.array(z.string()),
      targetPlatform: z.string(),
      readiness: z.number(),
      nextAction: z.string()
    })
  )
});

const jobPayloadSchema = z.object({
  id: z.string(),
  runId: z.string().optional(),
  status: z.string(),
  progress: z.number()
});

const runTraceSchema = z.object({
  runId: z.string(),
  action: z.string(),
  promptHash: z.string(),
  promptRegistryKey: z.string(),
  model: z.string(),
  usage: z.object({
    inputChars: z.number(),
    outputChars: z.number()
  }),
  harness: z.object({
    grade: z.string(),
    checks: z.array(z.string())
  }),
  apiUsed: z.boolean(),
  endpoint: z.string(),
  providerError: z.string()
});

export async function readDashboard(page: Page): Promise<z.infer<typeof dashboardPayloadSchema>> {
  const response = await page.request.get("/api/dashboard");
  await expect(response).toBeOK();
  return dashboardPayloadSchema.parse(await response.json());
}

export async function readActionRunIds(page: Page, action: string): Promise<string[]> {
  const response = await page.request.get("/api/runs");
  await expect(response).toBeOK();
  const payload = runsPayloadSchema.parse(await response.json());
  return payload.runs.filter((run) => run.action === action).map((run) => run.id);
}

export async function readActionRuns(page: Page): Promise<Array<{ id: string; action: string; manuscriptId?: string }>> {
  const response = await page.request.get("/api/runs");
  await expect(response).toBeOK();
  const payload = runsPayloadSchema.parse(await response.json());
  return payload.runs;
}

export async function readRunOutput(page: Page, runId: string): Promise<string> {
  const response = await page.request.get(`/api/runs/${runId}`);
  await expect(response).toBeOK();
  return response.text();
}

export async function expectApiSurface(page: Page): Promise<void> {
  const openApi = await page.request.get("/api/openapi.json");
  await expect(openApi).toBeOK();
  const client = await page.request.get("/assets/api-client.js");
  await expect(client).toBeOK();
  expect(await client.text()).toContain("createHuanwriteApi");
  const context = await page.request.get("/api/context");
  await expect(context).toBeOK();
  const contextPayload = contextPayloadSchema.parse(await context.json());
  expect(contextPayload.references.length).toBeGreaterThanOrEqual(12);
  const radar = await page.request.get("/api/platform-radar");
  await expect(radar).toBeOK();
  const radarPayload = radarPayloadSchema.parse(await radar.json());
  expect(radarPayload.unknowns.length).toBeGreaterThan(0);
  expect(radarPayload.evidence.length).toBeGreaterThan(0);
  const evalBaseline = await page.request.get("/api/eval-baseline");
  await expect(evalBaseline).toBeOK();
  expect(await evalBaseline.text()).toContain("promptRegistryKey");
}

export async function expectJobStatusAndStop(page: Page, jobId: string): Promise<void> {
  const payload = await waitForJobDone(page, jobId);
  expect(payload.progress).toBe(100);
  const stop = await page.request.post("/api/action-stop", { data: { jobId } });
  await expect(stop).toBeOK();
}

export async function waitForJobDone(page: Page, jobId: string): Promise<z.infer<typeof jobPayloadSchema>> {
  let payload: z.infer<typeof jobPayloadSchema> | undefined;
  await expect
    .poll(async () => {
      const status = await page.request.get(`/api/action-status?jobId=${encodeURIComponent(jobId)}`);
      await expect(status).toBeOK();
      payload = jobPayloadSchema.parse(await status.json());
      return payload.status;
    })
    .toBe("done");
  return jobPayloadSchema.parse(payload);
}

export async function expectEmptyOverwriteBlocked(page: Page, manuscriptId: string): Promise<void> {
  const seed = await page.request.put(`/api/manuscripts/${manuscriptId}/text`, { data: { text: "已有正文内容" } });
  await expect(seed).toBeOK();
  const blocked = await page.request.put(`/api/manuscripts/${manuscriptId}/text`, { data: { text: "" } });
  expect(blocked.status()).toBe(500);
  expect(await blocked.text()).toContain("empty");
}

export async function expectActionRunObservation(page: Page, runId: string): Promise<void> {
  const output = await readRunOutput(page, runId);
  expect(output).toContain("promptHash");
  expect(output).toContain("promptRegistryKey");
  expect(output).toContain("model");
  const traceResponse = await page.request.get(`/api/runs/${runId}/trace`);
  await expect(traceResponse).toBeOK();
  const trace = runTraceSchema.parse(await traceResponse.json());
  expect(trace.runId).toBe(runId);
  expect(trace.harness.checks).toContain("action-available");
  expect(trace.harness.checks).toContain(trace.apiUsed ? "provider-api-used" : "local-fallback-recorded");
}
