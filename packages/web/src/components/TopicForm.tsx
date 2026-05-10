import { type FormEvent } from "react";
import { type TopicInput } from "../topicInput.js";
import { Field } from "./Field.js";

export function TopicForm({
  topic,
  setTopic,
  onSubmit
}: {
  topic: TopicInput;
  setTopic: (topic: TopicInput) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>创建题材</h2>
      <Field label="标题" ariaLabel="题材标题" value={topic.title} onChange={(title) => setTopic({ ...topic, title })} />
      <Field label="想法" value={topic.idea} onChange={(idea) => setTopic({ ...topic, idea })} />
      <Field label="卖点" value={topic.sellingPoint} onChange={(sellingPoint) => setTopic({ ...topic, sellingPoint })} />
      <Field
        label="主角压力"
        value={topic.protagonistPressure}
        onChange={(protagonistPressure) => setTopic({ ...topic, protagonistPressure })}
      />
      <Field label="主冲突" value={topic.mainConflict} onChange={(mainConflict) => setTopic({ ...topic, mainConflict })} />
      <Field label="读者爽点" value={topic.readerPayoff} onChange={(readerPayoff) => setTopic({ ...topic, readerPayoff })} />
      <Field label="目标平台" value={topic.targetPlatform} onChange={(targetPlatform) => setTopic({ ...topic, targetPlatform })} />
      <Field label="目标长度" value={topic.targetLength} onChange={(targetLength) => setTopic({ ...topic, targetLength })} />
      <button type="submit">创建题材</button>
    </form>
  );
}
