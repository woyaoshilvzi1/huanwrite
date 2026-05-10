import { type Candidate, type Review, type SubmissionPackage, workbenchActionIds, type WorkbenchActionId } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { type ActionRunRecord } from "../repositories/actionRunRepository.js";
import { type BackgroundJobRecord } from "../repositories/backgroundJobRepository.js";
import { type UiEventRecord } from "../repositories/uiEventRepository.js";
import { requireEnabledAction } from "./actionAvailability.js";
import { renderActionRunText } from "./actionRunText.js";
import { promptHash, promptRegistryKey } from "./actionRunObservation.js";
import { ActionJobService } from "./actionJobService.js";
import { ActionSideEffects } from "./actionSideEffects.js";
import { AiActionClient, type AiActionResult } from "./aiActionClient.js";
import { type WorkflowEvents } from "./workflowEvents.js";

export interface ActionRunRequest {
  action: WorkbenchActionId;
  manuscriptId?: string;
  planId?: string;
  candidateId?: string;
  targetPlatform?: string;
  instructions?: string;
  clientTraceId?: string;
}

export type ActionRun = ActionRunRecord;
export type BackgroundJob = BackgroundJobRecord;

export interface ActionRunResult {
  run: ActionRun;
  job: BackgroundJob;
  candidate?: Candidate;
  review?: Review;
  submission?: SubmissionPackage;
}

export interface ActionJobStartResult {
  job: BackgroundJob;
}

export interface UiEventInput {
  type: string;
  traceId?: string;
  action?: WorkbenchActionId;
  message?: string;
}

export type UiEvent = UiEventRecord;

export class ActionRunService {
  private readonly jobs: ActionJobService;
  private readonly sideEffects: ActionSideEffects;
  private readonly ai: AiActionClient;

  constructor(
    private readonly store: FileProjectStore,
    private readonly events?: WorkflowEvents
  ) {
    this.jobs = new ActionJobService(store);
    this.sideEffects = new ActionSideEffects(store);
    this.ai = new AiActionClient();
  }

  start(request: ActionRunRequest): ActionJobStartResult {
    assertWorkbenchAction(request.action);
    this.requireAvailable(request);
    const job = this.jobs.start(request.action);
    this.events?.emit("job.updated", { job });
    queueMicrotask(() => this.finishQueuedJob(job, request));
    return { job };
  }

  async run(request: ActionRunRequest): Promise<ActionRunResult> {
    assertWorkbenchAction(request.action);
    this.requireAvailable(request);
    const job = this.jobs.start(request.action);
    this.events?.emit("job.updated", { job });
    return this.execute(job, request);
  }

  private async finishQueuedJob(job: BackgroundJobRecord, request: ActionRunRequest): Promise<void> {
    try {
      const latest = this.jobs.get(job.id);
      if (latest.stopRequested || latest.status === "cancelled") return;
      await this.execute(job, request);
    } catch (error) {
      this.events?.emit("job.updated", { job: this.jobs.fail(job, error instanceof Error ? error : new Error("action failed")) });
    }
  }

  private async execute(job: BackgroundJobRecord, request: ActionRunRequest): Promise<ActionRunResult> {
    const latestJob = this.jobs.get(job.id);
    if (latestJob.stopRequested || latestJob.status === "cancelled") throw new Error("job was cancelled before execution");
    const sideEffect = this.sideEffects.perform(request);
    const aiResult = await this.ai.complete(this.buildAiInput(request));
    const id = newId("run");
    const run: ActionRun = {
      id,
      action: request.action,
      status: "done",
      outputPath: this.store.paths.fromRoot(this.store.paths.actionRunBody(id)),
      manuscriptId: request.manuscriptId,
      planId: request.planId,
      candidateId: sideEffect.candidate?.id ?? request.candidateId,
      reviewId: sideEffect.review?.id,
      submissionId: sideEffect.submission?.id,
      clientTraceId: request.clientTraceId,
      promptHash: promptHash(request),
      promptRegistryKey: promptRegistryKey(request.action),
      model: aiResult.model,
      usage: {
        inputChars: aiResult.usage.inputChars,
        outputChars: aiResult.usage.outputChars
      },
      harness: {
        grade: "PASS",
        checks: ["action-available", "output-written", aiResult.apiUsed ? "provider-api-used" : "local-fallback-recorded"]
      },
      createdAt: nowIso()
    };
    this.writeActionOutput(run, request, sideEffect, aiResult);
    this.writeActionTrace(run, request, aiResult);
    run.usage.outputChars = this.store.text.read(this.store.paths.toRooted(run.outputPath)).length;
    this.store.actionRuns.save(run);
    const doneJob = this.jobs.complete(job, run.id);
    this.events?.emit("job.updated", { job: doneJob });
    return { run, job: doneJob, ...sideEffect };
  }

