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
    <section className="planning-workbench" aria-label="规划操作">
      <aside className="planning-index" aria-label="规划稿线列表">
        <h3>稿线规划</h3>
        {plans.map((item) => {
          const topic = topics.find((topicItem) => topicItem.id === item.topicId);
          return (
            <a key={item.id} href={`#plan-${item.id}`}>
              <strong>{topic?.title ?? item.storyPromise}</strong>
              <span>{item.status}</span>
              <small>{item.targetPlatform} · {item.structureCards.length} 章</small>
            </a>
          );
        })}
      </aside>
      {plans.map((item) => {
        const topic = topics.find((topicItem) => topicItem.id === item.topicId);
        const title = `${topic?.title ?? item.storyPromise} 正文`;
        const existing = manuscripts.find((manuscript) => manuscript.currentPlanId === item.id);
        return (
          <article key={item.id} id={`plan-${item.id}`} className="planning-card" aria-label={`规划 ${item.id}`}>
            <header className="planning-card-header">
              <div>
                <strong>{topic?.title ?? item.storyPromise}</strong>
                <p>状态：{item.status}</p>
              </div>
              <span>{item.manuscriptShape}</span>
            </header>
            <div className="planning-card-grid">
              <aside className="chapter-outline" aria-label={`章节大纲 ${item.id}`}>
                <h4>章节卡</h4>
                {item.structureCards.map((card, index) => (
                  <a key={`${item.id}-${card.title}-${index}`} href={`#plan-${item.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{card.title || `第 ${index + 1} 章`}</strong>
                    <small>{card.targetWords || "待填字数"} · {card.sceneCount || "待填场景"}</small>
                  </a>
                ))}
              </aside>
              <PlanEditor plan={item} detail={planDetails.find((detail) => detail.planId === item.id)} onUpdatePlan={onUpdatePlan} />
              <aside className="planning-sidecar" aria-label={`规划动作 ${item.id}`}>
                <section>
                  <h4>硬闸</h4>
                  <p>规划确认后才允许创建正文；修改规划后需要重新确认。</p>
                  <p>已有关联正文：{existing ? "是" : "否"}</p>
                </section>
                <section>
                  <h4>规划动作</h4>
                  <div className="actions vertical-actions">
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
                </section>
              </aside>
            </div>
          </article>
        );
      })}
    </section>
  );
}
