import { type Dashboard, type DashboardManuscript } from "../dashboardSchema.js";
import { CandidateList } from "./CandidateList.js";
import { ManuscriptList } from "./ManuscriptList.js";
import { PlanList } from "./PlanList.js";
import { type PlanEditorPayload } from "./planEditorTypes.js";
import { ReviewList } from "./ReviewList.js";
import { type WorkbenchActionId } from "@huanwrite/shared";

export function ProductionPanel({
  dashboard,
  onComplete,
  onUpdatePlan,
  onConfirm,
  onRunPlanningAction,
  onCreateDraft,
  onGenerate,
  onReview,
  onMerge,
  onSubmit,
  onSaveDraft,
  onUpdateWorkbench
}: {
  dashboard: Dashboard | null;
  onComplete: (planId: string) => Promise<void>;
  onUpdatePlan: (planId: string, input: PlanEditorPayload) => Promise<void>;
  onConfirm: (planId: string) => Promise<void>;
  onRunPlanningAction: (planId: string, action: WorkbenchActionId) => Promise<void>;
  onCreateDraft: (topicId: string, planId: string, title: string) => Promise<void>;
  onGenerate: (manuscriptId: string, planId: string) => Promise<void>;
  onReview: (candidateId: string) => Promise<void>;
  onMerge: (candidateId: string) => Promise<void>;
  onSubmit: (manuscriptId: string) => Promise<void>;
  onSaveDraft: (manuscriptId: string, text: string) => Promise<void>;
  onUpdateWorkbench: (manuscriptId: string, input: DashboardManuscript["workbench"]) => Promise<void>;
}) {
  if (!dashboard) {
    return (
      <section className="panel wide" aria-labelledby="production-heading">
        <h2 id="production-heading">生产链路</h2>
        <p>加载中...</p>
      </section>
    );
  }

  return (
    <section className="panel wide" aria-labelledby="production-heading">
      <h2 id="production-heading">生产链路</h2>
      <PlanList
        topics={dashboard.topics}
        plans={dashboard.plans}
        planDetails={dashboard.planDetails}
        manuscripts={dashboard.manuscripts}
        onComplete={onComplete}
        onUpdatePlan={onUpdatePlan}
        onConfirm={onConfirm}
        onRunPlanningAction={onRunPlanningAction}
        onCreateDraft={onCreateDraft}
      />
      <ManuscriptList
        manuscripts={dashboard.manuscripts}
        onGenerate={onGenerate}
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
        onUpdateWorkbench={onUpdateWorkbench}
      />
      <CandidateList candidates={dashboard.candidates} onReview={onReview} onMerge={onMerge} />
      <ReviewList reviews={dashboard.reviews} />
    </section>
  );
}
