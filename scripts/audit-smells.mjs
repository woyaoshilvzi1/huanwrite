import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoots = ["packages", "tests", "README.md", "AGENTS.md", "docs", "spec"];
const codeRoots = ["packages", "tests"];

const textSmells = [
  /promptVersion/,
  /prompt_version/,
  /\.[vV][0-9]+\b/,
  /\b[Vv][0-9]+\b/,
  /MVP/,
  /兼容/,
  /old_waiting_to_be_delete/,
  /旧项目/,
  /旧版/,
  /迁移/
];

const codeSmells = [
  /\bany\b/,
  /unknown as/,
  /as \{/,
  /TODO/,
  /stub/,
  /placeholder/,
  /setTimeout\(/,
  /setInterval\(/,
  /\.first\(/,
  /\.last\(/,
  /nth\(/
];

const allowed = [
  /tests[\\/]production-line[\\/]repo-contracts\.test\.ts/,
  /tests[\\/]core[\\/]ai-config\.test\.ts/
];

const textFiles = sourceRoots.flatMap((entry) => listFiles(join(root, entry))).filter(isTextFile);
const codeFiles = codeRoots.flatMap((entry) => listFiles(join(root, entry))).filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));

const findings = [
  ...scan(textFiles, textSmells),
  ...scan(codeFiles, codeSmells)
].filter((finding) => !allowed.some((pattern) => pattern.test(finding.path)));

if (findings.length) {
  for (const finding of findings) {
    console.error(`${finding.path}:${finding.line}: ${finding.text}`);
  }
  process.exit(1);
}

console.log("bad-smell audit passed");

function listFiles(path) {
  const stats = statSync(path);
  if (!stats.isDirectory()) return [path];
  return readdirSync(path).flatMap((name) => listFiles(join(path, name)));
}

function isTextFile(file) {
  return file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".md") || file.endsWith(".json") || file.endsWith(".mjs");
}

function scan(files, patterns) {
  return files.flatMap((file) => {
    const rel = relative(root, file);
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    return lines.flatMap((text, index) =>
      patterns.some((pattern) => pattern.test(text)) ? [{ path: rel, line: index + 1, text: text.trim() }] : []
    );
  });
}
