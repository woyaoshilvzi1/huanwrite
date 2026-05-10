import {
  manuscriptStatuses,
  manuscriptWorkbenchMetaSchema,
  type Manuscript,
  type ManuscriptWorkbenchMeta,
  type QualityGate
} from "@huanwrite/shared";
import { nowIso } from "../ids.js";
import { type SqliteConnection } from "../storage/sqliteConnection.js";
import { readText } from "../storage/sqliteRows.js";

const defaultQualityGates: QualityGate[] = [
  { id: "planning-confirmed", label: "规划已确认", passed: false, owner: "", note: "" },
  { id: "draft-not-empty", label: "正文不为空", passed: false, owner: "", note: "" },
  { id: "candidate-reviewed", label: "候选已审稿", passed: false, owner: "", note: "" },
  { id: "submission-ready", label: "投稿材料齐全", passed: false, owner: "", note: "" }
];

export class ManuscriptWorkbenchMetaRepository {
  constructor(private readonly database: SqliteConnection) {}

  getOrCreate(manuscript: Manuscript): ManuscriptWorkbenchMeta {
    const existing = this.get(manuscript.id);
    if (existing) return existing;
    return this.save({
      manuscriptId: manuscript.id,
      laneStatus: manuscript.status,
      laneProfile: undefined,
      owner: "",
      notes: "",
      qualityGates: defaultQualityGates.map((gate) => ({ ...gate })),
      updatedAt: nowIso()
    });
  }

  get(manuscriptId: string): ManuscriptWorkbenchMeta | undefined {
    const row = this.database.prepare("SELECT * FROM manuscript_workbench_meta WHERE manuscript_id = ?").get(manuscriptId);
    if (!row) return undefined;
    return manuscriptWorkbenchMetaSchema.parse(rowToMeta(row));
  }

  save(meta: ManuscriptWorkbenchMeta): ManuscriptWorkbenchMeta {
    this.database
      .prepare(
        `
        INSERT INTO manuscript_workbench_meta (
          manuscript_id, lane_status, lane_profile, owner, notes, quality_gates, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(manuscript_id) DO UPDATE SET
          lane_status = excluded.lane_status,
          lane_profile = excluded.lane_profile,
          owner = excluded.owner,
          notes = excluded.notes,
          quality_gates = excluded.quality_gates,
          updated_at = excluded.updated_at
        `
      )
      .run(
        meta.manuscriptId,
        meta.laneStatus,
        JSON.stringify(meta.laneProfile ?? {}),
        meta.owner,
        meta.notes,
        JSON.stringify(meta.qualityGates),
        meta.updatedAt
      );
    return meta;
  }
}

function rowToMeta(row: Record<string, unknown>): unknown {
  return {
    manuscriptId: readText(row, "manuscript_id"),
    laneStatus: readManuscriptStatus(row),
    laneProfile: readLaneProfile(row),
    owner: readText(row, "owner"),
    notes: readText(row, "notes"),
    qualityGates: JSON.parse(readText(row, "quality_gates")),
    updatedAt: readText(row, "updated_at")
  };
}

function readLaneProfile(row: Record<string, unknown>): unknown {
  const raw = readText(row, "lane_profile");
  if (!raw || raw === "{}") return undefined;
  return JSON.parse(raw);
}

function readManuscriptStatus(row: Record<string, unknown>): string {
  const value = readText(row, "lane_status");
  if (!manuscriptStatuses.includes(value as (typeof manuscriptStatuses)[number])) {
    throw new Error(`unknown manuscript lane status: ${value}`);
  }
  return value;
}
