import { type WorkbenchActionId } from "@huanwrite/shared";
import { jsonPost, request } from "./request.js";
import { type ActionRunSummary, type BackgroundJobSummary } from "./types.js";

export async function runWorkbenchAction(input: {
  action: WorkbenchActionId;
  manuscriptId?: string;
  planId?: string;
  candidateId?: string;
  targetPlatform?: string;
  instructions?: string;
  clientTraceId?: string;
}): Promise<{ job: BackgroundJobSummary }> {
  const response = await request("/api/action", jsonPost(input));
  return response.json();
}

export async function appendEvent(input: {
  type: string;
  traceId?: string;
  action?: WorkbenchActionId;
  message?: string;
}): Promise<void> {
  await request("/api/events", jsonPost(input));
}

export async function stopAction(jobId: string): Promise<BackgroundJobSummary> {
  const response = await request("/api/action-stop", jsonPost({ jobId }));
  return response.json();
}
