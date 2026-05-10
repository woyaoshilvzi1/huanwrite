import { readFileSync } from "node:fs";
import { z } from "zod";
import { structureCardSchema } from "@huanwrite/shared";
import { AssetPaths } from "./assetPaths.js";

const defaultPlanSchema = z.object({
  relationships: z.array(z.string()),
  structureCards: z.array(structureCardSchema),
  styleRules: z.array(z.string()),
  bannedPhrases: z.array(z.string()),
  fatigueWords: z.array(z.string()),
  voiceFingerprints: z.array(z.string()).default([]),
  styleFingerprints: z.array(z.string()).default([]),
  craftCards: z.array(z.string()).default([])
});

export type DefaultPlanAsset = z.infer<typeof defaultPlanSchema>;

export class DefaultPlanAssetReader {
  constructor(private readonly paths: AssetPaths) {}

  read(): DefaultPlanAsset {
    const text = readFileSync(this.paths.template("default-plan.json"), "utf8");
    return defaultPlanSchema.parse(JSON.parse(text));
  }
}
