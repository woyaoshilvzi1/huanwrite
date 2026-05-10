import { serve } from "@hono/node-server";
import { Server as HttpServer } from "node:http";
import { config } from "dotenv";
import { createServerRuntime } from "./app.js";
import { attachJobWebSocket } from "./websocket/jobSocket.js";

config({ path: ".huanwrite/.env" });

const port = Number(process.env.HUANWRITE_PORT ?? 4627);
const root = process.env.HUANWRITE_ROOT ?? process.cwd();
const runtime = createServerRuntime(root);

const server = serve({
  fetch: runtime.app.fetch,
  port
});
if (!(server instanceof HttpServer)) {
  throw new Error("Huanwrite WebSocket transport requires an HTTP server");
}
attachJobWebSocket(server, runtime.workflow);

console.log(`Huanwrite listening on http://127.0.0.1:${port}`);
