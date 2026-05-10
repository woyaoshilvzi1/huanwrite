import { z } from "zod";

export const workbenchActionIds = [
  "plan_story",
  "replan_story",
  "polish_plan",
  "brainstorm_plan",
  "audit_story_state",
  "continue",
  "revise_ai",
  "repair_candidate",
  "review_candidate",
  "merge_brief",
  "submission_package",
  "drama_adapt",
  "platform_radar",
  "daily_platform_radar"
] as const;

export type WorkbenchActionId = (typeof workbenchActionIds)[number];
export const workbenchActionIdSchema = z.enum(workbenchActionIds);

export interface WorkbenchActionContract {
  id: WorkbenchActionId;
  label: string;
  description: string;
}

export const workbenchActionContracts: WorkbenchActionContract[] = [
  {
    id: "plan_story",
    label: "写前规划",
    description: "补齐 story-state、章节卡、人物关系、文风和技法卡，是正文链路入口。"
  },
  {
    id: "replan_story",
    label: "重新规划",
    description: "基于当前题材和人工指令重新生成规划建议，保存为可审计动作输出。"
  },
  {
    id: "polish_plan",
    label: "润色规划",
    description: "检查结构卡、人物关系和文风表单，输出可直接改写的规划润色稿。"
  },
  {
    id: "brainstorm_plan",
    label: "头脑风暴",
    description: "围绕冲突、证据物件、钩子和平台匹配生成备选方案。"
  },
  {
    id: "audit_story_state",
    label: "状态审计",
    description: "检查 story-state 完整性、缺项和下一步动作。"
  },
  {
    id: "continue",
    label: "续写",
    description: "基于已确认规划生成正文候选，不直接覆盖正文。"
  },
  {
    id: "revise_ai",
    label: "去 AI 返修",
    description: "输出问题清单和可替换改写片段，不直接覆盖正文。"
  },
  {
    id: "repair_candidate",
    label: "按审稿返修",
    description: "根据候选审稿报告生成修复候选。"
  },
  {
    id: "review_candidate",
    label: "候选审稿",
    description: "审核最新候选是否允许合入正文。"
  },
  {
    id: "merge_brief",
    label: "合入简报",
    description: "生成接缝和人工合入说明，不直接改正文。"
  },
  {
    id: "submission_package",
    label: "投稿包",
    description: "生成标题、简介、标签、平台备注和投前清单。"
  },
  {
    id: "drama_adapt",
    label: "短剧改编",
    description: "生成短剧一卡一集和人物小传。"
  },
  {
    id: "platform_radar",
    label: "平台雷达",
    description: "基于当前规则和雷达快照输出投放建议。"
  },
  {
    id: "daily_platform_radar",
    label: "每日平台雷达",
    description: "抓取公开平台信息并刷新今日雷达快照。"
  }
];

export const workbenchViewIds = ["dashboard", "planning", "editor", "runs", "reference", "platform"] as const;

export type WorkbenchViewId = (typeof workbenchViewIds)[number];

export interface WorkbenchViewContract {
  id: WorkbenchViewId;
  label: string;
  description: string;
}

export const workbenchViewContracts: WorkbenchViewContract[] = [
  { id: "dashboard", label: "看板", description: "题材、规划、正文、候选、审稿和投稿总览。" },
  { id: "planning", label: "规划", description: "结构卡、关系、文风和确认入口。" },
  { id: "editor", label: "写稿", description: "正文工程、候选生成和正文状态。" },
  { id: "runs", label: "输出", description: "动作输出、候选审稿、合入和运行记录。" },
  { id: "reference", label: "参考", description: "资产、模板、语料、规则和上下文。" },
  { id: "platform", label: "平台雷达", description: "平台公开规则、雷达快照和投前复核。" }
];

export interface WorkbenchContract {
  actions: WorkbenchActionContract[];
  views: WorkbenchViewContract[];
}

export function readWorkbenchContract(): WorkbenchContract {
  return {
    actions: workbenchActionContracts,
    views: workbenchViewContracts
  };
}
