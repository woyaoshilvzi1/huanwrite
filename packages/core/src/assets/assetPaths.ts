import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export class AssetPaths {
  constructor(private readonly root: string) {}

  template(name: string): string {
    const projectAsset = join(this.root, ".huanwrite", "assets", "templates", name);
    if (existsSync(projectAsset)) return projectAsset;
    const compiledFile = dirname(fileURLToPath(import.meta.url));
    return resolve(compiledFile, "../../../../.huanwrite/assets/templates", name);
  }
}
