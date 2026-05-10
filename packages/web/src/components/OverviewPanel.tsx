import { type ActionRunSummary } from "../api.js";
import { type Dashboard } from "../dashboardSchema.js";
import { DashboardCharts } from "./DashboardCharts.js";

export function OverviewPanel({ dashboard, runs }: { dashboard: Dashboard | null; runs: ActionRunSummary[] }) {
  const metrics = [
    ["题材", dashboard?.topics.length ?? 0],
    ["规划", dashboard?.plans.length ?? 0],
    ["正文", dashboard?.manuscripts.length ?? 0],
    ["候选", dashboard?.candidates.length ?? 0],
    ["审稿", dashboard?.reviews.length ?? 0],
    ["投稿包", dashboard?.submissions.length ?? 0]
  ];

  return (
    <section className="panel wide" aria-labelledby="overview-heading">
      <h2 id="overview-heading">看板总览</h2>
      <div className="metrics">
        {metrics.map(([label, value]) => (
          <div className="metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <DashboardCharts dashboard={dashboard} runs={runs} />
    </section>
  );
}
