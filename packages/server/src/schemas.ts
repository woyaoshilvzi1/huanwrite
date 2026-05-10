import { z } from "zod";
import { manuscriptStatuses, topicLaneProfileSchema, workbenchActionIdSchema } from "@huanwrite/shared";

export const createTopicRequestSchema = z.object({
  title: z.string().min(1),
  idea: z.string().min(1),
  sellingPoint: z.string().min(1),
  protagonistPressure: z.string().min(1),
  mainConflict: z.string().min(1),
  readerPayoff: z.string().min(1),
  targetPlatform: z.string().min(1),
  targetLength: z.string().min(1),
  riskNote: z.string().default("")
});

export const createTopicFromLaneRequestSchema = createTopicRequestSchema.extend({
  laneId: z.string().min(1)
}).transform(({ laneId, ...topic }) => ({ laneId, topic }));

export const selectTopicRequestSchema = z.object({
  reason: z.string().min(1)
});

export const createManuscriptRequestSchema = z.object({
  planId: z.string().min(1),
  title: z.string().min(1)
});

export const runActionRequestSchema = z.object({
  planId: z.string().min(1),
  actionType: z.string().min(1)
});

export const saveManuscriptTextRequestSchema = z.object({
  text: z.string()
});

export const structureCardRequestSchema = z.object({
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

export const updatePlanRequestSchema = z.object({
  storyPromise: z.string().min(1),
  protagonistGoal: z.string().min(1),
  mainConflict: z.string().min(1),
  stakesChain: z.string().min(1),
  relationships: z.array(z.string().min(1)),
  structureCards: z.array(structureCardRequestSchema),
  styleRules: z.array(z.string().min(1)),
  bannedPhrases: z.array(z.string().min(1)),
  fatigueWords: z.array(z.string().min(1)),
  voiceFingerprints: z.array(z.string().min(1)),
  styleFingerprints: z.array(z.string().min(1)),
  craftCards: z.array(z.string().min(1)),
  targetPlatform: z.string().min(1),
  manuscriptShape: z.string().min(1)
});

export const qualityGateRequestSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  passed: z.boolean(),
  owner: z.string().default(""),
  note: z.string().default("")
});

export const updateManuscriptWorkbenchRequestSchema = z.object({
  laneStatus: z.enum(manuscriptStatuses),
  laneProfile: topicLaneProfileSchema.optional(),
  owner: z.string(),
  notes: z.string(),
  qualityGates: z.array(qualityGateRequestSchema)
});

export const buildSubmissionRequestSchema = z.object({
  targetPlatform: z.string().min(1)
});

export const runWorkbenchActionRequestSchema = z.object({
  action: workbenchActionIdSchema,
  manuscriptId: z.string().optional(),
  planId: z.string().optional(),
  candidateId: z.string().optional(),
  targetPlatform: z.string().optional(),
  instructions: z.string().optional(),
  clientTraceId: z.string().optional()
});

export const appendEventRequestSchema = z.object({
  type: z.string().min(1),
  traceId: z.string().optional(),
  action: workbenchActionIdSchema.optional(),
  message: z.string().optional()
});

export const stopActionRequestSchema = z.object({
  jobId: z.string().min(1)
});
