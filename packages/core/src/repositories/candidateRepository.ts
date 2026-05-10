import { type Candidate, candidateSchema } from "@huanwrite/shared";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { ProjectPaths } from "../storage/projectPaths.js";
import { readOptionalText, readText } from "../storage/sqliteRows.js";
import { TextStorage } from "../storage/textStorage.js";

export class CandidateRepository {
  constructor(
    private readonly paths: ProjectPaths,
    private readonly database: SqliteConnection,
    private readonly texts: TextStorage
  ) {}

  bodyPath(id: string): string {
    return this.paths.candidateBody(id);
  }

  save(candidate: Candidate): Candidate {
    this.database
      .prepare(
        `
        INSERT INTO candidates (
          id, manuscript_id, plan_id, action_type, input_summary,
          output_path, status, review_id, generated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          action_type = excluded.action_type,
          input_summary = excluded.input_summary,
          output_path = excluded.output_path,
          status = excluded.status,
          review_id = excluded.review_id,
          generated_at = excluded.generated_at
        `
      )
      .run(
        candidate.id,
        candidate.manuscriptId,
        candidate.planId,
        candidate.actionType,
        candidate.inputSummary,
        candidate.outputPath,
        candidate.status,
        candidate.reviewId ?? null,
        candidate.generatedAt
      );
    return candidate;
  }

  saveWithText(candidate: Candidate, text: string): Candidate {
    this.save(candidate);
    this.texts.write(this.paths.toRooted(candidate.outputPath), text);
    return candidate;
  }

  get(id: string): Candidate {
    const row = this.database.prepare("SELECT * FROM candidates WHERE id = ?").get(id);
    if (!row) throw new Error(`candidate not found: ${id}`);
    return candidateSchema.parse(rowToCandidate(row));
  }

  list(): Candidate[] {
    return this.database
      .prepare("SELECT * FROM candidates ORDER BY generated_at ASC, id ASC")
      .all()
      .map((row) => candidateSchema.parse(rowToCandidate(row)));
  }

  readText(candidate: Candidate): string {
    return this.texts.read(this.paths.toRooted(candidate.outputPath));
  }
}

function rowToCandidate(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    manuscriptId: readText(row, "manuscript_id"),
    planId: readText(row, "plan_id"),
    actionType: readText(row, "action_type"),
    inputSummary: readText(row, "input_summary"),
    outputPath: readText(row, "output_path"),
    status: readText(row, "status"),
    reviewId: readOptionalText(row, "review_id"),
    generatedAt: readText(row, "generated_at")
  };
}