  listRuns(): ActionRun[] {
    return this.store.actionRuns.list();
  }

  listJobs(): BackgroundJob[] {
    return this.jobs.list();
  }

  getJob(jobId: string): BackgroundJob {
    return this.jobs.get(jobId);
  }

  stopJob(jobId: string): BackgroundJob {
    const job = this.jobs.stop(jobId);
    this.events?.emit("job.updated", { job });
    return job;
  }

  readRunText(runId: string): string {
    return this.store.text.read(this.store.paths.actionRunBody(runId));
  }

  readRunTrace(runId: string): string {
    return this.store.text.read(this.store.paths.actionRunTrace(runId));
  }

  appendEvent(input: UiEventInput): UiEvent {
    const event: UiEvent = {
      ...input,
      id: newId("event"),
      createdAt: nowIso()
    };
    return this.store.uiEvents.save(event);
  }

  listEvents(traceId?: string): UiEvent[] {
    return this.store.uiEvents.list(traceId);
  }

  private requireAvailable(request: ActionRunRequest): void {
    if (!request.manuscriptId && request.action === "daily_platform_radar") return;
    const manuscript = request.manuscriptId ? this.store.manuscripts.get(request.manuscriptId) : undefined;
    const plan = request.planId ? this.store.plans.get(request.planId) : manuscript ? this.store.plans.get(manuscript.currentPlanId) : undefined;
    requireEnabledAction(request.action, {
      manuscript,
      plan,
      candidates: this.store.candidates.list(),
      reviews: this.store.reviews.list(),
      submissions: this.store.submissions.list()
    });
  }

  private buildAiInput(request: ActionRunRequest): { systemPrompt: string; userPrompt: string } {
    const manuscript = request.manuscriptId ? this.store.manuscripts.get(request.manuscriptId) : undefined;
    const plan = request.planId ? this.store.plans.get(request.planId) : manuscript ? this.store.plans.get(manuscript.currentPlanId) : undefined;
    return {
      systemPrompt: "你是 Huanwrite 本地写作工作台的动作执行器，只输出可审计、可合入、可复核的中文网文生产结果。",
      userPrompt: JSON.stringify({
        action: request.action,
        manuscriptTitle: manuscript?.title ?? "",
        plan: plan
          ? {
              storyPromise: plan.storyPromise,
              protagonistGoal: plan.protagonistGoal,
              mainConflict: plan.mainConflict,
              structureCards: plan.structureCards
            }
          : undefined,
        instructions: request.instructions ?? ""
      })
    };
  }

  private writeActionOutput(
    run: ActionRun,
    request: ActionRunRequest,
    result: Omit<ActionRunResult, "run" | "job">,
    aiResult: AiActionResult
  ): void {
    const manuscriptTitle = request.manuscriptId ? this.store.manuscripts.get(request.manuscriptId).title : "";
    this.store.text.write(
      this.store.paths.toRooted(run.outputPath),
      [
        renderActionRunText({
          run,
          manuscriptTitle,
          manuscriptId: request.manuscriptId,
          planId: request.planId,
          candidateId: request.candidateId,
          createdCandidateId: result.candidate?.id,
          reviewId: result.review?.id,
          submissionId: result.submission?.id,
          targetPlatform: request.targetPlatform,
          clientTraceId: request.clientTraceId,
          instructions: request.instructions
        }),
        "",
        "## 模型执行结果",
        "",
        `- apiUsed: ${aiResult.apiUsed}`,
        `- endpoint: ${aiResult.endpoint}`,
        `- responseId: ${aiResult.responseId}`,
        `- providerError: ${aiResult.error}`,
        "",
        aiResult.content
      ].join("\n")
    );
  }

  private writeActionTrace(run: ActionRun, request: ActionRunRequest, aiResult: AiActionResult): void {
    this.store.text.write(
      this.store.paths.actionRunTrace(run.id),
      JSON.stringify(
        {
          runId: run.id,
          action: run.action,
          promptHash: run.promptHash,
          promptRegistryKey: run.promptRegistryKey,
          model: run.model,
          usage: run.usage,
          harness: run.harness,
          apiUsed: aiResult.apiUsed,
          endpoint: aiResult.endpoint,
          responseId: aiResult.responseId,
          providerError: aiResult.error,
          clientTraceId: run.clientTraceId,
          manuscriptId: run.manuscriptId,
          planId: run.planId,
          candidateId: run.candidateId,
          reviewId: run.reviewId,
          submissionId: run.submissionId,
          targetPlatform: request.targetPlatform,
          createdAt: run.createdAt
        },
        null,
        2
      )
    );
  }
}

function assertWorkbenchAction(action: WorkbenchActionId): void {
  if (!workbenchActionIds.includes(action)) throw new Error(`unknown workbench action: ${action}`);
}
