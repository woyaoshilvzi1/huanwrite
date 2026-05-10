import { type WorkbenchActionId, workbenchActionIdSchema } from "@huanwrite/shared";
import { z } from "zod";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readOptionalText, readText } from "../storage/sqliteRows.js";

export interface UiEventRecord {
  id: string;
  type: string;
  traceId?: string;
  action?: WorkbenchActionId;
  message?: string;
  createdAt: string;
}

export const uiEventRecordSchema = z.object({
  id: z.string(),
  type: z.string(),
  traceId: z.string().optional(),
  action: workbenchActionIdSchema.optional(),
  message: z.string().optional(),
  createdAt: z.string()
});

export class UiEventRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(event: UiEventRecord): UiEventRecord {
    this.database
      .prepare(
        `
        INSERT INTO ui_events (id, type, trace_id, action, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          type = excluded.type,
          trace_id = excluded.trace_id,
          action = excluded.action,
          message = excluded.message
        `
      )
      .run(event.id, event.type, event.traceId ?? null, event.action ?? null, event.message ?? null, event.createdAt);
    return event;
  }

  list(traceId?: string): UiEventRecord[] {
    const rows = traceId
      ? this.database.prepare("SELECT * FROM ui_events WHERE trace_id = ? ORDER BY created_at ASC, id ASC").all(traceId)
      : this.database.prepare("SELECT * FROM ui_events ORDER BY created_at ASC, id ASC").all();
    return rows.map((row) => uiEventRecordSchema.parse(rowToUiEvent(row)));
  }
}

function rowToUiEvent(row: Record<string, unknown>): UiEventRecord {
  const action = readOptionalText(row, "action");
  return {
    id: readText(row, "id"),
    type: readText(row, "type"),
    traceId: readOptionalText(row, "trace_id"),
    action: action ? workbenchActionIdSchema.parse(action) : undefined,
    message: readOptionalText(row, "message"),
    createdAt: readText(row, "created_at")
  };
}
