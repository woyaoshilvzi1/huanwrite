import { useMemo, useState } from "react";
import { ProductionPanel } from "./components/ProductionPanel.js";
import { TopicForm } from "./components/TopicForm.js";
import { TopicPanel } from "./components/TopicPanel.js";
import { ActionPanel, BoardPanel, OverviewPanel, PlatformPanel, ReferencePanel, RunsPanel } from "./components/WorkbenchPanels.js";
import { useWorkbenchController } from "./useWorkbenchController.js";
import "./styles/index.css";

const views = [
  { id: "board", label: "看板" },
  { id: "radar", label: "平台雷达" },
  { id: "planning", label: "规划" },
  { id: "writing", label: "写稿" },
  { id: "runs", label: "输出" },
  { id: "reference", label: "参考" }
] as const;

type WorkbenchView = (typeof views)[number]["id"];

export function App() {
  const workbench = useWorkbenchController();
  const [view, setView] = useState<WorkbenchView>("board");
  const selectedTitle = workbench.selectedManuscript?.title ?? workbench.dashboard?.topics[0]?.title ?? "等待稿线";
  const selectedSubtitle = useMemo(() => {
    const lane = workbench.selectedManuscript?.workbench.laneProfile;
    if (lane) return `${lane.laneTitle} / ${lane.track}`;
    const topicLane = workbench.dashboard?.topics.find((topic) => topic.title === selectedTitle)?.laneProfile;
    if (topicLane) return `${topicLane.laneTitle} / ${topicLane.track}`;
    return "选择稿线后进入创作链路";
  }, [selectedTitle, workbench.dashboard?.topics, workbench.selectedManuscript?.workbench.laneProfile]);

  return (
    <main className="workbench-shell">
      <aside className="workbench-sidebar" aria-label="主导航">
        <div>
          <h1>Huanwrite</h1>
          <p>short-stories/batch-001</p>
        </div>
        <nav>
          {views.map((item) => (
            <button
              type="button"
              key={item.id}
              className={view === item.id ? "active" : ""}
              aria-pressed={view === item.id}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <section className="sidebar-jobs" aria-label="后台任务摘要">
          <strong>后台任务</strong>
          <p>{workbench.jobs.length ? `最近 ${workbench.jobs.length} 个任务` : "暂无任务。"}</p>
          <button type="button" onClick={() => setView("runs")}>
            查看任务
          </button>
        </section>
        <p className="sidebar-status">就绪。</p>
      </aside>

      <section className="workbench-main">
        <header className="workbench-topbar">
          <div>
            <h2>{views.find((item) => item.id === view)?.label}</h2>
            <p>{selectedSubtitle}</p>
          </div>
          <div className="topbar-actions">
            <select
              aria-label="顶部稿线选择"
              value={workbench.selectedManuscriptId}
              onChange={(event) => workbench.setSelectedManuscriptId(event.target.value)}
            >
              <option value="">{selectedTitle}</option>
              {(workbench.dashboard?.manuscripts ?? []).map((manuscript) => (
                <option key={manuscript.id} value={manuscript.id}>
                  {manuscript.title}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => window.location.reload()}>
              刷新
            </button>
            <button type="button" onClick={() => setView("writing")}>
              保存
            </button>
          </div>
        </header>

        {workbench.message ? (
          <p role="status" aria-label="操作结果" className="notice">
            {workbench.message}
          </p>
        ) : null}
        {workbench.error ? (
          <p role="alert" className="error">
            加载失败：{workbench.error}
          </p>
        ) : null}

        <section className="workbench-view" aria-label="工作台">
          {view === "board" ? (
            <>
              <OverviewPanel dashboard={workbench.dashboard} runs={workbench.runs} />
              <BoardPanel dashboard={workbench.dashboard} onUpdateWorkbench={workbench.updateWorkbenchMeta} />
              <section className="view-grid">
                <TopicForm
                  topic={workbench.topic}
                  lanes={workbench.dashboard?.creativeLanes ?? []}
                  setTopic={workbench.setTopic}
                  onSubmit={workbench.submitTopic}
                />
                <TopicPanel dashboard={workbench.dashboard} onSelect={workbench.select} onPlan={workbench.plan} />
              </section>
            </>
          ) : null}
          {view === "radar" ? <PlatformPanel snapshot={workbench.platformRadar} /> : null}
          {view === "planning" || view === "writing" ? (
            <ProductionPanel
              dashboard={workbench.dashboard}
              mode={view}
              onComplete={workbench.complete}
              onUpdatePlan={workbench.updatePlan}
              onConfirm={workbench.confirm}
              onRunPlanningAction={workbench.runPlanningAction}
              onCreateDraft={workbench.createDraft}
              onGenerate={workbench.generate}
              onReview={workbench.review}
              onMerge={workbench.merge}
              onSubmit={workbench.submit}
              onSaveDraft={workbench.saveDraftText}
              onUpdateWorkbench={workbench.updateWorkbenchMeta}
            />
          ) : null}
          {view === "runs" ? (
            <>
              <ActionPanel
                dashboard={workbench.dashboard}
                selectedManuscript={workbench.selectedManuscript}
                selectedManuscriptId={workbench.selectedManuscriptId}
                onSelectManuscript={workbench.setSelectedManuscriptId}
                onRunAction={workbench.runWorkbench}
              />
              <RunsPanel
                runs={workbench.runs}
                jobs={workbench.jobs}
                selectedRunId={workbench.selectedRunId}
                runOutput={workbench.runOutput}
                onSelectRun={workbench.selectRunOutput}
                onStopJob={workbench.stopJob}
              />
            </>
          ) : null}
          {view === "reference" ? <ReferencePanel references={workbench.references} /> : null}
        </section>
      </section>
    </main>
  );
}
