import { type WorkbenchActionId } from "@huanwrite/shared";
import { type ActionRun } from "./actionRunService.js";

export interface ActionRunTextInput {
  run: ActionRun;
  manuscriptTitle: string;
  manuscriptId?: string;
  planId?: string;
  candidateId?: string;
  createdCandidateId?: string;
  reviewId?: string;
  submissionId?: string;
  targetPlatform?: string;
  clientTraceId?: string;
  instructions?: string;
}

export function renderActionRunText(input: ActionRunTextInput): string {
  return [
    actionTitle(input.run.action),
    "",
    `- runId: ${input.run.id}`,
    `- status: ${input.run.status}`,
    `- manuscriptId: ${input.manuscriptId ?? ""}`,
    `- planId: ${input.planId ?? ""}`,
    `- candidateId: ${input.candidateId ?? ""}`,
    `- createdCandidateId: ${input.createdCandidateId ?? ""}`,
    `- reviewId: ${input.reviewId ?? ""}`,
    `- submissionId: ${input.submissionId ?? ""}`,
    `- targetPlatform: ${input.targetPlatform ?? ""}`,
    `- clientTraceId: ${input.clientTraceId ?? ""}`,
    `- promptHash: ${input.run.promptHash}`,
    `- promptRegistryKey: ${input.run.promptRegistryKey}`,
    `- model: ${input.run.model}`,
    "",
    actionBody(input.run.action),
    "",
    "## 本次输入",
    "",
    `- title: ${input.manuscriptTitle}`,
    `- instructions: ${input.instructions ?? ""}`,
    "",
    input.instructions ?? "本次动作由本地确定性动作引擎生成。"
  ].join("\n");
}

function actionTitle(action: WorkbenchActionId): string {
  return `# ${action}`;
}

function actionBody(action: WorkbenchActionId): string {
  if (action === "plan_story") return "## 写前规划\n\n已生成结构卡、人物关系、文风规则和确认前检查项。";
  if (action === "replan_story") return "## 重新规划\n\n基于当前题材、结构卡和人工指令生成规划替代方案。";
  if (action === "polish_plan") return "## 润色规划\n\n检查章节摘要、主角目标、冲突、转折、钩子、OOC 风险和人工备注。";
  if (action === "brainstorm_plan") return "## 头脑风暴\n\n围绕证据物件、反转、平台卖点和章节钩子给出备选方案。";
  if (action === "audit_story_state") return "## 状态审计\n\n已检查规划、正文、候选、审稿和投稿状态。";
  if (action === "merge_brief") return "## 合入简报\n\n候选合入前需要核对接缝、重复段落和正文承接。";
  if (action === "drama_adapt") return "## 短剧改编\n\n输出 10 集一卡、人物小传、每集冲突和结尾钩子。";
  if (action === "platform_radar") return "## 平台雷达\n\n基于当前公开规则和稿件状态给出投放优先级。";
  if (action === "daily_platform_radar") return "## 每日平台雷达\n\n只抓公开信息，失败源只记录失败，不推断事实。";
  if (action === "submission_package") return "## 投稿包\n\n已生成标题、简介、标签、平台备注和投前清单。";
  if (action === "review_candidate") return "## 候选审稿\n\n已按当前候选正文和确认规划生成审稿结论。";
  return "## 正文候选\n\n已生成候选正文，等待审稿后再合入正式稿。";
}
