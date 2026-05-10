import { type SubmissionPackage, submissionPackageSchema } from "@huanwrite/shared";
import { readStringArray, readText } from "../storage/sqliteRows.js";
import { type SqliteConnection } from "../storage/sqliteConnection.js";

export class SubmissionRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(item: SubmissionPackage): SubmissionPackage {
    this.database
      .prepare(
        `
        INSERT INTO submission_packages (
          id, source_id, source_type, target_platform, title_options,
          short_intro, long_intro, tags, platform_note, checklist, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          target_platform = excluded.target_platform,
          title_options = excluded.title_options,
          short_intro = excluded.short_intro,
          long_intro = excluded.long_intro,
          tags = excluded.tags,
          platform_note = excluded.platform_note,
          checklist = excluded.checklist,
          status = excluded.status
        `
      )
      .run(
        item.id,
        item.sourceId,
        item.sourceType,
        item.targetPlatform,
        JSON.stringify(item.titleOptions),
        item.shortIntro,
        item.longIntro,
        JSON.stringify(item.tags),
        item.platformNote,
        JSON.stringify(item.checklist),
        item.status,
        item.createdAt
      );
    return item;
  }

  list(): SubmissionPackage[] {
    return this.database
      .prepare("SELECT * FROM submission_packages ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => submissionPackageSchema.parse(rowToSubmission(row)));
  }
}

function rowToSubmission(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    sourceId: readText(row, "source_id"),
    sourceType: readText(row, "source_type"),
    targetPlatform: readText(row, "target_platform"),
    titleOptions: readStringArray(row, "title_options"),
    shortIntro: readText(row, "short_intro"),
    longIntro: readText(row, "long_intro"),
    tags: readStringArray(row, "tags"),
    platformNote: readText(row, "platform_note"),
    checklist: readStringArray(row, "checklist"),
    status: readText(row, "status"),
    createdAt: readText(row, "created_at")
  };
}
