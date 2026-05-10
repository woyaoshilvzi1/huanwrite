import { type Plan } from "@huanwrite/shared";

export function isCompletePlan(plan: Plan): boolean {
  return Boolean(
    plan.storyPromise &&
      plan.protagonistGoal &&
      plan.mainConflict &&
      plan.stakesChain &&
      plan.relationships.length &&
      plan.structureCards.length &&
      plan.structureCards.every(
        (card) =>
          card.title &&
          card.summary &&
          card.targetWords &&
          card.sceneCount &&
          card.characters &&
          card.goal &&
          card.protagonistGoal &&
          card.conflict &&
          card.change &&
          card.turningPoint &&
          card.hook &&
          card.payoffHook &&
          card.oocRisk
      ) &&
      plan.styleRules.length &&
      plan.bannedPhrases.length &&
      plan.fatigueWords.length &&
      plan.targetPlatform &&
      plan.manuscriptShape
  );
}
