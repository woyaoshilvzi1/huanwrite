import { ensureProjectStructure } from "@huanwrite/core";

const command = process.argv[2] ?? "help";

if (command === "init") {
  ensureProjectStructure(process.cwd());
  console.log("Huanwrite project structure is ready.");
} else if (command === "help") {
  console.log("Usage: huanwrite init");
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}

