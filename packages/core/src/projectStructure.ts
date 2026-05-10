import { mkdirSync } from "node:fs";
import { join } from "node:path";

export const projectDirectories = [
  ".huanwrite",
  ".huanwrite/manuscripts",
  ".huanwrite/candidates",
  ".huanwrite/revenue",
  ".huanwrite/platforms",
  ".huanwrite/adaptations",
  ".huanwrite/assets/writing-rules",
  ".huanwrite/assets/quality-rules",
  ".huanwrite/assets/topic-rules",
  ".huanwrite/assets/corpus",
  ".huanwrite/assets/templates",
  ".huanwrite/runs/actions",
  ".huanwrite/runs/errors",
  ".huanwrite/runs/reports"
] as const;

export function ensureProjectStructure(root: string): void {
  for (const dir of projectDirectories) {
    mkdirSync(join(root, dir), { recursive: true });
  }
}
