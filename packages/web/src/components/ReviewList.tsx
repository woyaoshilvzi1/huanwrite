import { type Dashboard } from "../dashboardSchema.js";

export function ReviewList({ reviews }: { reviews: Dashboard["reviews"] }) {
  if (reviews.length === 0) return <p>审稿区暂无记录。</p>;

  return (
    <section className="lane" aria-label="审稿记录">
      <h3>审稿</h3>
      {reviews.map((item) => (
        <article key={item.id} className="lane-item">
          <strong>{item.conclusion}</strong>
          <p>风险：{item.riskLevel} · 状态：{item.status}</p>
        </article>
      ))}
    </section>
  );
}
