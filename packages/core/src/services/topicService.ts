import { type Topic } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { assertNoSensitiveText } from "../security.js";

export type TopicInput = Omit<
  Topic,
  "id" | "status" | "selectionReason" | "createdAt" | "updatedAt" | "riskNote"
> & { riskNote?: string };

export class TopicService {
  constructor(private readonly store: FileProjectStore) {}

  create(input: TopicInput): Topic {
    assertNoSensitiveText(input);
    const timestamp = nowIso();
    return this.store.topics.save({
      ...input,
      riskNote: input.riskNote ?? "",
      id: newId("topic"),
      status: "idea",
      selectionReason: "",
      createdAt: timestamp,
      updatedAt: timestamp
    });
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
