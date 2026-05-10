import { Hono } from "hono";
import { FileProjectStore, WorkflowService } from "@huanwrite/core";
import { registerActionRoutes } from "./routes/actionRoutes.js";
import { registerProductionRoutes } from "./routes/productionRoutes.js";
import { registerSystemRoutes } from "./routes/systemRoutes.js";

export type HuanwriteServerApp = Hono & { close: () => void };

export interface HuanwriteServerRuntime {
  app: HuanwriteServerApp;
  workflow: WorkflowService;
}

export function createServerApp(root = process.cwd()): HuanwriteServerApp {
  return createServerRuntime(root).app;
}

export function createServerRuntime(root = process.cwd()): HuanwriteServerRuntime {
  const workflow = new WorkflowService(new FileProjectStore(root));
  const app = new Hono() as HuanwriteServerApp;
  app.close = () => workflow.close();
  app.onError((error, context) => context.json({ error: error.message }, 500));
  registerSystemRoutes(app, workflow);
  registerProductionRoutes(app, workflow);
  registerActionRoutes(app, workflow);
  return { app, workflow };
}
