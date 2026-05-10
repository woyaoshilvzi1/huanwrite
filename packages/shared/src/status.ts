export const topicStatuses = ["idea", "screening", "selected", "paused", "discarded"] as const;
export const planStatuses = ["draft", "ready-for-review", "confirmed", "dirty", "archived"] as const;
export const candidateStatuses = [
  "generated",
  "under-review",
  "approved",
  "needs-revision",
  "manual-merge-required",
  "merged",
  "discarded"
] as const;
export const manuscriptStatuses = [
  "empty",
  "drafting",
  "reviewing",
  "ready-for-submission",
  "submitted",
  "paused"
] as const;
export const reviewStatuses = ["pending", "running", "passed", "failed", "requires-human"] as const;
export const submissionStatuses = [
  "package-draft",
  "package-confirmed",
  "submitted",
  "response-received",
  "accepted",
  "rejected",
  "contracting",
  "paid",
  "closed"
] as const;

export type TopicStatus = (typeof topicStatuses)[number];
export type PlanStatus = (typeof planStatuses)[number];
export type CandidateStatus = (typeof candidateStatuses)[number];
export type ManuscriptStatus = (typeof manuscriptStatuses)[number];
export type ReviewStatus = (typeof reviewStatuses)[number];
export type SubmissionStatus = (typeof submissionStatuses)[number];

