import { type DashboardPlan, type DashboardPlanDetail } from "../dashboardSchema.js";

export type PlanEditorPayload = DashboardPlan &
  DashboardPlanDetail & {
    relationships: string[];
    structureCards: DashboardPlan["structureCards"];
    styleRules: string[];
    bannedPhrases: string[];
    fatigueWords: string[];
  };
