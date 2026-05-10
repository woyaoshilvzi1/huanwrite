import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export class AssetPaths {
  constructor(private readonly projectRoot: string) {}

  assetRoot(): string {
    const projectAssetRoot = join(this.projectRoot, ".huanwrite", "assets");
    if (existsSync(join(projectAssetRoot, "ASSET_MANIFEST.md"))) return projectAssetRoot;
    const compiledFile = dirname(fileURLToPath(import.meta.url));
    return resolve(compiledFile, "../../../../.huanwrite/assets");
  }

  template(name: string): string {
    const projectAsset = join(this.assetRoot(), "templates", name);
    if (existsSync(projectAsset)) return projectAsset;
    const compiledFile = dirname(fileURLToPath(import.meta.url));
    return resolve(compiledFile, "../../../../.huanwrite/assets/templates", name);
  }
}
