import { type Review, reviewSchema } from "@huanwrite/shared";
import { readStringArray, readText } from "../storage/sqliteRows.js";
import { type SqliteConnection } from "../storage/sqliteConnection.js";

export class ReviewRepository {
  constructor(private readonly database: SqliteConnection) {}

  save(review: Review): Review {
    this.database
      .prepare(
        `
        INSERT INTO reviews (
          id, candidate_id, basis, conclusion, issues, suggestions,
          risk_level, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          basis = excluded.basis,
          conclusion = excluded.conclusion,
          issues = excluded.issues,
          suggestions = excluded.suggestions,
          risk_level = excluded.risk_level,
          status = excluded.status
        `
      )
      .run(
        review.id,
        review.candidateId,
        JSON.stringify(review.basis),
        review.conclusion,
        JSON.stringify(review.issues),
        JSON.stringify(review.suggestions),
        review.riskLevel,
        review.status,
        review.createdAt
      );
    return review;
  }

  list(): Review[] {
    return this.database
      .prepare("SELECT * FROM reviews ORDER BY created_at ASC, id ASC")
      .all()
      .map((row) => reviewSchema.parse(rowToReview(row)));
  }
}

function rowToReview(row: Record<string, unknown>): unknown {
  return {
    id: readText(row, "id"),
    candidateId: readText(row, "candidate_id"),
    basis: readStringArray(row, "basis"),
    conclusion: readText(row, "conclusion"),
    issues: readStringArray(row, "issues"),
    suggestions: readStringArray(row, "suggestions"),
    riskLevel: readText(row, "risk_level"),
    status: readText(row, "status"),
    createdAt: readText(row, "created_at")
  };
}
