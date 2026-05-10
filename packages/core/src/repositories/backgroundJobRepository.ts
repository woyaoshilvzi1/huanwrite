import { type WorkbenchActionId, workbenchActionIdSchema } from "@huanwrite/shared";
import { z } from "zod";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readInteger, readOptionalText, readStringArray, readText } from "../storage/sqliteRows.js";

export interface BackgroundJobRecord {
  id: string;
  runId?: string;
  action: WorkbenchActionId;
  status: "running" | "done" | "cancelled" | "error";
  progress: number;
  stage: string;
  logs: string[];
  stopRequested: boolean;
  createdAt: string;
  updatedAt: string;
}

const backgroundJobRecordSchema = z.object({
  id: z.string(),
  runId: z.string().optional(),
  action: workbenchActionIdSchema,
  status: z.enum(["running", "done", "cancelled", "error"]),
  progress: z.number().int().min(0).max(100),
  stage: z.string(),
  logs: z.array(z.string()),
  stopRequested: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export class BackgroundJobRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(job: BackgroundJobRecord): BackgroundJobRecord {
    this.database
      .prepare(
        `
        INSERT INTO background_jobs (
          id, run_id, action, status, progress, stage, logs, stop_requested, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          run_id = excluded.run_id,
          action = excluded.action,
          status = excluded.status,
          progress = excluded.progress,
          stage = excluded.stage,
          logs = excluded.logs,
          stop_requested = excluded.stop_requested,
          updated_at = excluded.updated_at
        `
      )
      .run(
        job.id,
        job.runId ?? null,
        job.action,
        job.status,
        job.progress,
        job.stage,
        JSON.stringify(job.logs),
        job.stopRequested ? 1 : 0,
        job.createdAt,
        job.updatedAt
      );
    return job;
  }

  get(id: string): BackgroundJobRecord {
    const row = this.database.prepare("SELECT * FROM background_jobs WHERE id = ?").get(id);
    if (!row) throw new Error(`job not found: ${id}`);
    return backgroundJobRecordSchema.parse(rowToJob(row));
  }

  list(): BackgroundJobRecord[] {
    return this.database
      .prepare("SELECT * FROM background_jobs ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => backgroundJobRecordSchema.parse(rowToJob(row)));
  }
}

function rowToJob(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    runId: readOptionalText(row, "run_id"),
    action: readText(row, "action"),
    status: readText(row, "status"),
    progress: readInteger(row, "progress"),
    stage: readText(row, "stage"),
    logs: readStringArray(row, "logs"),
    stopRequested: readInteger(row, "stop_requested") === 1,
    createdAt: readText(row, "created_at"),
    updatedAt: readText(row, "updated_at")
  };
}
