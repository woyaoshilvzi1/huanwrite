import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("formal assets", () => {
  it("keeps writing skill assets under the current project", () => {
    expect(exists(".huanwrite/assets/skills/chinese-novelist/SKILL.md")).toBe(true);
    expect(exists(".huanwrite/assets/skills/chinese-webnovel/SKILL.md")).toBe(true);
  });

  it("keeps corpus assets under the current project", () => {
    expect(exists(".huanwrite/assets/corpus/webnovel/analysis/article_profiles.csv")).toBe(true);
    expect(exists(".huanwrite/assets/corpus/webnovel/data/metadata.csv")).toBe(true);
  });

  it("keeps AI provider configuration without storing secrets", () => {
    expect(exists(".huanwrite/.env.example")).toBe(true);
    expect(exists(".huanwrite/assets/ai/agents/default-webnovel-agent.json")).toBe(true);
  });
});

function exists(path: string): boolean {
  return existsSync(join(root, path));
}
