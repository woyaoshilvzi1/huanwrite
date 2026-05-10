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

  it("uses creative lane requirements as production facts", () => {
    const topic = workflow.createTopicFromLane("fanqie-urban-marriage", {
      title: "离婚冷静期第30天，我把前夫送上热搜",
      idea: "女主把婚内财产证据和舆论反击绑定在同一天爆发。",
      sellingPoint: "婚恋清算和热搜反打",
      protagonistPressure: "财产转移、亲友围攻和网络误解同时压来",
      mainConflict: "女主要守住财产和名誉，前夫要让她背锅",
      readerPayoff: "证据链公开、舆论翻盘、利益清算",
      targetPlatform: "会被稿线覆盖",
      targetLength: "会被稿线覆盖"
    });
    expect(topic.targetPlatform).toBe("番茄短故事");
    expect(topic.laneProfile?.laneId).toBe("fanqie-urban-marriage");

    workflow.selectTopic(topic.id, "雷达信号命中婚恋和热搜");
    const plan = workflow.completePlan(workflow.createPlan(topic.id).id);
    expect(plan.styleRules).toContain("稿线要求：婚恋关系要有明确损失账本");

    const manuscript = workflow.createManuscript(topic.id, plan.id, topic.title);
    const saved = workflow.dashboard().manuscripts.find((item) => item.id === manuscript.id);
    expect(saved?.workbench.laneProfile?.laneId).toBe("fanqie-urban-marriage");
    expect(saved?.workbench.qualityGates.map((gate) => gate.label)).toContain("冲突绑定钱/身份/资源/关系/舆论");
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
