import { useState } from "react";
import { type DashboardManuscript } from "../dashboardSchema.js";

export function WorkbenchMetaEditor({
  manuscript,
  onUpdateWorkbench
}: {
  manuscript: DashboardManuscript;
  onUpdateWorkbench: (manuscriptId: string, input: DashboardManuscript["workbench"]) => Promise<void>;
}) {
  const [meta, setMeta] = useState(manuscript.workbench);
  return (
    <section className="meta-editor" aria-label={`质量门 ${manuscript.title}`}>
      <label>
        <span>稿线状态</span>
        <select
          aria-label={`稿线状态 ${manuscript.title}`}
          value={meta.laneStatus}
          onChange={(event) =>
            setMeta({ ...meta, laneStatus: event.target.value as DashboardManuscript["workbench"]["laneStatus"] })
          }
        >
          <option value="empty">empty</option>
          <option value="drafting">drafting</option>
          <option value="reviewing">reviewing</option>
          <option value="ready-for-submission">ready-for-submission</option>
          <option value="submitted">submitted</option>
          <option value="paused">paused</option>
        </select>
      </label>
      <label>
        <span>负责人</span>
        <input
          aria-label={`负责人 ${manuscript.title}`}
          value={meta.owner}
          onChange={(event) => setMeta({ ...meta, owner: event.target.value })}
        />
      </label>
      <label>
        <span>备注</span>
        <textarea
          aria-label={`备注 ${manuscript.title}`}
          value={meta.notes}
          onChange={(event) => setMeta({ ...meta, notes: event.target.value })}
        />
      </label>
      <div className="gate-grid">
        {meta.qualityGates.map((gate) => (
          <fieldset key={gate.id} className="gate-item" aria-label={`质量门 ${gate.label} ${manuscript.id}`}>
            <label>
              <input
                type="checkbox"
                aria-label={`${gate.label} ${manuscript.title}`}
                checked={gate.passed}
                onChange={(event) => updateGate(gate.id, { passed: event.target.checked })}
              />
              <span>{gate.label}</span>
            </label>
            <label>
              <span>负责人</span>
              <input
                aria-label={`${gate.label} 负责人 ${manuscript.title}`}
                value={gate.owner}
                onChange={(event) => updateGate(gate.id, { owner: event.target.value })}
              />
            </label>
            <label>
              <span>备注</span>
              <input
                aria-label={`${gate.label} 备注 ${manuscript.title}`}
                value={gate.note}
                onChange={(event) => updateGate(gate.id, { note: event.target.value })}
              />
            </label>
          </fieldset>
        ))}
      </div>
      <button type="button" onClick={() => onUpdateWorkbench(manuscript.id, meta)}>
        保存看板信息
      </button>
    </section>
  );

  function updateGate(gateId: string, patch: Partial<DashboardManuscript["workbench"]["qualityGates"][number]>): void {
    setMeta({
      ...meta,
      qualityGates: meta.qualityGates.map((item) => (item.id === gateId ? { ...item, ...patch } : item))
    });
  }
}
