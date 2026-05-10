import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FileProjectStore, WorkflowService } from "@huanwrite/core";

let root: string;
let workflow: WorkflowService;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "huanwrite-"));
  workflow = new WorkflowService(new FileProjectStore(root));
});

afterEach(() => {
  workflow.close();
  rmSync(root, { recursive: true, force: true });
});

describe("workflow", () => {
  it("requires selected topic before planning", () => {
    const topic = createTopic();
    expect(() => workflow.createPlan(topic.id)).toThrow(/selected/);

    workflow.selectTopic(topic.id, "卖点清晰");
    const plan = workflow.createPlan(topic.id);
    expect(plan.status).toBe("draft");
  });

  it("requires confirmed plan before candidate generation", () => {
    const topic = workflow.selectTopic(createTopic().id, "卖点清晰");
    const plan = workflow.createPlan(topic.id);
    const manuscript = workflow.createManuscript(topic.id, plan.id, topic.title);

    expect(() => workflow.runAction("continue-draft", manuscript.id, plan.id)).toThrow(/confirmed/);

    workflow.completePlan(plan.id);
    workflow.confirmPlan(plan.id);
    const candidate = workflow.runAction("continue-draft", manuscript.id, plan.id);
    expect(candidate.status).toBe("generated");
    expect(workflow.readManuscriptText(manuscript.id)).toBe("");
  });

  it("requires review before merge", () => {
    const topic = workflow.selectTopic(createTopic().id, "卖点清晰");
    const plan = workflow.confirmPlan(workflow.completePlan(workflow.createPlan(topic.id).id).id);
    const manuscript = workflow.createManuscript(topic.id, plan.id, topic.title);
    const candidate = workflow.runAction("continue-draft", manuscript.id, plan.id);

    expect(() => workflow.mergeCandidate(candidate.id)).toThrow(/approved/);

    const review = workflow.reviewCandidate(candidate.id);
    expect(review.conclusion).toBe("passed");
    workflow.mergeCandidate(candidate.id);
    expect(workflow.readManuscriptText(manuscript.id)).toContain("# 正文候选");
  });

  it("blocks empty overwrite and invalidates approved candidates when planning changes", () => {
    const topic = workflow.selectTopic(createTopic().id, "卖点清晰");
    const plan = workflow.confirmPlan(workflow.completePlan(workflow.createPlan(topic.id).id).id);
    const manuscript = workflow.createManuscript(topic.id, plan.id, topic.title);
    workflow.saveManuscriptText(manuscript.id, "已有正文");
    expect(() => workflow.saveManuscriptText(manuscript.id, "")).toThrow(/empty/);

    const candidate = workflow.runAction("continue-draft", manuscript.id, plan.id);
    workflow.reviewCandidate(candidate.id);
    const dashboardBefore = workflow.dashboard();
    const approved = dashboardBefore.candidates.find((item) => item.id === candidate.id);
    expect(approved?.status).toBe("approved");

    workflow.updatePlan(plan.id, {
      ...plan,
      storyPromise: `${plan.storyPromise} 加强冲突`,
      voiceFingerprints: ["主角短句反击"],
      styleFingerprints: ["证据推动"],
      craftCards: ["章节结尾必须有钩子"]
    });
    const dashboardAfter = workflow.dashboard();
    const invalidated = dashboardAfter.candidates.find((item) => item.id === candidate.id);
    expect(invalidated?.status).toBe("needs-revision");
    expect(() => workflow.mergeCandidate(candidate.id)).toThrow(/approved/);
  });

  it("rejects sensitive values from records", () => {
    expect(() =>
      workflow.createTopic({
        title: "bad",
        idea: "sk-test-secret must not be stored",
        sellingPoint: "x",
        protagonistPressure: "x",
        mainConflict: "x",
        readerPayoff: "x",
        targetPlatform: "x",
        targetLength: "x"
      })
    ).toThrow(/sensitive/);
  });
});

function createTopic() {
  return workflow.createTopic({
    title: "弹幕说我今晚会被全家吸血",
    idea: "女主看见弹幕预告家人将逼她交出存款，决定先保存证据。",
    sellingPoint: "弹幕预警与家庭吸血反打",
    protagonistPressure: "亲情绑架、金钱压迫和舆论审判同时到来",
    mainConflict: "女主保住钱和尊严，家人要把她榨干",
    readerPayoff: "证据反杀、舆论翻盘、关系切割",
    targetPlatform: "番茄短故事",
    targetLength: "12000-20000 字"
  });
}
