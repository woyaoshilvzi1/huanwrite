import { ensureProjectStructure } from "../projectStructure.js";
import { ProjectPaths } from "../storage/projectPaths.js";
import { HuanwriteDatabase } from "../storage/sqliteDatabase.js";
import { TextStorage } from "../storage/textStorage.js";
import { ActionRunRepository } from "./actionRunRepository.js";
import { BackgroundJobRepository } from "./backgroundJobRepository.js";
import { CandidateRepository } from "./candidateRepository.js";
import { ManuscriptRepository } from "./manuscriptRepository.js";
import { ManuscriptWorkbenchMetaRepository } from "./manuscriptWorkbenchMetaRepository.js";
import { PlanRepository } from "./planRepository.js";
import { PlanWorkbenchDetailRepository } from "./planWorkbenchDetailRepository.js";
import { ReviewRepository } from "./reviewRepository.js";
import { SubmissionRepository } from "./submissionRepository.js";
import { TopicRepository } from "./topicRepository.js";
import { UiEventRepository } from "./uiEventRepository.js";

export class FileProjectStore {
  readonly paths: ProjectPaths;
  readonly text: TextStorage;
  readonly topics: TopicRepository;
  readonly plans: PlanRepository;
  readonly planDetails: PlanWorkbenchDetailRepository;
  readonly manuscripts: ManuscriptRepository;
  readonly manuscriptMeta: ManuscriptWorkbenchMetaRepository;
  readonly candidates: CandidateRepository;
  readonly reviews: ReviewRepository;
  readonly submissions: SubmissionRepository;
  readonly actionRuns: ActionRunRepository;
  readonly backgroundJobs: BackgroundJobRepository;
  readonly uiEvents: UiEventRepository;
  private readonly database: HuanwriteDatabase;

  constructor(readonly root: string) {
    ensureProjectStructure(root);
    this.paths = new ProjectPaths(root);
    this.database = new HuanwriteDatabase(this.paths.database());
    const database = this.database.connection;
    const text = new TextStorage();
    this.text = text;
    this.topics = new TopicRepository(database);
    this.plans = new PlanRepository(database);
    this.planDetails = new PlanWorkbenchDetailRepository(database);
    this.manuscripts = new ManuscriptRepository(this.paths, database, text);
    this.manuscriptMeta = new ManuscriptWorkbenchMetaRepository(database);
    this.candidates = new CandidateRepository(this.paths, database, text);
    this.reviews = new ReviewRepository(database);
    this.submissions = new SubmissionRepository(database);
    this.actionRuns = new ActionRunRepository(database);
    this.backgroundJobs = new BackgroundJobRepository(database);
    this.uiEvents = new UiEventRepository(database);
  }

  close(): void {
    this.database.connection.close();
  }
}
