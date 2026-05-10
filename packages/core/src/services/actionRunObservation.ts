import { type ActionRunRequest } from "./actionRunService.js";

export function promptHash(request: ActionRunRequest): string {
  const text = [request.action, request.manuscriptId ?? "", request.planId ?? "", request.instructions ?? ""].join("|");
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function promptRegistryKey(action: ActionRunRequest["action"]): string {
  const registryKeys: Record<ActionRunRequest["action"], string> = {
    plan_story: "planning.story-state-complete",
    replan_story: "planning.story-state-regeneration",
    polish_plan: "planning.structure-polish",
    brainstorm_plan: "planning.idea-expansion",
    audit_story_state: "audit.story-state-integrity",
    continue: "draft.continuation-candidate",
    revise_ai: "draft.ai-flavor-revision",
    repair_candidate: "draft.review-guided-repair",
    review_candidate: "review.candidate-quality-gate",
    merge_brief: "merge.manual-seam-brief",
    submission_package: "submission.platform-package",
    drama_adapt: "adaptation.short-drama-package",
    platform_radar: "platform.manuscript-fit-brief",
    daily_platform_radar: "platform.public-radar-snapshot"
  };
  return registryKeys[action];
}
