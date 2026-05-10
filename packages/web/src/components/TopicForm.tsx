import { type FormEvent } from "react";
import { type TopicInput } from "../topicInput.js";
import { Field } from "./Field.js";

export function TopicForm({
  topic,
  lanes,
  setTopic,
  onSubmit
}: {
  topic: TopicInput;
  lanes: Array<{
    id: string;
    title: string;
    track: string;
    targetPlatform: string;
    targetLength: string;
    audience: string;
    creationFocus: string[];
    radarSignals: string[];
    notes: string;
  }>;
  setTopic: (topic: TopicInput) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const selectedLane = lanes.find((lane) => lane.id === topic.laneId);
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>按稿线创建题材</h2>
      <label>
        <span>创作稿线</span>
        <select
          aria-label="创作稿线"
          value={topic.laneId}
          onChange={(event) => {
            const lane = lanes.find((item) => item.id === event.target.value);
            setTopic({
              ...topic,
              laneId: event.target.value,
              targetPlatform: lane?.targetPlatform ?? topic.targetPlatform,
              targetLength: lane?.targetLength ?? topic.targetLength
            });
          }}
        >
          {lanes.map((lane) => (
            <option key={lane.id} value={lane.id}>
              {lane.title}
            </option>
          ))}
        </select>
      </label>
      {selectedLane ? (
        <section className="lane-brief" aria-label="稿线要求">
          <strong>{selectedLane.title}</strong>
          <p>{selectedLane.track}</p>
          <p>{selectedLane.audience}</p>
          <p>雷达信号：{selectedLane.radarSignals.join(" / ")}</p>
          <ul>
            {selectedLane.creationFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
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
      <button type="submit">按稿线创建题材</button>
    </form>
  );
}
