import { manuscriptWorkbenchMetaSchema, type ManuscriptStatus, type ManuscriptWorkbenchMeta, type QualityGate } from "@huanwrite/shared";
import { nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";

export interface WorkbenchMetaUpdate {
  laneStatus: ManuscriptStatus;
  owner: string;
  notes: string;
  qualityGates: QualityGate[];
}

export class WorkbenchMetaService {
  constructor(private readonly store: FileProjectStore) {}

  update(manuscriptId: string, input: WorkbenchMetaUpdate): ManuscriptWorkbenchMeta {
    const manuscript = this.store.manuscripts.get(manuscriptId);
    const meta = manuscriptWorkbenchMetaSchema.parse({
      manuscriptId,
      laneStatus: input.laneStatus,
      owner: input.owner,
      notes: input.notes,
      qualityGates: input.qualityGates,
      updatedAt: nowIso()
    });
    this.store.manuscripts.save({
      ...manuscript,
      status: input.laneStatus,
      updatedAt: meta.updatedAt
    });
    return this.store.manuscriptMeta.save(meta);
  }
}
