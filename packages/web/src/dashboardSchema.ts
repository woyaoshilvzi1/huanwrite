import { z } from "zod";

export const dashboardSchema = z.object({
  creativeLanes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      laneType: z.string(),
      track: z.string(),
      targetPlatform: z.string(),
      targetLength: z.string(),
      audience: z.string(),
      creationFocus: z.array(z.string()),
      radarSignals: z.array(z.string()),
      qualityGates: z.array(z.string()),
      defaultOwner: z.string(),
      notes: z.string()
    })
  ),
  topics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      nextAction: z.string(),
      selectionReason: z.string().optional(),
      laneProfile: z
        .object({
          laneId: z.string(),
          laneTitle: z.string(),
          laneType: z.string(),
          track: z.string(),
          audience: z.string(),
          creationFocus: z.array(z.string()),
          radarSignals: z.array(z.string()),
          qualityGates: z.array(z.string()),
          defaultOwner: z.string()
        })
        .optional()
    })
  ),
  plans: z.array(
    z.object({
      id: z.string(),
      topicId: z.string(),
      storyPromise: z.string(),
      protagonistGoal: z.string(),
      mainConflict: z.string(),
      stakesChain: z.string(),
      relationships: z.array(z.string()),
      structureCards: z.array(
        z.object({
          title: z.string(),
          summary: z.string(),
          targetWords: z.string(),
          sceneCount: z.string(),
          characters: z.string(),
          goal: z.string(),
          protagonistGoal: z.string(),
          conflict: z.string(),
          change: z.string(),
          turningPoint: z.string(),
          hook: z.string(),
          payoffHook: z.string(),
          oocRisk: z.string(),
          humanNote: z.string()
        })
      ),
      styleRules: z.array(z.string()),
      bannedPhrases: z.array(z.string()),
      fatigueWords: z.array(z.string()),
      status: z.string(),
      targetPlatform: z.string(),
      manuscriptShape: z.string()
    })
  ),
  planDetails: z.array(
    z.object({
      planId: z.string(),
      voiceFingerprints: z.array(z.string()),
      styleFingerprints: z.array(z.string()),
      craftCards: z.array(z.string()),
      updatedAt: z.string()
    })
  ),
  manuscripts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      topicId: z.string(),
      currentPlanId: z.string(),
      charCount: z.number(),
      status: z.string(),
      latestChangeSource: z.string(),
      workbench: z.object({
        manuscriptId: z.string(),
        laneStatus: z.string(),
        laneProfile: z
          .object({
            laneId: z.string(),
            laneTitle: z.string(),
            laneType: z.string(),
            track: z.string(),
            audience: z.string(),
            creationFocus: z.array(z.string()),
            radarSignals: z.array(z.string()),
            qualityGates: z.array(z.string()),
            defaultOwner: z.string()
          })
          .optional(),
        owner: z.string(),
        notes: z.string(),
        qualityGates: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            passed: z.boolean(),
            owner: z.string(),
            note: z.string()
          })
        ),
        updatedAt: z.string()
      }),
      actionAvailability: z.record(
        z.object({
          action: z.string(),
          enabled: z.boolean(),
          reason: z.string()
        })
      )
    })
  ),
  candidates: z.array(
    z.object({
      id: z.string(),
      manuscriptId: z.string(),
      planId: z.string(),
      actionType: z.string(),
      inputSummary: z.string(),
      status: z.string()
    })
  ),
  reviews: z.array(
    z.object({
      id: z.string(),
      candidateId: z.string(),
      conclusion: z.string(),
      riskLevel: z.string(),
      status: z.string()
    })
  ),
  submissions: z.array(
    z.object({
      id: z.string(),
      sourceId: z.string(),
      targetPlatform: z.string(),
      status: z.string()
    })
  )
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DashboardTopic = Dashboard["topics"][number];
export type DashboardPlan = Dashboard["plans"][number];
export type DashboardPlanDetail = Dashboard["planDetails"][number];
export type DashboardManuscript = Dashboard["manuscripts"][number];
export type DashboardCandidate = Dashboard["candidates"][number];
