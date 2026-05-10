import {
  type ActionAvailability,
  type Candidate,
  type Manuscript,
  type Plan,
  type Review,
  type SubmissionPackage,
  type WorkbenchActionId,
  workbenchActionIds
} from "@huanwrite/shared";
import { isCompletePlan } from "./planCompleteness.js";

export interface ActionAvailabilityInput {
  manuscript?: Manuscript;
  plan?: Plan;
  candidates: Candidate[];
  reviews: Review[];
  submissions: SubmissionPackage[];
}

export function buildActionAvailability(input: ActionAvailabilityInput): Record<WorkbenchActionId, ActionAvailability> {
  return Object.fromEntries(workbenchActionIds.map((action) => [action, evaluateAction(action, input)])) as Record<
    WorkbenchActionId,
    ActionAvailability
  >;
}

export function requireEnabledAction(action: WorkbenchActionId, input: ActionAvailabilityInput): void {
  const availability = evaluateAction(action, input);
  if (!availability.enabled) throw new Error(availability.reason);
}

function evaluateAction(action: WorkbenchActionId, input: ActionAvailabilityInput): ActionAvailability {
  const guard = guardAction(action, input);
  return {
    action,
    enabled: guard === "",
    reason: guard
  };
}

function guardAction(action: WorkbenchActionId, input: ActionAvailabilityInput): string {
  if (action === "daily_platform_radar") return "";
  if (!input.plan) return "需要先创建规划";
  if (
    action === "plan_story" ||
    action === "replan_story" ||
    action === "polish_plan" ||
    action === "brainstorm_plan" ||
    action === "audit_story_state" ||
    action === "platform_radar"
  ) {
    return "";
  }
  if (!input.manuscript) return "需要先创建正文工程";
  if (action === "submission_package") {
    if (input.manuscript.charCount <= 0) return "正文为空，不能生成投稿包";
    return "";
  }
  if (action === "drama_adapt") {
    if (input.manuscript.charCount <= 0) return "正文为空，不能做短剧改编";
    return "";
  }
  if (!isCompletePlan(input.plan)) return "规划未补齐，不能进入正文动作";
  if (input.plan.status !== "confirmed") return "规划未确认，不能进入正文动作";
  if (action === "continue" || action === "revise_ai") return "";
  if (action === "review_candidate") {
    return latestCandidate(input.candidates, input.manuscript.id) ? "" : "没有可审稿的正文候选";
  }
  if (action === "repair_candidate") {
    return latestReview(input.candidates, input.reviews, input.manuscript.id) ? "" : "没有候选审稿报告，不能按审稿返修";
  }
  if (action === "merge_brief") {
    return latestReviewedCandidate(input.candidates, input.manuscript.id) ? "" : "没有已审稿候选，不能生成合入简报";
  }
  return "";
}

function latestCandidate(candidates: Candidate[], manuscriptId: string): Candidate | undefined {
  return candidates
    .filter((candidate) => candidate.manuscriptId === manuscriptId && candidate.status !== "merged")
    .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))[0];
}

function latestReviewedCandidate(candidates: Candidate[], manuscriptId: string): Candidate | undefined {
  return candidates
    .filter((candidate) => candidate.manuscriptId === manuscriptId && (candidate.status === "approved" || candidate.status === "merged"))
    .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))[0];
}

function latestReview(candidates: Candidate[], reviews: Review[], manuscriptId: string): Review | undefined {
  const candidateIds = new Set(
    candidates.filter((candidate) => candidate.manuscriptId === manuscriptId).map((candidate) => candidate.id)
  );
  return reviews
    .filter((review) => candidateIds.has(review.candidateId))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];
}
