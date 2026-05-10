import {
  type DashboardManuscript,
  type DashboardPlan,
  type DashboardPlanDetail,
  type DashboardTopic
} from "../dashboardSchema.js";
import { PlanEditor } from "./PlanEditor.js";
import { type PlanEditorPayload } from "./planEditorTypes.js";
import { type WorkbenchActionId } from "@huanwrite/shared";

export function PlanList({
  topics,
  plans,
  planDetails,
  manuscripts,
  onComplete,
  onUpdatePlan,
  onConfirm,
  onRunPlanningAction,
  onCreateDraft
}: {
  topics: DashboardTopic[];
  plans: DashboardPlan[];
  planDetails: DashboardPlanDetail[];
  manuscripts: DashboardManuscript[];
  onComplete: (planId: string) => Promise<void>;
  onUpdatePlan: (planId: string, input: PlanEditorPayload) => Promise<void>;
  onConfirm: (planId: string) => Promise<void>;
  onRunPlanningAction: (planId: string, action: WorkbenchActionId) => Promise<void>;
  onCreateDraft: (topicId: string, planId: string, title: string) => Promise<void>;
}) {
  if (plans.length === 0) return <p>规划区等待创建规划。</p>;

  return (
    <section className="lane" aria-label="规划操作">
      <h3>规划</h3>
      {plans.map((item) => {
        const topic = topics.find((topicItem) => topicItem.id === item.topicId);
        const title = `${topic?.title ?? item.storyPromise} 正文`;
        const existing = manuscripts.find((manuscript) => manuscript.currentPlanId === item.id);
        return (
          <article key={item.id} className="lane-item" aria-label={`规划 ${item.id}`}>
            <strong>{topic?.title ?? item.storyPromise}</strong>
            <p>状态：{item.status}</p>
            <PlanEditor plan={item} detail={planDetails.find((detail) => detail.planId === item.id)} onUpdatePlan={onUpdatePlan} />
            <div className="actions">
              <button type="button" onClick={() => onComplete(item.id)} disabled={item.status !== "draft"}>
                补齐规划
              </button>
              <button type="button" onClick={() => onConfirm(item.id)} disabled={item.status !== "ready-for-review" && item.status !== "dirty"}>
                确认规划
              </button>
              <button type="button" onClick={() => onRunPlanningAction(item.id, "replan_story")}>
                重新规划
              </button>
              <button type="button" onClick={() => onRunPlanningAction(item.id, "polish_plan")}>
                润色规划
              </button>
              <button type="button" onClick={() => onRunPlanningAction(item.id, "brainstorm_plan")}>
                头脑风暴
              </button>
              <button
                type="button"
                onClick={() => onCreateDraft(item.topicId, item.id, title)}
                disabled={item.status !== "confirmed" || Boolean(existing)}
              >
                创建正文
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
