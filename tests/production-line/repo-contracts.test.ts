import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("repository contracts", () => {
  it("keeps tests in the root tests directory", () => {
    const packageTestFiles = listFiles(join(root, "packages")).filter((path) => path.includes("\\tests\\") || path.includes("/tests/"));
    expect(packageTestFiles).toEqual([]);
  });

  it("keeps end-to-end tests inside the root tests directory", () => {
    expect(existsAtRoot("e2e")).toBe(false);
    expect(existsAtRoot("tests/e2e")).toBe(true);
  });

  it("does not keep Python implementation leftovers", () => {
    const forbidden = ["app", "pyproject.toml", "huanwrite.egg-info", ".pytest_cache"];
    for (const name of forbidden) {
      expect(existsAtRoot(name)).toBe(false);
    }
  });

  it("does not use any or private workflow casts in TypeScript source", () => {
    const sourceFiles = listFiles(join(root, "packages")).filter((path) => path.endsWith(".ts") || path.endsWith(".tsx"));
    const offenders = sourceFiles.filter((path) => {
      const text = readFileSync(path, "utf8");
      return /\bany\b|unknown as|as \{/.test(text);
    });
    expect(offenders).toEqual([]);
  });

  it("does not keep build outputs as package source files", () => {
    const packageFiles = listFiles(join(root, "packages"));
    const generatedFiles = packageFiles.filter((path) => path.includes(`${sep}dist${sep}`) || path.endsWith(".tsbuildinfo"));
    expect(generatedFiles).toEqual([]);
  });

  it("keeps package build outputs centralized under the root dist folder", () => {
    const packageConfigs = listFiles(join(root, "packages")).filter((path) => path.endsWith("tsconfig.json"));
    const packageLevelOutputs = packageConfigs.filter((path) => {
      const text = readFileSync(path, "utf8");
      return text.includes('"outDir": "dist"') || !text.includes('"../../dist/packages/');
    });
    expect(packageLevelOutputs).toEqual([]);
  });
});

function existsAtRoot(name: string): boolean {
  try {
    statSync(join(root, name));
    return true;
  } catch {
    return false;
  }
}

function listFiles(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}
