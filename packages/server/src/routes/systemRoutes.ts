import { type Hono } from "hono";
import { AiProviderConfigReader, type WorkflowService } from "@huanwrite/core";
import { readWorkbenchContract } from "@huanwrite/shared";
import { browserApiClient, openApiDocument } from "../openapi.js";

export function registerSystemRoutes(app: Hono, workflow: WorkflowService): void {
  app.get("/api/health", (context) => context.json(workflow.healthSnapshot()));
  app.get("/api/config", (context) => {
    try {
      const active = new AiProviderConfigReader().readActive();
      return context.json({
        configured: true,
        provider: active.id,
        baseUrl: active.baseUrl,
        model: active.model,
        timeoutMs: active.timeoutMs,
        streaming: active.streaming,
        capabilities: active.capabilities
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "configuration read failed";
      return context.json({ configured: false, error: message }, 200);
    }
  });
  app.get("/api/contract", (context) => context.json(readWorkbenchContract()));
  app.get("/api/creative-lanes", (context) => context.json({ lanes: workflow.creativeLanes() }));
  app.get("/api/openapi.json", (context) => context.json(openApiDocument()));
  app.get("/assets/api-client.js", (context) =>
    context.text(browserApiClient(), 200, { "content-type": "application/javascript; charset=utf-8" })
  );
  app.get("/api/dashboard", (context) => context.json(workflow.dashboard()));
  app.get("/api/context", (context) => context.json(workflow.referenceContext()));
  app.get("/api/platform-radar", (context) => context.json(workflow.platformRadarSnapshot()));
  app.get("/api/eval-baseline", (context) => context.json(workflow.evalBaseline()));
}
