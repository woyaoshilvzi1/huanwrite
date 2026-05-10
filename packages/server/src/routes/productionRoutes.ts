import { zValidator } from "@hono/zod-validator";
import { type Hono } from "hono";
import { type WorkflowService } from "@huanwrite/core";
import {
  buildSubmissionRequestSchema,
  createManuscriptRequestSchema,
  createTopicFromLaneRequestSchema,
  createTopicRequestSchema,
  runActionRequestSchema,
  saveManuscriptTextRequestSchema,
  selectTopicRequestSchema,
  updateManuscriptWorkbenchRequestSchema,
  updatePlanRequestSchema
} from "../schemas.js";

export function registerProductionRoutes(app: Hono, workflow: WorkflowService): void {
  app.post("/api/topics", zValidator("json", createTopicRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.createTopic(body));
  });
  app.post("/api/lane-topics", zValidator("json", createTopicFromLaneRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.createTopicFromLane(body.laneId, body.topic));
  });
  app.post("/api/topics/:id/select", zValidator("json", selectTopicRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.selectTopic(context.req.param("id"), body.reason));
  });
  app.post("/api/topics/:id/plans", (context) => context.json(workflow.createPlan(context.req.param("id"))));
  app.post("/api/plans/:id/complete", (context) => context.json(workflow.completePlan(context.req.param("id"))));
  app.post("/api/plans/:id/confirm", (context) => context.json(workflow.confirmPlan(context.req.param("id"))));
  app.put("/api/plans/:id", zValidator("json", updatePlanRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.updatePlan(context.req.param("id"), body));
  });
  app.post("/api/topics/:id/manuscripts", zValidator("json", createManuscriptRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.createManuscript(context.req.param("id"), body.planId, body.title));
  });
  app.get("/api/manuscripts/:id/text", (context) => context.text(workflow.readManuscriptText(context.req.param("id"))));
  app.put("/api/manuscripts/:id/text", zValidator("json", saveManuscriptTextRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.saveManuscriptText(context.req.param("id"), body.text));
  });
  app.patch("/api/manuscripts/:id/workbench", zValidator("json", updateManuscriptWorkbenchRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.updateManuscriptWorkbench(context.req.param("id"), body));
  });
  app.post("/api/manuscripts/:id/actions", zValidator("json", runActionRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.runAction(body.actionType, context.req.param("id"), body.planId));
  });
  app.post("/api/candidates/:id/review", (context) => context.json(workflow.reviewCandidate(context.req.param("id"))));
  app.post("/api/candidates/:id/merge", (context) => context.json(workflow.mergeCandidate(context.req.param("id"))));
  app.post("/api/manuscripts/:id/submissions", zValidator("json", buildSubmissionRequestSchema), (context) => {
    const body = context.req.valid("json");
    return context.json(workflow.buildSubmissionPackage(context.req.param("id"), body.targetPlatform));
  });
}
