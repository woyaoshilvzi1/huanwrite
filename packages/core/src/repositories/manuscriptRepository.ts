import { type Manuscript, manuscriptSchema } from "@huanwrite/shared";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { ProjectPaths } from "../storage/projectPaths.js";
import { readInteger, readText } from "../storage/sqliteRows.js";
import { TextStorage } from "../storage/textStorage.js";

export class ManuscriptRepository {
  constructor(
    private readonly paths: ProjectPaths,
    private readonly database: SqliteConnection,
    private readonly texts: TextStorage
  ) {}

  bodyPath(id: string): string {
    return this.paths.manuscriptBody(id);
  }

  save(manuscript: Manuscript): Manuscript {
    this.database
      .prepare(
        `
        INSERT INTO manuscripts (
          id, title, topic_id, current_plan_id, body_path, char_count,
          status, latest_change_source, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          current_plan_id = excluded.current_plan_id,
          body_path = excluded.body_path,
          char_count = excluded.char_count,
          status = excluded.status,
          latest_change_source = excluded.latest_change_source,
          updated_at = excluded.updated_at
        `
      )
      .run(
        manuscript.id,
        manuscript.title,
        manuscript.topicId,
        manuscript.currentPlanId,
        manuscript.bodyPath,
        manuscript.charCount,
        manuscript.status,
        manuscript.latestChangeSource,
        manuscript.createdAt,
        manuscript.updatedAt
      );
    return manuscript;
  }

  get(id: string): Manuscript {
    const row = this.database.prepare("SELECT * FROM manuscripts WHERE id = ?").get(id);
    if (!row) throw new Error(`manuscript not found: ${id}`);
    return manuscriptSchema.parse(rowToManuscript(row));
  }

  list(): Manuscript[] {
    return this.database
      .prepare("SELECT * FROM manuscripts ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => manuscriptSchema.parse(rowToManuscript(row)));
  }

  readText(manuscript: Manuscript): string {
    return this.texts.read(this.paths.toRooted(manuscript.bodyPath));
  }

  writeText(manuscript: Manuscript, text: string): void {
    this.texts.writeWithoutEmptyOverwrite(this.paths.toRooted(manuscript.bodyPath), text);
  }
}

function rowToManuscript(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    title: readText(row, "title"),
    topicId: readText(row, "topic_id"),
    currentPlanId: readText(row, "current_plan_id"),
    bodyPath: readText(row, "body_path"),
    charCount: readInteger(row, "char_count"),
    status: readText(row, "status"),
    latestChangeSource: readText(row, "latest_change_source"),
    createdAt: readText(row, "created_at"),
    updatedAt: readText(row, "updated_at")
  };
}
