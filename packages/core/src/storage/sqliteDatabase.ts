import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { type SqliteConnection } from "./sqliteConnection.js";

interface SqliteModule {
  DatabaseSync: new (path: string) => SqliteConnection;
}

const nodeRequire = createRequire(import.meta.url);

export class HuanwriteDatabase {
  readonly connection: SqliteConnection;

  constructor(databasePath: string) {
    mkdirSync(dirname(databasePath), { recursive: true });
    const sqlite = nodeRequire("node:sqlite") as SqliteModule;
    this.connection = new sqlite.DatabaseSync(databasePath);
    this.connection.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        idea TEXT NOT NULL,
        selling_point TEXT NOT NULL,
        protagonist_pressure TEXT NOT NULL,
        main_conflict TEXT NOT NULL,
        reader_payoff TEXT NOT NULL,
        target_platform TEXT NOT NULL,
        target_length TEXT NOT NULL,
        risk_note TEXT NOT NULL,
        lane_profile TEXT NOT NULL DEFAULT '{}',
        status TEXT NOT NULL,
        selection_reason TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        topic_id TEXT NOT NULL REFERENCES topics(id),
        manuscript_id TEXT,
        story_promise TEXT NOT NULL,
        protagonist_goal TEXT NOT NULL,
        main_conflict TEXT NOT NULL,
        stakes_chain TEXT NOT NULL,
        relationships TEXT NOT NULL,
        structure_cards TEXT NOT NULL,
        style_rules TEXT NOT NULL,
        banned_phrases TEXT NOT NULL,
        fatigue_words TEXT NOT NULL,
        target_platform TEXT NOT NULL,
        manuscript_shape TEXT NOT NULL,
        status TEXT NOT NULL,
        confirmed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS manuscripts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        topic_id TEXT NOT NULL REFERENCES topics(id),
        current_plan_id TEXT NOT NULL REFERENCES plans(id),
        body_path TEXT NOT NULL,
        char_count INTEGER NOT NULL,
        status TEXT NOT NULL,
        latest_change_source TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS manuscript_workbench_meta (
        manuscript_id TEXT PRIMARY KEY REFERENCES manuscripts(id),
        lane_status TEXT NOT NULL,
        lane_profile TEXT NOT NULL DEFAULT '{}',
        owner TEXT NOT NULL,
        notes TEXT NOT NULL,
        quality_gates TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plan_workbench_details (
        plan_id TEXT PRIMARY KEY REFERENCES plans(id),
        voice_fingerprints TEXT NOT NULL,
        style_fingerprints TEXT NOT NULL,
        craft_cards TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        manuscript_id TEXT NOT NULL REFERENCES manuscripts(id),
        plan_id TEXT NOT NULL REFERENCES plans(id),
        action_type TEXT NOT NULL,
        input_summary TEXT NOT NULL,
        output_path TEXT NOT NULL,
        status TEXT NOT NULL,
        review_id TEXT,
        generated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        candidate_id TEXT NOT NULL REFERENCES candidates(id),
        basis TEXT NOT NULL,
        conclusion TEXT NOT NULL,
        issues TEXT NOT NULL,
        suggestions TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS submission_packages (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        source_type TEXT NOT NULL,
        target_platform TEXT NOT NULL,
        title_options TEXT NOT NULL,
        short_intro TEXT NOT NULL,
        long_intro TEXT NOT NULL,
        tags TEXT NOT NULL,
        platform_note TEXT NOT NULL,
        checklist TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS action_runs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        output_path TEXT NOT NULL,
        manuscript_id TEXT,
        plan_id TEXT,
        candidate_id TEXT,
        review_id TEXT,
        submission_id TEXT,
        client_trace_id TEXT,
        prompt_hash TEXT NOT NULL DEFAULT '',
        prompt_registry_key TEXT NOT NULL DEFAULT '',
        model TEXT NOT NULL DEFAULT '',
        usage_json TEXT NOT NULL DEFAULT '{}',
        harness_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS background_jobs (
        id TEXT PRIMARY KEY,
        run_id TEXT,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL,
        stage TEXT NOT NULL,
        logs TEXT NOT NULL,
        stop_requested INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ui_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        trace_id TEXT,
        action TEXT,
        message TEXT,
        created_at TEXT NOT NULL
      );
    `);
    addColumnIfMissing(this.connection, "ALTER TABLE action_runs ADD COLUMN prompt_hash TEXT NOT NULL DEFAULT ''");
    addColumnIfMissing(this.connection, "ALTER TABLE action_runs ADD COLUMN prompt_registry_key TEXT NOT NULL DEFAULT ''");
    addColumnIfMissing(this.connection, "ALTER TABLE action_runs ADD COLUMN model TEXT NOT NULL DEFAULT ''");
    addColumnIfMissing(this.connection, "ALTER TABLE action_runs ADD COLUMN usage_json TEXT NOT NULL DEFAULT '{}'");
    addColumnIfMissing(this.connection, "ALTER TABLE action_runs ADD COLUMN harness_json TEXT NOT NULL DEFAULT '{}'");
    addColumnIfMissing(this.connection, "ALTER TABLE topics ADD COLUMN lane_profile TEXT NOT NULL DEFAULT '{}'");
    addColumnIfMissing(this.connection, "ALTER TABLE manuscript_workbench_meta ADD COLUMN lane_profile TEXT NOT NULL DEFAULT '{}'");
    this.connection.exec(`
      UPDATE action_runs
      SET prompt_registry_key = CASE action
        WHEN 'plan_story' THEN 'planning.story-state-complete'
        WHEN 'replan_story' THEN 'planning.story-state-regeneration'
        WHEN 'polish_plan' THEN 'planning.structure-polish'
        WHEN 'brainstorm_plan' THEN 'planning.idea-expansion'
        WHEN 'audit_story_state' THEN 'audit.story-state-integrity'
        WHEN 'continue' THEN 'draft.continuation-candidate'
        WHEN 'revise_ai' THEN 'draft.ai-flavor-revision'
        WHEN 'repair_candidate' THEN 'draft.review-guided-repair'
        WHEN 'review_candidate' THEN 'review.candidate-quality-gate'
        WHEN 'merge_brief' THEN 'merge.manual-seam-brief'
        WHEN 'submission_package' THEN 'submission.platform-package'
        WHEN 'drama_adapt' THEN 'adaptation.short-drama-package'
        WHEN 'platform_radar' THEN 'platform.manuscript-fit-brief'
        WHEN 'daily_platform_radar' THEN 'platform.public-radar-snapshot'
        ELSE action
      END
      WHERE prompt_registry_key = ''
    `);
  }
}

function addColumnIfMissing(connection: SqliteConnection, sql: string): void {
  try {
    connection.exec(sql);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("duplicate column")) throw error;
  }
}
