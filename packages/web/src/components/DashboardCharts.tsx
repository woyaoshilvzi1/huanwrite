import { type EChartsType } from "echarts/types/dist/echarts.js";
import { type DependencyList, type RefObject, useEffect, useMemo, useRef } from "react";
import { type ActionRunSummary } from "../api.js";
import { buildDashboardChartData, type DashboardChartData } from "../chartData.js";
import { type Dashboard } from "../dashboardSchema.js";

const palette = ["#315f72", "#b88746", "#2f6f55", "#6b5d8c", "#a64040", "#4d6f9f", "#8a6a3f"];

export function DashboardCharts({ dashboard, runs }: { dashboard: Dashboard | null; runs: ActionRunSummary[] }) {
  const chartData = useMemo(() => buildDashboardChartData(dashboard, runs), [dashboard, runs]);

  return (
    <div className="chart-grid" aria-label="工作台图表">
      <StatusChart chartData={chartData} />
      <FunnelChart chartData={chartData} />
      <ActionChart chartData={chartData} />
    </div>
  );
}

function StatusChart({ chartData }: { chartData: DashboardChartData }) {
  const ref = useChart((chart) => {
    chart.setOption({
      color: palette,
      tooltip: { trigger: "item" },
      legend: { bottom: 0, left: "center", itemWidth: 10, itemHeight: 10 },
      series: [
        {
          name: "生产状态",
          type: "pie",
          radius: ["48%", "72%"],
          center: ["50%", "42%"],
          avoidLabelOverlap: true,
          label: { formatter: "{b}: {c}" },
          data: chartData.statusRows
        }
      ]
    });
  }, [chartData]);

  return <ChartFrame title="生产状态" ariaLabel="生产状态图" chartRef={ref} />;
}

function FunnelChart({ chartData }: { chartData: DashboardChartData }) {
  const ref = useChart((chart) => {
    chart.setOption({
      color: ["#315f72"],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { top: 18, right: 18, bottom: 20, left: 74, containLabel: true },
      xAxis: { type: "value", minInterval: 1 },
      yAxis: {
        type: "category",
        data: chartData.funnelRows.map((item) => item.name),
        axisLabel: { interval: 0, fontSize: 12 }
      },
      series: [
        {
          name: "数量",
          type: "bar",
          barWidth: 16,
          data: chartData.funnelRows.map((item) => item.value)
        }
      ]
    });
  }, [chartData]);

  return <ChartFrame title="生产漏斗" ariaLabel="生产漏斗图" chartRef={ref} />;
}

function ActionChart({ chartData }: { chartData: DashboardChartData }) {
  const ref = useChart((chart) => {
    chart.setOption({
      color: ["#b88746"],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { top: 18, right: 18, bottom: 28, left: 42, containLabel: true },
      xAxis: {
        type: "category",
        data: chartData.actionRows.map((item) => item.name),
        axisLabel: { interval: 0, rotate: 20, fontSize: 11 }
      },
      yAxis: { type: "value", minInterval: 1 },
      series: [
        {
          name: "运行次数",
          type: "bar",
          barWidth: 18,
          data: chartData.actionRows.map((item) => item.value)
        }
      ]
    });
  }, [chartData]);

  return <ChartFrame title="动作运行" ariaLabel="动作运行图" chartRef={ref} />;
}

function ChartFrame({
  title,
  ariaLabel,
  chartRef
}: {
  title: string;
  ariaLabel: string;
  chartRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="chart-card" aria-label={ariaLabel}>
      <h3>{title}</h3>
      <div className="chart-canvas" ref={chartRef} data-testid={ariaLabel} />
    </section>
  );
}

function useChart(render: (chart: EChartsType) => void, dependencies: DependencyList) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    let active = true;
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize());
    resizeObserver.observe(element);

    import("echarts").then((echarts) => {
      if (!active) return;
      const chart = chartRef.current ?? echarts.init(element);
      chartRef.current = chart;
      render(chart);
      chart.resize();
    });

    return () => {
      active = false;
      resizeObserver.disconnect();
    };
  }, dependencies);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return elementRef;
}
