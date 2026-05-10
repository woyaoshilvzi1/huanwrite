import { AiProviderConfigReader } from "../config/aiProviderConfig.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { buildActionAvailability } from "./actionAvailability.js";

export interface HealthSnapshot {
  ok: true;
  project: "huanwrite";
  api: {
    configured: boolean;
    provider: string;
    model: string;
    baseUrl: string;
    error: string;
  };
  counts: {
    topics: number;
    plans: number;
    manuscripts: number;
    manuscriptsWithContent: number;
    candidates: number;
    reviews: number;
    submissions: number;
    runs: number;
    jobs: number;
  };
  issues: string[];
  actions: Array<{
    manuscriptId: string;
    title: string;
    blocked: Array<{
      action: string;
      reason: string;
    }>;
  }>;
  recentJobs: Array<{
    id: string;
    action: string;
    status: string;
    progress: number;
    stage: string;
  }>;
}

export class HealthService {
  constructor(private readonly store: FileProjectStore) {}

  read(): HealthSnapshot {
    const topics = this.store.topics.list();
    const plans = this.store.plans.list();
    const manuscripts = this.store.manuscripts.list();
    const candidates = this.store.candidates.list();
    const reviews = this.store.reviews.list();
    const submissions = this.store.submissions.list();
    const jobs = this.store.backgroundJobs.list();
    const runs = this.store.actionRuns.list();
    const api = this.readApiStatus();
    const issues = [
      ...plans.filter((plan) => plan.status !== "confirmed").map((plan) => `规划未确认：${plan.id}`),
      ...manuscripts.filter((manuscript) => manuscript.charCount === 0).map((manuscript) => `正文为空：${manuscript.title}`)
    ];
    return {
      ok: true,
      project: "huanwrite",
      api,
      counts: {
        topics: topics.length,
        plans: plans.length,
        manuscripts: manuscripts.length,
        manuscriptsWithContent: manuscripts.filter((manuscript) => manuscript.charCount > 0).length,
        candidates: candidates.length,
        reviews: reviews.length,
        submissions: submissions.length,
        runs: runs.length,
        jobs: jobs.length
      },
      issues,
      actions: manuscripts.map((manuscript) => {
        const plan = plans.find((item) => item.id === manuscript.currentPlanId);
        const availability = buildActionAvailability({ manuscript, plan, candidates, reviews, submissions });
        return {
          manuscriptId: manuscript.id,
          title: manuscript.title,
          blocked: Object.values(availability)
            .filter((item) => !item.enabled)
            .map((item) => ({ action: item.action, reason: item.reason }))
        };
      }),
      recentJobs: jobs.slice(-10).map((job) => ({
        id: job.id,
        action: job.action,
        status: job.status,
        progress: job.progress,
        stage: job.stage
      }))
    };
  }

  private readApiStatus(): HealthSnapshot["api"] {
    try {
      const active = new AiProviderConfigReader().readActive();
      return {
        configured: true,
        provider: active.id,
        model: active.model,
        baseUrl: active.baseUrl,
        error: ""
      };
    } catch (error) {
      return {
        configured: false,
        provider: "",
        model: "",
        baseUrl: "",
        error: error instanceof Error ? error.message : "configuration read failed"
      };
    }
  }
}
