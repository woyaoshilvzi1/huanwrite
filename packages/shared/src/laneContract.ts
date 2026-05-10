import { z } from "zod";

export const creativeLaneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  laneType: z.string().min(1),
  track: z.string().min(1),
  targetPlatform: z.string().min(1),
  targetLength: z.string().min(1),
  audience: z.string().min(1),
  creationFocus: z.array(z.string().min(1)),
  radarSignals: z.array(z.string().min(1)),
  qualityGates: z.array(z.string().min(1)),
  defaultOwner: z.string().min(1),
  notes: z.string().min(1)
});

export const creativeLaneCatalogSchema = z.object({
  updatedAt: z.string().min(1),
  lanes: z.array(creativeLaneSchema).min(1)
});

export const topicLaneProfileSchema = z.object({
  laneId: z.string().min(1),
  laneTitle: z.string().min(1),
  laneType: z.string().min(1),
  track: z.string().min(1),
  audience: z.string().min(1),
  creationFocus: z.array(z.string().min(1)),
  radarSignals: z.array(z.string().min(1)),
  qualityGates: z.array(z.string().min(1)),
  defaultOwner: z.string().min(1)
});

export type CreativeLane = z.infer<typeof creativeLaneSchema>;
export type CreativeLaneCatalog = z.infer<typeof creativeLaneCatalogSchema>;
export type TopicLaneProfile = z.infer<typeof topicLaneProfileSchema>;
