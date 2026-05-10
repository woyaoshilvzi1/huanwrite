import {
  type ActionAvailability,
  type Candidate,
  type CreativeLane,
  type Manuscript,
  type ManuscriptWorkbenchMeta,
  type Plan,
  type PlanWorkbenchDetail,
  type Review,
  type SubmissionPackage,
  type Topic,
  type WorkbenchActionId
} from "@huanwrite/shared";
import { AssetCatalog } from "../assets/assetCatalog.js";
import { FileProjectStore } from "../repositories/projectStore.js";
import { buildActionAvailability } from "./actionAvailability.js";

export interface WorkflowDashboard {
  creativeLanes: CreativeLane[];
  topics: DashboardTopic[];
  plans: Plan[];
  planDetails: PlanWorkbenchDetail[];
  manuscripts: DashboardManuscript[];
  candidates: Candidate[];
  reviews: Review[];
  submissions: SubmissionPackage[];
}

export type DashboardTopic = Topic & { nextAction: string };
export type DashboardManuscript = Manuscript & {
  workbench: ManuscriptWorkbenchMeta;
  actionAvailability: Record<WorkbenchActionId, ActionAvailability>;
};

export class DashboardService {
  constructor(private readonly store: FileProjectStore) {}

  read(): WorkflowDashboard {
    const plans = this.store.plans.list();
    const manuscripts = this.store.manuscripts.list();
    const candidates = this.store.candidates.list();
    const reviews = this.store.reviews.list();
    const submissions = this.store.submissions.list();
    return {
      creativeLanes: new AssetCatalog(this.store.root).creativeLanes.list(),
      topics: this.store.topics.list().map((topic) => ({
        ...topic,
        nextAction: nextTopicAction(topic.status)
      })),
      plans,
      planDetails: plans.map((plan) => this.store.planDetails.getOrCreate(plan)),
      manuscripts: manuscripts.map((manuscript) => {
        const plan = plans.find((item) => item.id === manuscript.currentPlanId);
        return {
          ...manuscript,
          workbench: this.store.manuscriptMeta.getOrCreate(manuscript),
          actionAvailability: buildActionAvailability({
            manuscript,
            plan,
            candidates,
            reviews,
            submissions
          })
        };
      }),
      candidates,
      reviews,
      submissions
    };
  }
}

function nextTopicAction(status: Topic["status"]): string {
  if (status === "idea") return "select-topic";
  if (status === "selected") return "create-plan";
  return "review-topic";
}
