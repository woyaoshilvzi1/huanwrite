import { zValidator } from "@hono/zod-validator";
import { type Hono } from "hono";
import { type WorkflowService } from "@huanwrite/core";
import {
  appendEventRequestSchema,
  runWorkbenchActionRequestSchema,
  stopActionRequestSchema
} from "../schemas.js";

export function registerActionRoutes(app: Hono, workflow: WorkflowService): void {
  app.get("/api/runs", (context) => context.json({ runs: workflow.listRuns() }));
  app.get("/api/runs/:id", (context) => context.text(workflow.readRunText(context.req.param("id"))));
  app.get("/api/runs/:id/trace", (context) =>
    context.text(workflow.readRunTrace(context.req.param("id")), 200, { "content-type": "application/json; charset=utf-8" })
  );
  app.get("/api/jobs", (context) => context.json({ jobs: workflow.listJobs() }));
  app.get("/api/action-status", (context) => {
    const jobId = context.req.query("jobId");
    if (!jobId) return context.json({ error: "jobId is required" }, 400);
    return context.json(workflow.getJob(jobId));
  });
  app.post("/api/action", zValidator("json", runWorkbenchActionRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.startWorkbenchAction(body), 202);
  });
  app.post("/api/action-stop", zValidator("json", stopActionRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.stopJob(body.jobId), 202);
  });
  app.get("/api/events", (context) => {
    const traceId = context.req.query("traceId");
    return context.json({ events: workflow.listEvents(traceId) });
  });
  app.post("/api/events", zValidator("json", appendEventRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.appendEvent(body), 202);
  });
}
