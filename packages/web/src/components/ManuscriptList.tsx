import { type DashboardManuscript } from "../dashboardSchema.js";
import { ManuscriptEditor } from "./ManuscriptEditor.js";
import { WorkbenchMetaEditor } from "./WorkbenchMetaEditor.js";

export function ManuscriptList({
  manuscripts,
  onGenerate,
  onSubmit,
  onSaveDraft,
  onUpdateWorkbench
}: {
  manuscripts: DashboardManuscript[];
  onGenerate: (manuscriptId: string, planId: string) => Promise<void>;
  onSubmit: (manuscriptId: string) => Promise<void>;
  onSaveDraft: (manuscriptId: string, text: string) => Promise<void>;
  onUpdateWorkbench: (manuscriptId: string, input: DashboardManuscript["workbench"]) => Promise<void>;
}) {
  if (manuscripts.length === 0) return <p>正文区暂无工程。</p>;

  return (
    <section className="writing-workbench" aria-label="正文操作">
      <aside className="writing-index" aria-label="写稿稿线列表">
        <h3>正文稿线</h3>
        {manuscripts.map((item) => (
          <a key={item.id} href={`#manuscript-${item.id}`}>
            <strong>{item.title}</strong>
            <span>{item.workbench.laneStatus}</span>
            <small>{item.charCount} 字 · {item.workbench.owner || "未分配"}</small>
          </a>
        ))}
      </aside>
      {manuscripts.map((item) => (
        <article key={item.id} id={`manuscript-${item.id}`} className="writing-card" aria-label={`正文 ${item.id}`}>
          <header className="writing-card-header">
            <div>
              <strong>{item.title}</strong>
              <p>状态：{item.status} · 字数：{item.charCount} · 来源：{item.latestChangeSource}</p>
            </div>
            {item.workbench.laneProfile ? <span>{item.workbench.laneProfile.laneTitle}</span> : null}
          </header>
          <div className="writing-card-grid">
            <ManuscriptEditor manuscript={item} onSaveDraft={onSaveDraft} />
            <aside className="writing-sidecar" aria-label={`正文侧栏 ${item.title}`}>
              <WorkbenchMetaEditor manuscript={item} onUpdateWorkbench={onUpdateWorkbench} />
              <section className="writer-action-box">
                <h4>正文动作</h4>
                <div className="actions vertical-actions">
                  <button type="button" onClick={() => onGenerate(item.id, item.currentPlanId)}>
                    生成候选
                  </button>
                  <button type="button" onClick={() => onSubmit(item.id)} disabled={item.status !== "drafting"}>
                    生成投稿包
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </article>
      ))}
    </section>
  );
}
