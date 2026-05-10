import { type DashboardCandidate } from "../dashboardSchema.js";

export function CandidateList({
  candidates,
  onReview,
  onMerge
}: {
  candidates: DashboardCandidate[];
  onReview: (candidateId: string) => Promise<void>;
  onMerge: (candidateId: string) => Promise<void>;
}) {
  if (candidates.length === 0) return <p>候选区暂无内容。</p>;

  return (
    <section className="lane" aria-label="候选操作">
      <h3>候选</h3>
      {candidates.map((item) => (
        <article key={item.id} className="lane-item" aria-label={`候选 ${item.inputSummary}`}>
          <strong>{item.actionType}</strong>
          <p>{item.inputSummary}</p>
          <p>状态：{item.status}</p>
          <div className="actions">
            <button type="button" onClick={() => onReview(item.id)} disabled={item.status !== "generated"}>
              审稿
            </button>
            <button type="button" onClick={() => onMerge(item.id)} disabled={item.status !== "approved"}>
              合并
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
