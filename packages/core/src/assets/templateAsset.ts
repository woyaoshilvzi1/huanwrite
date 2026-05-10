import { readFileSync } from "node:fs";
import { AssetPaths } from "./assetPaths.js";

export class TemplateAssetReader {
  constructor(private readonly paths: AssetPaths) {}

  candidateText(): string {
    return readFileSync(this.paths.template("candidate-text.md"), "utf8");
  }
}
