import { type Candidate } from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";

export class CandidateService {
  constructor(
    private readonly store: FileProjectStore,
    private readonly assets: AssetCatalog
  ) {}

  runAction(actionType: string, manuscriptId: string, planId: string, instructions?: string): Candidate {
    const plan = this.store.plans.get(planId);
    const manuscript = this.store.manuscripts.get(manuscriptId);
    if (plan.status !== "confirmed") throw new Error("confirmed plan is required before generating candidates");
    if (manuscript.currentPlanId !== plan.id) throw new Error("manuscript must use the supplied plan");
    const id = newId("candidate");
    const candidate: Candidate = {
      id,
      manuscriptId,
      planId,
      actionType,
      inputSummary: `${actionType}: ${manuscript.title}`,
      outputPath: this.store.paths.fromRoot(this.store.candidates.bodyPath(id)),
      status: "generated",
      generatedAt: nowIso()
    };
    const rendered = this.assets.candidateRenderer.render(this.assets.templates.candidateText(), {
      actionType,
      manuscriptTitle: manuscript.title,
      storyPromise: plan.storyPromise
    });
    const text = instructions ? [rendered.trim(), "", "## 本次指令", "", instructions].join("\n") : rendered;
    return this.store.candidates.saveWithText(candidate, text);
  }
}
