import { useEffect, useState } from "react";
import { type DashboardPlan, type DashboardPlanDetail } from "../dashboardSchema.js";
import { type PlanEditorPayload } from "./planEditorTypes.js";

type StructureCard = DashboardPlan["structureCards"][number];

export interface PlanEditorState {
  storyPromise: string;
  relationships: string;
  styleRules: string;
  bannedPhrases: string;
  fatigueWords: string;
  voiceFingerprints: string;
  styleFingerprints: string;
  craftCards: string;
  structureCards: StructureCard[];
  setStoryPromise: (value: string) => void;
  setRelationships: (value: string) => void;
  setStyleRules: (value: string) => void;
  setBannedPhrases: (value: string) => void;
  setFatigueWords: (value: string) => void;
  setVoiceFingerprints: (value: string) => void;
  setStyleFingerprints: (value: string) => void;
  setCraftCards: (value: string) => void;
  updateCard: (index: number, card: StructureCard) => void;
  addCard: () => void;
  duplicateCard: (index: number) => void;
  removeCard: (index: number) => void;
  moveCard: (index: number, direction: -1 | 1) => void;
  toPayload: () => PlanEditorPayload;
}

export function usePlanEditorState(plan: DashboardPlan, detail: DashboardPlanDetail | undefined): PlanEditorState {
  const [storyPromise, setStoryPromise] = useState(plan.storyPromise);
  const [relationships, setRelationships] = useState(plan.relationships.join("\n"));
  const [styleRules, setStyleRules] = useState(plan.styleRules.join("\n"));
  const [bannedPhrases, setBannedPhrases] = useState(plan.bannedPhrases.join("\n"));
  const [fatigueWords, setFatigueWords] = useState(plan.fatigueWords.join("\n"));
  const [voiceFingerprints, setVoiceFingerprints] = useState((detail?.voiceFingerprints ?? []).join("\n"));
  const [styleFingerprints, setStyleFingerprints] = useState((detail?.styleFingerprints ?? []).join("\n"));
  const [craftCards, setCraftCards] = useState((detail?.craftCards ?? []).join("\n"));
  const [structureCards, setStructureCards] = useState<StructureCard[]>(normalizeCards(plan));

  useEffect(() => {
    setStoryPromise(plan.storyPromise);
    setRelationships(plan.relationships.join("\n"));
    setStyleRules(plan.styleRules.join("\n"));
    setBannedPhrases(plan.bannedPhrases.join("\n"));
    setFatigueWords(plan.fatigueWords.join("\n"));
    setVoiceFingerprints((detail?.voiceFingerprints ?? []).join("\n"));
    setStyleFingerprints((detail?.styleFingerprints ?? []).join("\n"));
    setCraftCards((detail?.craftCards ?? []).join("\n"));
    setStructureCards(normalizeCards(plan));
  }, [detail, plan]);

  function updateCard(index: number, card: StructureCard) {
    setStructureCards((cards) => cards.map((item, itemIndex) => (itemIndex === index ? card : item)));
  }

  function addCard() {
    setStructureCards((cards) => [...cards, emptyCard(plan, cards.length + 1)]);
  }

  function duplicateCard(index: number) {
    setStructureCards((cards) => {
      const source = cards[index] ?? emptyCard(plan, index + 1);
      return [...cards.slice(0, index + 1), { ...source, title: `${source.title} 副本` }, ...cards.slice(index + 1)];
    });
  }

  function removeCard(index: number) {
    setStructureCards((cards) => (cards.length <= 1 ? cards : cards.filter((_, itemIndex) => itemIndex !== index)));
  }

  function moveCard(index: number, direction: -1 | 1) {
    setStructureCards((cards) => {
      const target = index + direction;
      if (target < 0 || target >= cards.length) return cards;
      const next = [...cards];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toPayload(): PlanEditorPayload {
    return {
      ...plan,
      ...detail,
      storyPromise,
      relationships: splitLines(relationships),
      styleRules: splitLines(styleRules),
      bannedPhrases: splitLines(bannedPhrases),
      fatigueWords: splitLines(fatigueWords),
      structureCards: structureCards.map(fillRequiredCardFields),
      voiceFingerprints: splitLines(voiceFingerprints),
      styleFingerprints: splitLines(styleFingerprints),
      craftCards: splitLines(craftCards),
      planId: plan.id,
      updatedAt: detail?.updatedAt ?? ""
    };
  }

  return {
    storyPromise,
    relationships,
    styleRules,
    bannedPhrases,
    fatigueWords,
    voiceFingerprints,
    styleFingerprints,
    craftCards,
    structureCards,
    setStoryPromise,
    setRelationships,
    setStyleRules,
    setBannedPhrases,
    setFatigueWords,
    setVoiceFingerprints,
    setStyleFingerprints,
    setCraftCards,
    updateCard,
    addCard,
    duplicateCard,
    removeCard,
    moveCard,
    toPayload
  };
}

function normalizeCards(plan: DashboardPlan): StructureCard[] {
  return plan.structureCards.length ? plan.structureCards : [emptyCard(plan, 1)];
}

function emptyCard(plan: DashboardPlan, ordinal: number): StructureCard {
  return {
    title: `章节卡 ${ordinal}`,
    summary: "本章必须有明确场景推进和状态变化",
    targetWords: "1800-2500",
    sceneCount: "2",
    characters: "主角、对手、关键旁观者",
    goal: plan.protagonistGoal || "推进主角目标",
    protagonistGoal: plan.protagonistGoal || "拿回主动权",
    conflict: plan.mainConflict || "制造可见冲突",
    change: plan.stakesChain || "让局面发生变化",
    turningPoint: plan.stakesChain || "公开一个新证据或新威胁",
    hook: plan.storyPromise || "留下下一章钩子",
    payoffHook: plan.storyPromise || "让下一场必须继续读",
    oocRisk: "主角行动必须由已知信息触发",
    humanNote: ""
  };
}

function fillRequiredCardFields(card: StructureCard): StructureCard {
  return {
    title: card.title.trim() || "未命名章节卡",
    summary: card.summary.trim(),
    targetWords: card.targetWords.trim(),
    sceneCount: card.sceneCount.trim(),
    characters: card.characters.trim(),
    goal: card.goal.trim() || "推进主角目标",
    protagonistGoal: card.protagonistGoal.trim() || card.goal.trim() || "推进主角目标",
    conflict: card.conflict.trim() || "制造可见冲突",
    change: card.change.trim() || "让局面发生变化",
    turningPoint: card.turningPoint.trim() || card.change.trim() || "让局面发生变化",
    hook: card.hook.trim() || "留下下一章钩子",
    payoffHook: card.payoffHook.trim() || card.hook.trim() || "留下下一章钩子",
    oocRisk: card.oocRisk.trim(),
    humanNote: card.humanNote.trim()
  };
}

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
