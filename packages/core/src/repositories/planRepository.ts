import { type Plan, planSchema } from "@huanwrite/shared";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { decodeStructureCards, encodeStructureCards } from "../storage/structureCardsCodec.js";
import { readOptionalText, readStringArray, readText } from "../storage/sqliteRows.js";

export class PlanRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(plan: Plan): Plan {
    this.database
      .prepare(
        `
        INSERT INTO plans (
          id, topic_id, manuscript_id, story_promise, protagonist_goal, main_conflict,
          stakes_chain, relationships, structure_cards, style_rules, banned_phrases,
          fatigue_words, target_platform, manuscript_shape, status, confirmed_at,
          created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          manuscript_id = excluded.manuscript_id,
          story_promise = excluded.story_promise,
          protagonist_goal = excluded.protagonist_goal,
          main_conflict = excluded.main_conflict,
          stakes_chain = excluded.stakes_chain,
          relationships = excluded.relationships,
          structure_cards = excluded.structure_cards,
          style_rules = excluded.style_rules,
          banned_phrases = excluded.banned_phrases,
          fatigue_words = excluded.fatigue_words,
          target_platform = excluded.target_platform,
          manuscript_shape = excluded.manuscript_shape,
          status = excluded.status,
          confirmed_at = excluded.confirmed_at,
          updated_at = excluded.updated_at
        `
      )
      .run(
        plan.id,
        plan.topicId,
        plan.manuscriptId ?? null,
        plan.storyPromise,
        plan.protagonistGoal,
        plan.mainConflict,
        plan.stakesChain,
        JSON.stringify(plan.relationships),
        encodeStructureCards(plan.structureCards),
        JSON.stringify(plan.styleRules),
        JSON.stringify(plan.bannedPhrases),
        JSON.stringify(plan.fatigueWords),
        plan.targetPlatform,
        plan.manuscriptShape,
        plan.status,
        plan.confirmedAt ?? null,
        plan.createdAt,
        plan.updatedAt
      );
    return plan;
  }

  get(id: string): Plan {
    const row = this.database.prepare("SELECT * FROM plans WHERE id = ?").get(id);
    if (!row) throw new Error(`plan not found: ${id}`);
    return planSchema.parse(rowToPlan(row));
  }

  list(): Plan[] {
    return this.database
      .prepare("SELECT * FROM plans ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => planSchema.parse(rowToPlan(row)));
  }
}

function rowToPlan(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    topicId: readText(row, "topic_id"),
    manuscriptId: readOptionalText(row, "manuscript_id"),
    storyPromise: readText(row, "story_promise"),
    protagonistGoal: readText(row, "protagonist_goal"),
    mainConflict: readText(row, "main_conflict"),
    stakesChain: readText(row, "stakes_chain"),
    relationships: readStringArray(row, "relationships"),
    structureCards: decodeStructureCards(readText(row, "structure_cards")),
    styleRules: readStringArray(row, "style_rules"),
    bannedPhrases: readStringArray(row, "banned_phrases"),
    fatigueWords: readStringArray(row, "fatigue_words"),
    targetPlatform: readText(row, "target_platform"),
    manuscriptShape: readText(row, "manuscript_shape"),
    status: readText(row, "status"),
    confirmedAt: readOptionalText(row, "confirmed_at"),
    createdAt: readText(row, "created_at"),
    updatedAt: readText(row, "updated_at")
  };
}
