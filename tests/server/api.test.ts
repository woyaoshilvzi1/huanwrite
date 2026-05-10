import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServerApp } from "../../packages/server/src/index.js";
import { type WorkbenchContract } from "@huanwrite/shared";

let root: string;
let app: ReturnType<typeof createServerApp>;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "huanwrite-"));
  app = createServerApp(root);
});

afterEach(() => {
  app.close();
  rmSync(root, { recursive: true, force: true });
});

describe("server api", () => {
  it("runs the production chain through public api", async () => {
    const health = await app.request("/api/health");
    const healthPayload = await health.json();
    expect(healthPayload.ok).toBe(true);
    expect(healthPayload.project).toBe("huanwrite");
    expect(healthPayload.counts).toBeDefined();
    expect(healthPayload.api.configured).toBeTypeOf("boolean");

    const contractResponse = await app.request("/api/contract");
    const contract: WorkbenchContract = await contractResponse.json();
    expect(contract.actions.map((item) => item.id)).toContain("daily_platform_radar");
    expect(contract.views.map((item) => item.id)).toContain("platform");

    const topicResponse = await app.request("/api/topics", {
      method: "POST",
      body: JSON.stringify({
        title: "弹幕说我今晚会被全家吸血",
        idea: "女主看见弹幕预告家人将逼她交出存款，决定先保存证据。",
        sellingPoint: "弹幕预警与家庭吸血反打",
        protagonistPressure: "亲情绑架、金钱压迫和舆论审判同时到来",
        mainConflict: "女主保住钱和尊严，家人要把她榨干",
        readerPayoff: "证据反杀、舆论翻盘、关系切割",
        targetPlatform: "番茄短故事",
        targetLength: "12000-20000 字"
      }),
      headers: { "content-type": "application/json" }
    });
    const topic = await topicResponse.json();
    expect(topicResponse.status).toBe(200);

    const selectedResponse = await app.request(`/api/topics/${topic.id}/select`, {
      method: "POST",
      body: JSON.stringify({ reason: "卖点清晰，冲突可持续升级。" }),
      headers: { "content-type": "application/json" }
    });
    expect(selectedResponse.status).toBe(200);

    const planResponse = await app.request(`/api/topics/${topic.id}/plans`, { method: "POST" });
    const plan = await planResponse.json();
    expect(planResponse.status).toBe(200);

    const completeResponse = await app.request(`/api/plans/${plan.id}/complete`, { method: "POST" });
    expect(completeResponse.status).toBe(200);

    const confirmResponse = await app.request(`/api/plans/${plan.id}/confirm`, { method: "POST" });
    expect(confirmResponse.status).toBe(200);

    const manuscriptResponse = await app.request(`/api/topics/${topic.id}/manuscripts`, {
      method: "POST",
      body: JSON.stringify({ planId: plan.id, title: topic.title }),
      headers: { "content-type": "application/json" }
    });
    const manuscript = await manuscriptResponse.json();
    expect(manuscriptResponse.status).toBe(200);

    const candidateResponse = await app.request(`/api/manuscripts/${manuscript.id}/actions`, {
      method: "POST",
      body: JSON.stringify({ planId: plan.id, actionType: "扩写第一章" }),
      headers: { "content-type": "application/json" }
    });
    const candidate = await candidateResponse.json();
    expect(candidateResponse.status).toBe(200);

    const reviewResponse = await app.request(`/api/candidates/${candidate.id}/review`, { method: "POST" });
    expect(reviewResponse.status).toBe(200);

    const mergeResponse = await app.request(`/api/candidates/${candidate.id}/merge`, { method: "POST" });
    expect(mergeResponse.status).toBe(200);

    const submissionResponse = await app.request(`/api/manuscripts/${manuscript.id}/submissions`, {
      method: "POST",
      body: JSON.stringify({ targetPlatform: "番茄短故事" }),
      headers: { "content-type": "application/json" }
    });
    expect(submissionResponse.status).toBe(200);

    const dashboardResponse = await app.request("/api/dashboard");
    const dashboard = await dashboardResponse.json();
    expect(dashboard.topics[0]?.id).toBe(topic.id);
    expect(dashboard.plans[0]?.id).toBe(plan.id);
    expect(dashboard.manuscripts[0]?.id).toBe(manuscript.id);
    expect(dashboard.candidates[0]?.status).toBe("merged");
    expect(dashboard.reviews[0]?.status).toBe("passed");
    expect(dashboard.submissions[0]?.sourceId).toBe(manuscript.id);
  });
});
