import { structureCardSchema, type StructureCard } from "@huanwrite/shared";

export function encodeStructureCards(cards: StructureCard[]): string {
  return JSON.stringify(cards);
}

export function decodeStructureCards(text: string): StructureCard[] {
  const value = JSON.parse(text);
  return structureCardSchema.array().parse(value).map((card) => ({
    ...card,
    protagonistGoal: card.protagonistGoal || card.goal,
    turningPoint: card.turningPoint || card.change,
    payoffHook: card.payoffHook || card.hook
  }));
}
