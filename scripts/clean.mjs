import { rmSync } from "node:fs";

const targets = [
  "dist",
  "packages/shared/dist",
  "packages/core/dist",
  "packages/server/dist",
  "packages/web/dist",
  "packages/cli/dist",
  "packages/shared/tsconfig.tsbuildinfo",
  "packages/core/tsconfig.tsbuildinfo",
  "packages/server/tsconfig.tsbuildinfo",
  "packages/web/tsconfig.tsbuildinfo",
  "packages/cli/tsconfig.tsbuildinfo"
];

for (const target of targets) {
  rmSync(target, { recursive: true, force: true });
}
