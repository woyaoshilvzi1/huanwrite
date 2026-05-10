import { type ActionRunSummary } from "./api.js";
import { type Dashboard } from "./dashboardSchema.js";

export interface NamedValue {
  name: string;
  value: number;
}

export interface FunnelRow {
  name: string;
  value: number;
}

export interface DashboardChartData {
  statusRows: NamedValue[];
  funnelRows: FunnelRow[];
  actionRows: NamedValue[];
}

const emptyRow: NamedValue = { name: "暂无数据", value: 0 };

export function buildDashboardChartData(dashboard: Dashboard | null, runs: ActionRunSummary[]): DashboardChartData {
  return {
    statusRows: buildStatusRows(dashboard),
    funnelRows: buildFunnelRows(dashboard),
    actionRows: buildActionRows(runs)
  };
}

function buildStatusRows(dashboard: Dashboard | null): NamedValue[] {
  if (!dashboard) return [emptyRow];

  const statusCounts = new Map<string, number>();
  const statuses = [
    ...dashboard.topics.map((item) => item.status),
    ...dashboard.plans.map((item) => item.status),
    ...dashboard.manuscripts.map((item) => item.status),
    ...dashboard.candidates.map((item) => item.status),
    ...dashboard.reviews.map((item) => item.status),
    ...dashboard.submissions.map((item) => item.status)
  ];

  for (const status of statuses) {
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
  }

  return mapCounts(statusCounts);
}

function buildFunnelRows(dashboard: Dashboard | null): FunnelRow[] {
  if (!dashboard) {
    return [
      { name: "题材", value: 0 },
      { name: "已选题材", value: 0 },
      { name: "确认规划", value: 0 },
      { name: "正文", value: 0 },
      { name: "候选", value: 0 },
      { name: "审稿", value: 0 },
      { name: "投稿包", value: 0 }
    ];
  }

  return [
    { name: "题材", value: dashboard.topics.length },
    { name: "已选题材", value: dashboard.topics.filter((item) => item.status === "selected").length },
    { name: "确认规划", value: dashboard.plans.filter((item) => item.status === "confirmed").length },
    { name: "正文", value: dashboard.manuscripts.length },
    { name: "候选", value: dashboard.candidates.length },
    { name: "审稿", value: dashboard.reviews.length },
    { name: "投稿包", value: dashboard.submissions.length }
  ];
}

function buildActionRows(runs: ActionRunSummary[]): NamedValue[] {
  const actionCounts = new Map<string, number>();
  for (const run of runs) {
    actionCounts.set(run.action, (actionCounts.get(run.action) ?? 0) + 1);
  }

  return mapCounts(actionCounts);
}

function mapCounts(counts: Map<string, number>): NamedValue[] {
  const rows = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));

  return rows.length ? rows : [emptyRow];
}
