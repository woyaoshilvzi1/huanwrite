import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const apiPort = Number(process.env.HUANWRITE_PORT ?? 4627);
const webPort = Number(process.env.HUANWRITE_WEB_PORT ?? 5173);

export default defineConfig({
  resolve: {
    alias: {
      "@huanwrite/shared": resolve("packages/shared/src/index.ts")
    }
  },
  plugins: [react()],
  root: "packages/web",
  server: {
    host: "127.0.0.1",
    port: webPort,
    strictPort: true,
    proxy: {
      "/api": `http://127.0.0.1:${apiPort}`,
      "/assets/api-client.js": `http://127.0.0.1:${apiPort}`,
      "/ws/jobs": {
        target: `ws://127.0.0.1:${apiPort}`,
        ws: true
      }
    }
  }
});
