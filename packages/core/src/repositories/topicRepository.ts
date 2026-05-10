import { type Topic, topicSchema } from "@huanwrite/shared";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readText } from "../storage/sqliteRows.js";

export class TopicRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(topic: Topic): Topic {
    this.database
      .prepare(
        `
        INSERT INTO topics (
          id, title, idea, selling_point, protagonist_pressure, main_conflict, reader_payoff,
          target_platform, target_length, risk_note, lane_profile, status, selection_reason, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          idea = excluded.idea,
          selling_point = excluded.selling_point,
          protagonist_pressure = excluded.protagonist_pressure,
          main_conflict = excluded.main_conflict,
          reader_payoff = excluded.reader_payoff,
          target_platform = excluded.target_platform,
          target_length = excluded.target_length,
          risk_note = excluded.risk_note,
          lane_profile = excluded.lane_profile,
          status = excluded.status,
          selection_reason = excluded.selection_reason,
          updated_at = excluded.updated_at
        `
      )
      .run(
        topic.id,
        topic.title,
        topic.idea,
        topic.sellingPoint,
        topic.protagonistPressure,
        topic.mainConflict,
        topic.readerPayoff,
        topic.targetPlatform,
        topic.targetLength,
        topic.riskNote,
        JSON.stringify(topic.laneProfile ?? {}),
        topic.status,
        topic.selectionReason,
        topic.createdAt,
        topic.updatedAt
      );
    return topic;
  }

  get(id: string): Topic {
    const row = this.database.prepare("SELECT * FROM topics WHERE id = ?").get(id);
    if (!row) throw new Error(`topic not found: ${id}`);
    return topicSchema.parse(rowToTopic(row));
  }

  list(): Topic[] {
    return this.database
      .prepare("SELECT * FROM topics ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => topicSchema.parse(rowToTopic(row)));
  }
}

function rowToTopic(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    title: readText(row, "title"),
    idea: readText(row, "idea"),
    sellingPoint: readText(row, "selling_point"),
    protagonistPressure: readText(row, "protagonist_pressure"),
    mainConflict: readText(row, "main_conflict"),
    readerPayoff: readText(row, "reader_payoff"),
    targetPlatform: readText(row, "target_platform"),
    targetLength: readText(row, "target_length"),
    riskNote: readText(row, "risk_note"),
    laneProfile: readLaneProfile(row),
    status: readText(row, "status"),
    selectionReason: readText(row, "selection_reason"),
    createdAt: readText(row, "created_at"),
    updatedAt: readText(row, "updated_at")
  };
}

function readLaneProfile(row: Record<string, unknown>): unknown {
  const raw = readText(row, "lane_profile");
  if (!raw || raw === "{}") return undefined;
  return JSON.parse(raw);
}
