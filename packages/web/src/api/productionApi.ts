import { type Dashboard } from "../dashboardSchema.js";
import { type TopicInput } from "../topicInput.js";
import { jsonPost, request } from "./request.js";
import { type PlanUpdatePayload } from "./types.js";

export async function createTopic(input: TopicInput): Promise<void> {
  const { laneId, ...topic } = input;
  if (laneId) {
    await request("/api/lane-topics", jsonPost({ ...topic, laneId }));
    return;
  }
  await request("/api/topics", jsonPost(topic));
}

export async function selectTopic(topicId: string, reason: string): Promise<void> {
  await request(`/api/topics/${topicId}/select`, jsonPost({ reason }));
}

export async function createPlan(topicId: string): Promise<void> {
  await request(`/api/topics/${topicId}/plans`, jsonPost());
}

export async function completePlan(planId: string): Promise<void> {
  await request(`/api/plans/${planId}/complete`, jsonPost());
}

export async function updatePlan(planId: string, input: PlanUpdatePayload): Promise<void> {
  await request(`/api/plans/${planId}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
}

export async function confirmPlan(planId: string): Promise<void> {
  await request(`/api/plans/${planId}/confirm`, jsonPost());
}

export async function createManuscript(topicId: string, planId: string, title: string): Promise<void> {
  await request(`/api/topics/${topicId}/manuscripts`, jsonPost({ planId, title }));
}

export async function runAction(manuscriptId: string, planId: string, actionType: string): Promise<void> {
  await request(`/api/manuscripts/${manuscriptId}/actions`, jsonPost({ planId, actionType }));
}

export async function saveManuscriptText(manuscriptId: string, text: string): Promise<void> {
  await request(`/api/manuscripts/${manuscriptId}/text`, {
    ...jsonPost({ text }),
    method: "PUT"
  });
}

export async function updateManuscriptWorkbench(
  manuscriptId: string,
  input: Dashboard["manuscripts"][number]["workbench"]
): Promise<void> {
  await request(`/api/manuscripts/${manuscriptId}/workbench`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      laneStatus: input.laneStatus,
      owner: input.owner,
      notes: input.notes,
      qualityGates: input.qualityGates
    })
  });
}

export async function reviewCandidate(candidateId: string): Promise<void> {
  await request(`/api/candidates/${candidateId}/review`, jsonPost());
}

export async function mergeCandidate(candidateId: string): Promise<void> {
  await request(`/api/candidates/${candidateId}/merge`, jsonPost());
}

export async function buildSubmission(manuscriptId: string, targetPlatform: string): Promise<void> {
  await request(`/api/manuscripts/${manuscriptId}/submissions`, jsonPost({ targetPlatform }));
}
