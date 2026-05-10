import { type WorkflowDashboard } from "./dashboardService.js";

export interface PlatformRadarSnapshot {
  conclusion: string;
  evidenceScore: number;
  evidence: PlatformRadarEvidence[];
  laneMatches: PlatformRadarLaneMatch[];
  noiseDownranking: string[];
  unknowns: string[];
  recommendations: string[];
}

export interface PlatformRadarEvidence {
  source: string;
  summary: string;
  score: number;
  usable: boolean;
}

export interface PlatformRadarLaneMatch {
  manuscriptId: string;
  title: string;
  targetPlatform: string;
  readiness: number;
  nextAction: string;
}

export class PlatformRadarService {
  snapshot(dashboard: WorkflowDashboard): PlatformRadarSnapshot {
    const readySubmissions = dashboard.submissions.filter((item) => item.status === "package-draft").length;
    const draftingManuscripts = dashboard.manuscripts.filter((item) => item.status === "drafting").length;
    const evidence = buildEvidence(dashboard);
    const laneMatches = dashboard.manuscripts.map((manuscript) => {
      const plan = dashboard.plans.find((item) => item.id === manuscript.currentPlanId);
      const hasSubmission = dashboard.submissions.some((item) => item.sourceId === manuscript.id);
      return {
        manuscriptId: manuscript.id,
        title: manuscript.title,
        targetPlatform: plan?.targetPlatform ?? "未指定平台",
        readiness: manuscript.charCount > 0 ? (hasSubmission ? 90 : 60) : 20,
        nextAction: hasSubmission ? "投前规则复核" : manuscript.charCount > 0 ? "生成投稿包" : "补正文内容"
      };
    });
    return {
      conclusion: readySubmissions > 0 ? "已有投稿包，优先做投前规则复核。" : "先补齐正文和投稿包，再判断平台投放。",
      evidenceScore: Math.min(100, evidence.reduce((sum, item) => sum + item.score, 0) + readySubmissions * 10),
      evidence,
      laneMatches,
      noiseDownranking: ["未标来源的平台传言", "无法复核的收益截图", "没有日期的榜单总结"],
      unknowns: ["平台当天活动入口", "最新签约门槛", "人工审核尺度"],
      recommendations: ["保留公开来源截图和链接", "投稿前重新读取平台规则", "不要把无法确认的信息写成事实"]
    };
  }
}

function buildEvidence(dashboard: WorkflowDashboard): PlatformRadarEvidence[] {
  return [
    {
      source: "当前工作台投稿包",
      summary: `已生成投稿包 ${dashboard.submissions.length} 个，可作为投前复核输入。`,
      score: Math.min(30, dashboard.submissions.length * 15),
      usable: dashboard.submissions.length > 0
    },
    {
      source: "当前正文状态",
      summary: `已有正文内容的稿件 ${dashboard.manuscripts.filter((item) => item.charCount > 0).length} 条。`,
      score: Math.min(30, dashboard.manuscripts.filter((item) => item.charCount > 0).length * 10),
      usable: dashboard.manuscripts.some((item) => item.charCount > 0)
    },
    {
      source: "已确认规划",
      summary: `已确认规划 ${dashboard.plans.filter((item) => item.status === "confirmed").length} 个。`,
      score: Math.min(30, dashboard.plans.filter((item) => item.status === "confirmed").length * 10),
      usable: dashboard.plans.some((item) => item.status === "confirmed")
    }
  ];
}
