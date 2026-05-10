import { type Dashboard } from "../dashboardSchema.js";

export interface ActionRunSummary {
  id: string;
  action: string;
  status: string;
  outputPath: string;
  promptHash: string;
  promptRegistryKey: string;
  model: string;
  harness: {
    grade: string;
    checks: string[];
  };
  createdAt?: string;
}

export interface RunOutputResponse {
  runId: string;
  content: string;
}

export interface RunsResponse {
  runs: ActionRunSummary[];
}

export interface JobsResponse {
  jobs: BackgroundJobSummary[];
}

export interface BackgroundJobSummary {
  id: string;
  runId?: string;
  action: string;
  status: string;
  progress: number;
  stage: string;
  logs: string[];
}

export interface ReferenceContextResponse {
  references: Array<{
    label: string;
    path: string;
    content: string;
  }>;
}

export interface PlatformRadarSnapshot {
  conclusion: string;
  evidenceScore: number;
  evidence: Array<{
    source: string;
    summary: string;
    score: number;
    usable: boolean;
  }>;
  laneMatches: Array<{
    manuscriptId: string;
    title: string;
    targetPlatform: string;
    readiness: number;
    nextAction: string;
  }>;
  noiseDownranking: string[];
  unknowns: string[];
  recommendations: string[];
}

export type PlanUpdatePayload = Dashboard["plans"][number] &
  Dashboard["planDetails"][number] & {
    relationships: string[];
    structureCards: Array<{
      title: string;
      summary: string;
      targetWords: string;
      sceneCount: string;
      characters: string;
      goal: string;
      protagonistGoal: string;
      conflict: string;
      change: string;
      turningPoint: string;
      hook: string;
      payoffHook: string;
      oocRisk: string;
      humanNote: string;
    }>;
    styleRules: string[];
    bannedPhrases: string[];
    fatigueWords: string[];
  };
