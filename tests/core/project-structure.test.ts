import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureProjectStructure, projectDirectories } from "@huanwrite/core";

describe("project structure", () => {
  it("creates every declared source-of-truth directory", () => {
    const root = mkdtempSync(join(tmpdir(), "huanwrite-"));
    try {
      ensureProjectStructure(root);
      for (const dir of projectDirectories) {
        expect(existsSync(join(root, dir))).toBe(true);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

