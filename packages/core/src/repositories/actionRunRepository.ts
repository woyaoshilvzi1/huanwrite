import { type WorkbenchActionId, workbenchActionIdSchema } from "@huanwrite/shared";
import { z } from "zod";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readOptionalText, readText } from "../storage/sqliteRows.js";

export interface ActionRunRecord {
  id: string;
  action: WorkbenchActionId;
  status: "done";
  outputPath: string;
  manuscriptId?: string;
  planId?: string;
  candidateId?: string;
  reviewId?: string;
  submissionId?: string;
  clientTraceId?: string;
  promptHash: string;
  promptRegistryKey: string;
  model: string;
  usage: {
    inputChars: number;
    outputChars: number;
  };
  harness: {
    grade: "PASS" | "BLOCK" | "WARN";
    checks: string[];
  };
  createdAt: string;
}

export const actionRunRecordSchema = z.object({
  id: z.string(),
  action: workbenchActionIdSchema,
  status: z.literal("done"),
  outputPath: z.string(),
  manuscriptId: z.string().optional(),
  planId: z.string().optional(),
  candidateId: z.string().optional(),
  reviewId: z.string().optional(),
  submissionId: z.string().optional(),
  clientTraceId: z.string().optional(),
  promptHash: z.string(),
  promptRegistryKey: z.string(),
  model: z.string(),
  usage: z.object({
    inputChars: z.number().int().nonnegative(),
    outputChars: z.number().int().nonnegative()
  }),
  harness: z.object({
    grade: z.enum(["PASS", "BLOCK", "WARN"]),
    checks: z.array(z.string())
  }),
  createdAt: z.string()
});

export class ActionRunRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(run: ActionRunRecord): ActionRunRecord {
    this.database
      .prepare(
        `
        INSERT INTO action_runs (
          id, action, status, output_path, manuscript_id, plan_id, candidate_id,
          review_id, submission_id, client_trace_id, prompt_hash, prompt_registry_key,
          model, usage_json, harness_json, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status,
          output_path = excluded.output_path,
          manuscript_id = excluded.manuscript_id,
          plan_id = excluded.plan_id,
          candidate_id = excluded.candidate_id,
          review_id = excluded.review_id,
          submission_id = excluded.submission_id,
          client_trace_id = excluded.client_trace_id,
          prompt_hash = excluded.prompt_hash,
          prompt_registry_key = excluded.prompt_registry_key,
          model = excluded.model,
          usage_json = excluded.usage_json,
          harness_json = excluded.harness_json
        `
      )
      .run(
        run.id,
        run.action,
        run.status,
        run.outputPath,
        run.manuscriptId ?? null,
        run.planId ?? null,
        run.candidateId ?? null,
        run.reviewId ?? null,
        run.submissionId ?? null,
        run.clientTraceId ?? null,
        run.promptHash,
        run.promptRegistryKey,
        run.model,
        JSON.stringify(run.usage),
        JSON.stringify(run.harness),
        run.createdAt
      );
    return run;
  }

  list(): ActionRunRecord[] {
    return this.database
      .prepare("SELECT * FROM action_runs ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => actionRunRecordSchema.parse(rowToActionRun(row)));
  }
}

function rowToActionRun(row: Record<string, unknown>): ActionRunRecord {
  return {
    id: readText(row, "id"),
    action: workbenchActionIdSchema.parse(readText(row, "action")),
    status: "done",
    outputPath: readText(row, "output_path"),
    manuscriptId: readOptionalText(row, "manuscript_id"),
    planId: readOptionalText(row, "plan_id"),
    candidateId: readOptionalText(row, "candidate_id"),
    reviewId: readOptionalText(row, "review_id"),
    submissionId: readOptionalText(row, "submission_id"),
    clientTraceId: readOptionalText(row, "client_trace_id"),
    promptHash: readText(row, "prompt_hash"),
    promptRegistryKey: readText(row, "prompt_registry_key"),
    model: readText(row, "model"),
    usage: usageSchema.parse(JSON.parse(readText(row, "usage_json"))),
    harness: harnessSchema.parse(JSON.parse(readText(row, "harness_json"))),
    createdAt: readText(row, "created_at")
  };
}

const usageSchema = z.object({
  inputChars: z.number().int().nonnegative(),
  outputChars: z.number().int().nonnegative()
});

const harnessSchema = z.object({
  grade: z.enum(["PASS", "BLOCK", "WARN"]),
  checks: z.array(z.string())
});
