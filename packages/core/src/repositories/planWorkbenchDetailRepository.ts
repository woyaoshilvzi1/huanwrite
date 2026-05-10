import { planWorkbenchDetailSchema, type Plan, type PlanWorkbenchDetail } from "@huanwrite/shared";
import { nowIso } from "../ids.js";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readStringArray, readText } from "../storage/sqliteRows.js";

export class PlanWorkbenchDetailRepository {
  constructor(private readonly database: SqliteConnection) {}

  getOrCreate(plan: Plan): PlanWorkbenchDetail {
    const existing = this.get(plan.id);
    if (existing) return existing;
    return this.save({
      planId: plan.id,
      voiceFingerprints: [],
      styleFingerprints: [],
      craftCards: [],
      updatedAt: nowIso()
    });
  }

  get(planId: string): PlanWorkbenchDetail | undefined {
    const row = this.database.prepare("SELECT * FROM plan_workbench_details WHERE plan_id = ?").get(planId);
    if (!row) return undefined;
    return planWorkbenchDetailSchema.parse(rowToDetail(row));
  }

  save(detail: PlanWorkbenchDetail): PlanWorkbenchDetail {
    this.database
      .prepare(
        `
        INSERT INTO plan_workbench_details (
          plan_id, voice_fingerprints, style_fingerprints, craft_cards, updated_at
        )
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(plan_id) DO UPDATE SET
          voice_fingerprints = excluded.voice_fingerprints,
          style_fingerprints = excluded.style_fingerprints,
          craft_cards = excluded.craft_cards,
          updated_at = excluded.updated_at
        `
      )
      .run(
        detail.planId,
        JSON.stringify(detail.voiceFingerprints),
        JSON.stringify(detail.styleFingerprints),
        JSON.stringify(detail.craftCards),
        detail.updatedAt
      );
    return detail;
  }
}

function rowToDetail(row: Record<string, unknown>): unknown {
  return {
    planId: readText(row, "plan_id"),
    voiceFingerprints: readStringArray(row, "voice_fingerprints"),
    styleFingerprints: readStringArray(row, "style_fingerprints"),
    craftCards: readStringArray(row, "craft_cards"),
    updatedAt: readText(row, "updated_at")
  };
}
