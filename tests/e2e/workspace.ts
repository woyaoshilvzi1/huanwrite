import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export const e2eRunId = new Date().toISOString().replace(/[:.]/g, "-");
export const e2eWorkspaceRoot = join("test-results", "e2e-workspaces", e2eRunId);

export function prepareE2eWorkspace(): void {
  mkdirSync(join(e2eWorkspaceRoot, ".huanwrite"), { recursive: true });
  const sourceAssets = join(".huanwrite", "assets");
  const targetAssets = join(e2eWorkspaceRoot, ".huanwrite", "assets");
  if (existsSync(sourceAssets)) {
    cpSync(sourceAssets, targetAssets, { recursive: true });
  }
}
