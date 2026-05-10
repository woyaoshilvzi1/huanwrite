import { type Review } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";

const candidateContentMarker = "# 正文候选";

export class ReviewService {
  constructor(private readonly store: FileProjectStore) {}

  reviewCandidate(candidateId: string): Review {
    const candidate = this.store.candidates.get(candidateId);
    const plan = this.store.plans.get(candidate.planId);
    const candidateText = this.store.candidates.readText(candidate);
    const issues = this.collectIssues(plan.status, candidateText);
    const passed = issues.length === 0;
    const review: Review = {
      id: newId("review"),
      candidateId,
      basis: ["current manuscript", "confirmed plan", "candidate text"],
      conclusion: passed ? "passed" : "failed",
      issues,
      suggestions: passed ? [] : ["按已确认规划重新生成候选正文"],
      riskLevel: passed ? "low" : "high",
      status: passed ? "passed" : "failed",
      createdAt: nowIso()
    };
    this.store.reviews.save(review);
    this.store.candidates.save({
      ...candidate,
      reviewId: review.id,
      status: passed ? "approved" : "needs-revision"
    });
    return review;
  }

  private collectIssues(planStatus: string, candidateText: string): string[] {
    const issues: string[] = [];
    if (planStatus !== "confirmed") issues.push("候选未关联已确认规划");
    if (!candidateText.includes(candidateContentMarker)) issues.push("候选缺少正文内容");
    return issues;
  }
}
