import { type Plan, type PlanWorkbenchDetail, type StructureCard } from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { isCompletePlan } from "./planCompleteness.js";

export class PlanService {
  constructor(
    private readonly store: FileProjectStore,
    private readonly assets: AssetCatalog
  ) {}

  create(topicId: string): Plan {
    const topic = this.store.topics.get(topicId);
    if (topic.status !== "selected") throw new Error("topic must be selected before planning");
    const timestamp = nowIso();
    return this.store.plans.save({
      id: newId("plan"),
      topicId: topic.id,
      storyPromise: `${topic.sellingPoint}：${topic.idea}`,
      protagonistGoal: topic.readerPayoff,
      mainConflict: topic.mainConflict,
      stakesChain: topic.protagonistPressure,
      relationships: [],
      structureCards: [],
      styleRules: [],
      bannedPhrases: [],
      fatigueWords: [],
      targetPlatform: topic.targetPlatform,
      manuscriptShape: topic.targetLength,
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  complete(planId: string): Plan {
    const plan = this.store.plans.get(planId);
    const defaults = this.assets.defaultPlan.read();
    const timestamp = nowIso();
    this.store.planDetails.save({
      planId: plan.id,
      voiceFingerprints: defaults.voiceFingerprints,
      styleFingerprints: defaults.styleFingerprints,
      craftCards: defaults.craftCards,
      updatedAt: timestamp
    });
    return this.store.plans.save({
      ...plan,
      relationships: plan.relationships.length ? plan.relationships : defaults.relationships,
      structureCards: plan.structureCards.length ? plan.structureCards : defaults.structureCards,
      styleRules: plan.styleRules.length ? plan.styleRules : defaults.styleRules,
      bannedPhrases: plan.bannedPhrases.length ? plan.bannedPhrases : defaults.bannedPhrases,
      fatigueWords: plan.fatigueWords.length ? plan.fatigueWords : defaults.fatigueWords,
      status: "ready-for-review",
      updatedAt: timestamp
    });
  }

  confirm(planId: string): Plan {
    const plan = this.store.plans.get(planId);
    const detail = this.store.planDetails.getOrCreate(plan);
    if (!isCompletePlan(plan) || !detail.voiceFingerprints.length || !detail.styleFingerprints.length || !detail.craftCards.length) {
      throw new Error("plan is not complete enough to confirm");
    }
    const timestamp = nowIso();
    return this.store.plans.save({
      ...plan,
      status: "confirmed",
      confirmedAt: timestamp,
      updatedAt: timestamp
    });
  }

  update(planId: string, input: PlanUpdateInput): Plan {
    const plan = this.store.plans.get(planId);
    const timestamp = nowIso();
    const nextPlan = this.store.plans.save({
      ...plan,
      storyPromise: input.storyPromise,
      protagonistGoal: input.protagonistGoal,
      mainConflict: input.mainConflict,
      stakesChain: input.stakesChain,
      relationships: input.relationships,
      structureCards: input.structureCards,
      styleRules: input.styleRules,
      bannedPhrases: input.bannedPhrases,
      fatigueWords: input.fatigueWords,
      targetPlatform: input.targetPlatform,
      manuscriptShape: input.manuscriptShape,
      status: "ready-for-review",
      confirmedAt: undefined,
      updatedAt: timestamp
    });
    this.store.planDetails.save({
      planId,
      voiceFingerprints: input.voiceFingerprints,
      styleFingerprints: input.styleFingerprints,
      craftCards: input.craftCards,
      updatedAt: timestamp
    });
    for (const candidate of this.store.candidates.list().filter((item) => item.planId === planId && item.status === "approved")) {
      this.store.candidates.save({ ...candidate, status: "needs-revision", reviewId: undefined });
    }
    return nextPlan;
  }
}

export interface PlanUpdateInput extends Omit<Plan, "id" | "topicId" | "manuscriptId" | "status" | "confirmedAt" | "createdAt" | "updatedAt"> {
  structureCards: StructureCard[];
  voiceFingerprints: PlanWorkbenchDetail["voiceFingerprints"];
  styleFingerprints: PlanWorkbenchDetail["styleFingerprints"];
  craftCards: PlanWorkbenchDetail["craftCards"];
}
