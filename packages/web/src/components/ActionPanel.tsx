import { readWorkbenchContract, type WorkbenchActionId } from "@huanwrite/shared";
import { type Dashboard, type DashboardManuscript } from "../dashboardSchema.js";

const contract = readWorkbenchContract();

export function ActionPanel({
  dashboard,
  selectedManuscript,
  selectedManuscriptId,
  onSelectManuscript,
  onRunAction
}: {
  dashboard: Dashboard | null;
  selectedManuscript: DashboardManuscript | undefined;
  selectedManuscriptId: string;
  onSelectManuscript: (manuscriptId: string) => void;
  onRunAction: (action: WorkbenchActionId) => Promise<void>;
}) {
  const manuscripts = dashboard?.manuscripts ?? [];
  return (
    <section className="panel wide" aria-labelledby="action-heading">
      <h2 id="action-heading">动作工作台</h2>
      <label>
        <span>当前稿线</span>
        <select
          aria-label="动作目标稿线"
          value={selectedManuscriptId}
          onChange={(event) => onSelectManuscript(event.target.value)}
        >
          <option value="">请选择稿线</option>
          {manuscripts.map((manuscript) => (
            <option key={manuscript.id} value={manuscript.id}>
              {manuscript.title}
            </option>
          ))}
        </select>
      </label>
      <div className="action-grid">
        {contract.actions.map((item) => (
          <ActionCard
            key={item.id}
            action={item.id}
            label={item.label}
            description={item.description}
            selectedManuscript={selectedManuscript}
            onRunAction={onRunAction}
          />
        ))}
      </div>
    </section>
  );
}

function ActionCard({
  action,
  label,
  description,
  selectedManuscript,
  onRunAction
}: {
  action: WorkbenchActionId;
  label: string;
  description: string;
  selectedManuscript: DashboardManuscript | undefined;
  onRunAction: (action: WorkbenchActionId) => Promise<void>;
}) {
  const reason = readDisabledReason(action, selectedManuscript);
  const disabled = action !== "daily_platform_radar" && !selectedManuscript?.actionAvailability[action]?.enabled;
  return (
    <article className="action-card" aria-label={`动作 ${action}`}>
      <strong>{label}</strong>
      <p>{description}</p>
      <p className="reason">{reason}</p>
      <button type="button" onClick={() => onRunAction(action)} disabled={disabled} title={reason}>
        运行
      </button>
    </article>
  );
}

function readDisabledReason(action: WorkbenchActionId, manuscript: DashboardManuscript | undefined): string {
  if (action === "daily_platform_radar") return "";
  if (!manuscript) return "请选择要运行动作的稿线";
  return manuscript.actionAvailability[action]?.reason ?? "";
}
