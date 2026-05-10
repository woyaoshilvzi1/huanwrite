import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globals: false
  },
  ssr: {
    external: ["node:sqlite", "sqlite"]
  },
  resolve: {
    alias: {
      "@huanwrite/shared": new URL("./packages/shared/src/index.ts", import.meta.url).pathname,
      "@huanwrite/core": new URL("./packages/core/src/index.ts", import.meta.url).pathname
    }
  }
});
