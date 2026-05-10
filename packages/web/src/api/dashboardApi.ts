import { dashboardSchema, type Dashboard } from "../dashboardSchema.js";
import { request } from "./request.js";
import { type JobsResponse, type PlatformRadarSnapshot, type ReferenceContextResponse, type RunOutputResponse, type RunsResponse } from "./types.js";

export async function fetchDashboard(): Promise<Dashboard> {
  const response = await request("/api/dashboard");
  return dashboardSchema.parse(await response.json());
}

export async function fetchRuns(): Promise<RunsResponse> {
  const response = await request("/api/runs");
  return response.json();
}

export async function fetchRunOutput(runId: string): Promise<RunOutputResponse> {
  const response = await request(`/api/runs/${runId}`);
  return {
    runId,
    content: await response.text()
  };
}

export async function fetchJobs(): Promise<JobsResponse> {
  const response = await request("/api/jobs");
  return response.json();
}

export async function fetchReferenceContext(): Promise<ReferenceContextResponse> {
  const response = await request("/api/context");
  return response.json();
}

export async function fetchPlatformRadar(): Promise<PlatformRadarSnapshot> {
  const response = await request("/api/platform-radar");
  return response.json();
}
