import { type Candidate, type Review, type SubmissionPackage, type WorkbenchActionId } from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { CandidateService } from "./candidateService.js";
import { ReviewService } from "./reviewService.js";
import { SubmissionService } from "./submissionService.js";

export interface ActionSideEffectRequest {
  action: WorkbenchActionId;
  manuscriptId?: string;
  planId?: string;
  candidateId?: string;
  targetPlatform?: string;
  instructions?: string;
}

export interface ActionSideEffectResult {
  candidate?: Candidate;
  review?: Review;
  submission?: SubmissionPackage;
}

export class ActionSideEffects {
  private readonly candidates: CandidateService;
  private readonly reviews: ReviewService;
  private readonly submissions: SubmissionService;

  constructor(private readonly store: FileProjectStore) {
    const assets = new AssetCatalog(store.root);
    this.candidates = new CandidateService(store, assets);
    this.reviews = new ReviewService(store);
    this.submissions = new SubmissionService(store);
  }

  perform(request: ActionSideEffectRequest): ActionSideEffectResult {
    if (isCandidateAction(request.action)) {
      return { candidate: this.createCandidate(request) };
    }
    if (request.action === "review_candidate") {
      const candidateId = request.candidateId ?? this.latestCandidateId(request.manuscriptId);
      return { review: this.reviews.reviewCandidate(candidateId) };
    }
    if (request.action === "submission_package") {
      const manuscriptId = requireValue(request.manuscriptId, "manuscriptId");
      return { submission: this.submissions.buildPackage(manuscriptId, request.targetPlatform ?? "番茄短故事") };
    }
    return {};
  }

  private createCandidate(request: ActionSideEffectRequest): Candidate {
    const manuscriptId = requireValue(request.manuscriptId, "manuscriptId");
    const planId = requireValue(request.planId, "planId");
    return this.candidates.runAction(request.action, manuscriptId, planId, request.instructions);
  }

  private latestCandidateId(manuscriptId: string | undefined): string {
    const candidates = this.store.candidates
      .list()
      .filter((candidate) => !manuscriptId || candidate.manuscriptId === manuscriptId)
      .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt));
    return requireValue(candidates[0]?.id, "candidateId");
  }
}

function isCandidateAction(action: WorkbenchActionId): boolean {
  return action === "continue" || action === "revise_ai" || action === "repair_candidate";
}

function requireValue(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is required`);
  return value;
}
