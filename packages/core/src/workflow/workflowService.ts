import { type Candidate, type Manuscript, type Plan, type Review, type SubmissionPackage, type Topic } from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { CandidateService } from "../services/candidateService.js";
import { DashboardService, type WorkflowDashboard } from "../services/dashboardService.js";
import { ManuscriptService } from "../services/manuscriptService.js";
import { PlanService, type PlanUpdateInput } from "../services/planService.js";
import { ReviewService } from "../services/reviewService.js";
import { SubmissionService } from "../services/submissionService.js";
import { TopicService, type TopicInput } from "../services/topicService.js";
import { WorkbenchMetaService, type WorkbenchMetaUpdate } from "../services/workbenchMetaService.js";
import { ActionRunService, type ActionJobStartResult, type ActionRun, type ActionRunRequest, type ActionRunResult, type UiEvent, type UiEventInput } from "../services/actionRunService.js";
import { PlatformRadarService } from "../services/platformRadarService.js";
import { ReferenceContextService } from "../services/referenceContextService.js";
import { HealthService } from "../services/healthService.js";
import { EvalBaselineService } from "../services/evalBaselineService.js";
import { WorkflowEvents, type WorkflowEventListener, type WorkflowEventName } from "../services/workflowEvents.js";

export class WorkflowService {
  private readonly store: FileProjectStore;
  private readonly topics: TopicService;
  private readonly plans: PlanService;
  private readonly manuscripts: ManuscriptService;
  private readonly candidates: CandidateService;
  private readonly reviews: ReviewService;
  private readonly submissions: SubmissionService;
  private readonly dashboards: DashboardService;
  private readonly actionRuns: ActionRunService;
  private readonly workbenchMeta: WorkbenchMetaService;
  private readonly references: ReferenceContextService;
  private readonly health: HealthService;
  private readonly evals: EvalBaselineService;
  private readonly platformRadar: PlatformRadarService;
  private readonly events: WorkflowEvents;

  constructor(store: FileProjectStore) {
    this.store = store;
    this.events = new WorkflowEvents();
    const assets = new AssetCatalog(store.root);
    this.topics = new TopicService(store);
    this.plans = new PlanService(store, assets);
    this.manuscripts = new ManuscriptService(store);
    this.candidates = new CandidateService(store, assets);
    this.reviews = new ReviewService(store);
    this.submissions = new SubmissionService(store);
    this.dashboards = new DashboardService(store);
    this.actionRuns = new ActionRunService(store, this.events);
    this.workbenchMeta = new WorkbenchMetaService(store);
    this.references = new ReferenceContextService(store.root);
    this.health = new HealthService(store);
    this.evals = new EvalBaselineService(store);
    this.platformRadar = new PlatformRadarService();
  }

  createTopic(input: TopicInput): Topic {
    return this.topics.create(input);
  }

  selectTopic(topicId: string, reason: string): Topic {
    return this.topics.select(topicId, reason);
  }

  createPlan(topicId: string): Plan {
    return this.plans.create(topicId);
  }

  completePlan(planId: string): Plan {
    return this.plans.complete(planId);
  }

  confirmPlan(planId: string): Plan {
    return this.plans.confirm(planId);
  }

  updatePlan(planId: string, input: PlanUpdateInput): Plan {
    return this.plans.update(planId, input);
  }

  createManuscript(topicId: string, planId: string, title: string): Manuscript {
    return this.manuscripts.create(topicId, planId, title);
  }

  readManuscriptText(manuscriptId: string): string {
    return this.manuscripts.readText(manuscriptId);
  }

  saveManuscriptText(manuscriptId: string, text: string): Manuscript {
    return this.manuscripts.saveText(manuscriptId, text);
  }

  runAction(actionType: string, manuscriptId: string, planId: string): Candidate {
    return this.candidates.runAction(actionType, manuscriptId, planId);
  }

  reviewCandidate(candidateId: string): Review {
    return this.reviews.reviewCandidate(candidateId);
  }

  mergeCandidate(candidateId: string): Manuscript {
    return this.manuscripts.mergeCandidate(candidateId);
  }

  buildSubmissionPackage(manuscriptId: string, targetPlatform: string): SubmissionPackage {
    return this.submissions.buildPackage(manuscriptId, targetPlatform);
  }

  dashboard(): WorkflowDashboard {
    return this.dashboards.read();
  }

  updateManuscriptWorkbench(manuscriptId: string, input: WorkbenchMetaUpdate) {
    return this.workbenchMeta.update(manuscriptId, input);
  }

  runWorkbenchAction(request: ActionRunRequest): Promise<ActionRunResult> {
    return this.actionRuns.run(request);
  }

  startWorkbenchAction(request: ActionRunRequest): ActionJobStartResult {
    return this.actionRuns.start(request);
  }

  listRuns(): ActionRun[] {
    return this.actionRuns.listRuns();
  }

  listJobs() {
    return this.actionRuns.listJobs();
  }

  getJob(jobId: string) {
    return this.actionRuns.getJob(jobId);
  }

  stopJob(jobId: string) {
    return this.actionRuns.stopJob(jobId);
  }

  readRunText(runId: string): string {
    return this.actionRuns.readRunText(runId);
  }

  readRunTrace(runId: string): string {
    return this.actionRuns.readRunTrace(runId);
  }

  appendEvent(input: UiEventInput): UiEvent {
    return this.actionRuns.appendEvent(input);
  }

  listEvents(traceId?: string): UiEvent[] {
    return this.actionRuns.listEvents(traceId);
  }

  referenceContext() {
    return this.references.read();
  }

  platformRadarSnapshot() {
    return this.platformRadar.snapshot(this.dashboard());
  }

  healthSnapshot() {
    return this.health.read();
  }

  evalBaseline() {
    return this.evals.read();
  }

  on<T extends WorkflowEventName>(event: T, listener: WorkflowEventListener<T>): () => void {
    return this.events.on(event, listener);
  }

  close(): void {
    this.store.close();
  }
}

export type { TopicInput, WorkflowDashboard };
