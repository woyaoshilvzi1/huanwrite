import { readFileSync } from "node:fs";
import { join } from "node:path";
import { creativeLaneCatalogSchema, type CreativeLane, type CreativeLaneCatalog } from "@huanwrite/shared";
import { AssetPaths } from "./assetPaths.js";

export class CreativeLaneAssetReader {
  constructor(private readonly paths: AssetPaths) {}

  readCatalog(): CreativeLaneCatalog {
    return creativeLaneCatalogSchema.parse(
      JSON.parse(readFileSync(join(this.paths.assetRoot(), "topic-rules", "creative-lanes.json"), "utf8"))
    );
  }

  list(): CreativeLane[] {
    return this.readCatalog().lanes;
  }

  get(laneId: string): CreativeLane {
    const lane = this.list().find((item) => item.id === laneId);
    if (!lane) throw new Error(`creative lane not found: ${laneId}`);
    return lane;
  }
}
