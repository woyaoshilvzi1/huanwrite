import { type CreativeLane, type Topic, type TopicLaneProfile } from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { assertNoSensitiveText } from "../security.js";

export type TopicInput = Omit<
  Topic,
  "id" | "laneProfile" | "status" | "selectionReason" | "createdAt" | "updatedAt" | "riskNote"
> & { riskNote?: string };

export class TopicService {
  constructor(
    private readonly store: FileProjectStore,
    private readonly assets: AssetCatalog
  ) {}

  create(input: TopicInput, lane?: TopicLaneProfile): Topic {
    assertNoSensitiveText(input);
    const timestamp = nowIso();
    return this.store.topics.save({
      ...input,
      riskNote: input.riskNote ?? "",
      laneProfile: lane,
      id: newId("topic"),
      status: "idea",
      selectionReason: "",
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  createFromLane(laneId: string, input: TopicInput): Topic {
    const lane = this.assets.creativeLanes.get(laneId);
    return this.create(
      {
        ...input,
        targetPlatform: lane.targetPlatform,
        targetLength: lane.targetLength,
        riskNote: [input.riskNote, `稿线要求：${lane.creationFocus.join("；")}`].filter(Boolean).join("\n")
      },
      laneProfile(lane)
    );
  }

  select(topicId: string, reason: string): Topic {
    assertNoSensitiveText(reason);
    const topic = this.store.topics.get(topicId);
    return this.store.topics.save({
      ...topic,
      status: "selected",
      selectionReason: reason,
      updatedAt: nowIso()
    });
  }
}

function laneProfile(lane: CreativeLane): TopicLaneProfile {
  return {
    laneId: lane.id,
    laneTitle: lane.title,
    laneType: lane.laneType,
    track: lane.track,
    audience: lane.audience,
    creationFocus: lane.creationFocus,
    radarSignals: lane.radarSignals,
    qualityGates: lane.qualityGates,
    defaultOwner: lane.defaultOwner
  };
}
