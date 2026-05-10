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
    <section className="lane" aria-label="正文操作">
      <h3>正文</h3>
      {manuscripts.map((item) => (
        <article key={item.id} className="lane-item" aria-label={`正文 ${item.id}`}>
          <strong>{item.title}</strong>
          <p>状态：{item.status} · 字数：{item.charCount}</p>
          <WorkbenchMetaEditor manuscript={item} onUpdateWorkbench={onUpdateWorkbench} />
          <ManuscriptEditor manuscript={item} onSaveDraft={onSaveDraft} />
          <div className="actions">
            <button type="button" onClick={() => onGenerate(item.id, item.currentPlanId)}>
              生成候选
            </button>
            <button type="button" onClick={() => onSubmit(item.id)} disabled={item.status !== "drafting"}>
              生成投稿包
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
