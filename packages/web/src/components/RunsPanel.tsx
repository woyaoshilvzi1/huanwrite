import { type ActionRunSummary, type BackgroundJobSummary } from "../api.js";

export function RunsPanel({
  runs,
  jobs,
  selectedRunId,
  runOutput,
  onSelectRun,
  onStopJob
}: {
  runs: ActionRunSummary[];
  jobs: BackgroundJobSummary[];
  selectedRunId: string;
  runOutput: string;
  onSelectRun: (runId: string) => Promise<void>;
  onStopJob: (jobId: string) => Promise<void>;
}) {
  return (
    <section className="panel wide" aria-labelledby="runs-heading">
      <h2 id="runs-heading">输出与任务</h2>
      <div className="two-column">
        <RunList title="运行记录" items={runs} selectedRunId={selectedRunId} onSelectRun={onSelectRun} />
        <JobList items={jobs} onStopJob={onStopJob} />
      </div>
      <section className="run-output-viewer" aria-label="运行输出正文">
        <h3>运行输出正文</h3>
        <pre>{runOutput || "选择一条运行记录查看输出正文。"}</pre>
      </section>
    </section>
  );
}

function RunList({
  title,
  items,
  selectedRunId,
  onSelectRun
}: {
  title: string;
  items: ActionRunSummary[];
  selectedRunId: string;
  onSelectRun: (runId: string) => Promise<void>;
}) {
  return (
    <section className="lane" aria-label={title}>
      <h3>{title}</h3>
      {items.length ? (
        items.map((item) => (
          <article className="lane-item" key={item.id}>
            <strong>{item.action}</strong>
            <p>run：{item.id}</p>
            <p>状态：{item.status}</p>
            <p>prompt：{item.promptRegistryKey} · {item.promptHash}</p>
            <p>模型：{item.model} · harness：{item.harness.grade}</p>
            <p>{item.outputPath}</p>
            <button type="button" aria-pressed={selectedRunId === item.id} onClick={() => onSelectRun(item.id)}>
              查看输出
            </button>
          </article>
        ))
      ) : (
        <p>暂无记录。</p>
      )}
    </section>
  );
}

function JobList({ items, onStopJob }: { items: BackgroundJobSummary[]; onStopJob: (jobId: string) => Promise<void> }) {
  return (
    <section className="lane" aria-label="任务记录">
      <h3>任务记录</h3>
      {items.length ? (
        items.map((item) => (
          <article className="lane-item" key={item.id}>
            <strong>{item.action}</strong>
            <p>任务：{item.id}</p>
            <p>状态：{item.status} · 进度：{item.progress}% · 阶段：{item.stage}</p>
            {item.runId ? <p>run：{item.runId}</p> : null}
            <ul className="compact-list" aria-label={`任务日志 ${item.id}`}>
              {item.logs.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button type="button" onClick={() => onStopJob(item.id)}>
              停止
            </button>
          </article>
        ))
      ) : (
        <p>暂无任务。</p>
      )}
    </section>
  );
}
