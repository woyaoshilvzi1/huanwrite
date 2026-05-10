import { z } from "zod";
import {
  candidateStatuses,
  manuscriptStatuses,
  planStatuses,
  reviewStatuses,
  submissionStatuses,
  topicStatuses
} from "./status.js";

export const topicSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  idea: z.string().min(1),
  sellingPoint: z.string().min(1),
  protagonistPressure: z.string().min(1),
  mainConflict: z.string().min(1),
  readerPayoff: z.string().min(1),
  targetPlatform: z.string().min(1),
  targetLength: z.string().min(1),
  riskNote: z.string().default(""),
  status: z.enum(topicStatuses),
  selectionReason: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const structureCardSchema = z.object({
  title: z.string().min(1),
  summary: z.string().default(""),
  targetWords: z.string().default(""),
  sceneCount: z.string().default(""),
  characters: z.string().default(""),
  goal: z.string().min(1),
  protagonistGoal: z.string().default(""),
  conflict: z.string().min(1),
  change: z.string().min(1),
  turningPoint: z.string().default(""),
  hook: z.string().min(1),
  payoffHook: z.string().default(""),
  oocRisk: z.string().default(""),
  humanNote: z.string().default("")
});

export const planSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  manuscriptId: z.string().optional(),
  storyPromise: z.string(),
  protagonistGoal: z.string(),
  mainConflict: z.string(),
  stakesChain: z.string(),
  relationships: z.array(z.string()),
  structureCards: z.array(structureCardSchema),
  styleRules: z.array(z.string()),
  bannedPhrases: z.array(z.string()),
  fatigueWords: z.array(z.string()),
  targetPlatform: z.string(),
  manuscriptShape: z.string(),
  status: z.enum(planStatuses),
  confirmedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const manuscriptSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  topicId: z.string(),
  currentPlanId: z.string(),
  bodyPath: z.string(),
  charCount: z.number().int().nonnegative(),
  status: z.enum(manuscriptStatuses),
  latestChangeSource: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const qualityGateSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  passed: z.boolean(),
  owner: z.string().default(""),
  note: z.string().default("")
});

export const manuscriptWorkbenchMetaSchema = z.object({
  manuscriptId: z.string(),
  laneStatus: z.enum(manuscriptStatuses),
  owner: z.string(),
  notes: z.string(),
  qualityGates: z.array(qualityGateSchema),
  updatedAt: z.string()
});

export const planWorkbenchDetailSchema = z.object({
  planId: z.string(),
  voiceFingerprints: z.array(z.string()),
  styleFingerprints: z.array(z.string()),
  craftCards: z.array(z.string()),
  updatedAt: z.string()
});

export const actionAvailabilitySchema = z.object({
  action: z.string(),
  enabled: z.boolean(),
  reason: z.string()
});

export const candidateSchema = z.object({
  id: z.string(),
  manuscriptId: z.string(),
  planId: z.string(),
  actionType: z.string().min(1),
  inputSummary: z.string().min(1),
  outputPath: z.string(),
  status: z.enum(candidateStatuses),
  reviewId: z.string().optional(),
  generatedAt: z.string()
});

export const reviewSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  basis: z.array(z.string()),
  conclusion: z.enum(["passed", "failed", "requires-human"]),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  riskLevel: z.enum(["low", "medium", "high"]),
  status: z.enum(reviewStatuses),
  createdAt: z.string()
});

export const submissionPackageSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  sourceType: z.enum(["manuscript", "adaptation"]),
  targetPlatform: z.string(),
  titleOptions: z.array(z.string()),
  shortIntro: z.string(),
  longIntro: z.string(),
  tags: z.array(z.string()),
  platformNote: z.string(),
  checklist: z.array(z.string()),
  status: z.enum(submissionStatuses),
  createdAt: z.string()
});

export type Topic = z.infer<typeof topicSchema>;
export type Plan = z.infer<typeof planSchema>;
export type StructureCard = z.infer<typeof structureCardSchema>;
export type Manuscript = z.infer<typeof manuscriptSchema>;
export type QualityGate = z.infer<typeof qualityGateSchema>;
export type ManuscriptWorkbenchMeta = z.infer<typeof manuscriptWorkbenchMetaSchema>;
export type PlanWorkbenchDetail = z.infer<typeof planWorkbenchDetailSchema>;
export type ActionAvailability = z.infer<typeof actionAvailabilitySchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type SubmissionPackage = z.infer<typeof submissionPackageSchema>;
