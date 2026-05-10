import { type Manuscript } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";

export class ManuscriptService {
  constructor(private readonly store: FileProjectStore) {}

  create(topicId: string, planId: string, title: string): Manuscript {
    const timestamp = nowIso();
    const id = newId("manuscript");
    const manuscript: Manuscript = {
      id,
      title,
      topicId,
      currentPlanId: planId,
      bodyPath: this.store.paths.fromRoot(this.store.manuscripts.bodyPath(id)),
      charCount: 0,
      status: "empty",
      latestChangeSource: "created",
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.store.manuscripts.writeText(manuscript, "");
    const saved = this.store.manuscripts.save(manuscript);
    this.store.manuscriptMeta.getOrCreate(saved);
    return saved;
  }

  readText(manuscriptId: string): string {
    return this.store.manuscripts.readText(this.store.manuscripts.get(manuscriptId));
  }

  saveText(manuscriptId: string, text: string): Manuscript {
    const manuscript = this.store.manuscripts.get(manuscriptId);
    const currentText = this.store.manuscripts.readText(manuscript);
    if (currentText.trim() && !text.trim()) throw new Error("empty content cannot overwrite existing manuscript");
    this.store.manuscripts.writeText(manuscript, text);
    return this.store.manuscripts.save({
      ...manuscript,
      charCount: text.length,
      status: text.trim() ? "drafting" : manuscript.status,
      latestChangeSource: "manual-edit",
      updatedAt: nowIso()
    });
  }

  mergeCandidate(candidateId: string): Manuscript {
    const candidate = this.store.candidates.get(candidateId);
    if (candidate.status !== "approved") throw new Error("approved candidate is required before merge");
    const plan = this.store.plans.get(candidate.planId);
    if (plan.status !== "confirmed") throw new Error("confirmed current plan is required before merge");
    const manuscript = this.store.manuscripts.get(candidate.manuscriptId);
    if (manuscript.currentPlanId !== plan.id) throw new Error("candidate plan must match current manuscript plan");
    const currentText = this.store.manuscripts.readText(manuscript).trim();
    const candidateText = this.store.candidates.readText(candidate).trim();
    const merged = [currentText, candidateText].filter((part) => part.length > 0).join("\n\n");
    this.store.manuscripts.writeText(manuscript, merged);
    this.store.candidates.save({ ...candidate, status: "merged" });
    return this.store.manuscripts.save({
      ...manuscript,
      charCount: merged.length,
      status: "drafting",
      latestChangeSource: candidate.id,
      updatedAt: nowIso()
    });
  }
}
