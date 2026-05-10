import { defineConfig, devices } from "@playwright/test";
import { e2eWorkspaceRoot, prepareE2eWorkspace } from "./tests/e2e/workspace.js";

const apiPort = 4727;
const webPort = 5273;
prepareE2eWorkspace();
const envPrefix = `$env:HUANWRITE_ROOT='${e2eWorkspaceRoot}'; $env:HUANWRITE_PORT='${apiPort}'; $env:HUANWRITE_PROVIDER='yls'; $env:HUANWRITE_API_KEY='test-provider-key'; $env:HUANWRITE_BASE_URL='https://api.ylsagi.example/v1'; $env:HUANWRITE_MODEL='gpt-5.5'; $env:HUANWRITE_API_TIMEOUT_MS='300000'; $env:HUANWRITE_REASONING_EFFORT='medium'; $env:HUANWRITE_SHOW_REASONING='false'; $env:HUANWRITE_STREAMING='true';`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  workers: 1,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  reporter: [["list"]],
  globalSetup: "./tests/e2e/globalSetup.ts",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://127.0.0.1:${webPort}`,
    headless: false,
    trace: "retain-on-failure"
  },
  webServer: [
    {
      command: `powershell -NoProfile -Command "${envPrefix} npm.cmd run dev"`,
      url: `http://127.0.0.1:${apiPort}/api/health`,
      reuseExistingServer: false,
      timeout: 30_000
    },
    {
      command: `powershell -NoProfile -Command "${envPrefix} $env:HUANWRITE_WEB_PORT='${webPort}'; npm.cmd run dev:web"`,
      url: `http://127.0.0.1:${webPort}/index.html`,
      reuseExistingServer: false,
      timeout: 30_000
    }
  ]
});
