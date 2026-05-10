import { ProductionPanel } from "./components/ProductionPanel.js";
import { TopicForm } from "./components/TopicForm.js";
import { TopicPanel } from "./components/TopicPanel.js";
import { ActionPanel, BoardPanel, OverviewPanel, PlatformPanel, ReferencePanel, RunsPanel } from "./components/WorkbenchPanels.js";
import { useWorkbenchController } from "./useWorkbenchController.js";
import "./styles/index.css";

export function App() {
  const workbench = useWorkbenchController();

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Novel Production Workbench</p>
          <h1>Huanwrite 工作台</h1>
          <p>选题、规划、正文、候选、审稿、投稿和短剧改编在这里统一操作。</p>
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

      <section className="layout" aria-label="工作台">
        <OverviewPanel dashboard={workbench.dashboard} runs={workbench.runs} />
        <BoardPanel dashboard={workbench.dashboard} onUpdateWorkbench={workbench.updateWorkbenchMeta} />
        <TopicForm topic={workbench.topic} setTopic={workbench.setTopic} onSubmit={workbench.submitTopic} />
        <TopicPanel dashboard={workbench.dashboard} onSelect={workbench.select} onPlan={workbench.plan} />
        <ProductionPanel
          dashboard={workbench.dashboard}
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
        <PlatformPanel snapshot={workbench.platformRadar} />
        <ReferencePanel references={workbench.references} />
      </section>
    </main>
  );
}
