import { type WorkbenchActionId } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { type BackgroundJobRecord } from "../repositories/backgroundJobRepository.js";
import { FileProjectStore } from "../repositories/projectStore.js";

export class ActionJobService {
  constructor(private readonly store: FileProjectStore) {}

  start(action: WorkbenchActionId): BackgroundJobRecord {
    const timestamp = nowIso();
    return this.store.backgroundJobs.save({
      id: newId("job"),
      action,
      status: "running",
      progress: 5,
      stage: "queued",
      logs: ["动作已进入本地执行队列"],
      stopRequested: false,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  complete(job: BackgroundJobRecord, runId: string): BackgroundJobRecord {
    return this.store.backgroundJobs.save({
      ...job,
      runId,
      status: "done",
      progress: 100,
      stage: "done",
      logs: [...job.logs, `run 已完成：${runId}`],
      updatedAt: nowIso()
    });
  }

  fail(job: BackgroundJobRecord, error: Error): BackgroundJobRecord {
    return this.store.backgroundJobs.save({
      ...job,
      status: "error",
      progress: Math.max(job.progress, 5),
      stage: "error",
      logs: [...job.logs, error.message],
      updatedAt: nowIso()
    });
  }

  list(): BackgroundJobRecord[] {
    return this.store.backgroundJobs.list();
  }

  get(jobId: string): BackgroundJobRecord {
    return this.store.backgroundJobs.get(jobId);
  }

  stop(jobId: string): BackgroundJobRecord {
    const job = this.store.backgroundJobs.get(jobId);
    if (job.status === "running") {
      return this.store.backgroundJobs.save({
        ...job,
        status: "cancelled",
        progress: Math.min(job.progress, 99),
        stage: "cancelled",
        stopRequested: true,
        logs: [...job.logs, "用户请求停止，任务已取消"],
        updatedAt: nowIso()
      });
    }
    return this.store.backgroundJobs.save({
      ...job,
      stopRequested: true,
      logs: [...job.logs, "用户请求停止，任务已结束，记录停止请求"],
      updatedAt: nowIso()
    });
  }
}
