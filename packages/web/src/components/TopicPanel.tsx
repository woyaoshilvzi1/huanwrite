import { type Dashboard, type DashboardTopic } from "../dashboardSchema.js";

export function TopicPanel({
  dashboard,
  onSelect,
  onPlan
}: {
  dashboard: Dashboard | null;
  onSelect: (topicId: string) => Promise<void>;
  onPlan: (topicId: string) => Promise<void>;
}) {
  return (
    <section className="panel" aria-labelledby="topic-heading">
      <h2 id="topic-heading">题材池</h2>
      {dashboard ? <TopicList topics={dashboard.topics} onSelect={onSelect} onPlan={onPlan} /> : <p>加载中...</p>}
    </section>
  );
}

function TopicList({
  topics,
  onSelect,
  onPlan
}: {
  topics: DashboardTopic[];
  onSelect: (topicId: string) => Promise<void>;
  onPlan: (topicId: string) => Promise<void>;
}) {
  if (topics.length === 0) return <p>暂无题材</p>;

  return (
    <ul className="topic-list">
      {topics.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.title}</strong>
            <p>状态：{item.status}</p>
            {item.laneProfile ? (
              <p>
                稿线：{item.laneProfile.laneTitle} · {item.laneProfile.track}
              </p>
            ) : null}
            <p>下一步：{item.nextAction}</p>
          </div>
          <div className="actions">
            <button type="button" onClick={() => onSelect(item.id)} disabled={item.status !== "idea"}>
              选中
            </button>
            <button type="button" onClick={() => onPlan(item.id)} disabled={item.status !== "selected"}>
              创建规划
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
