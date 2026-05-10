import { expect, type Page, test } from "@playwright/test";
import { workbenchActionIds, type WorkbenchActionId } from "../../packages/shared/src/workbenchContract.js";
import { z } from "zod";
import {
  expectActionRunObservation,
  expectApiSurface,
  expectEmptyOverwriteBlocked,
  expectJobStatusAndStop,
  readActionRunIds,
  readActionRuns,
  readDashboard,
  readRunOutput,
  waitForJobDone
} from "./workbenchApi.js";

const jobsPayloadSchema = z.object({
  jobs: z.array(z.object({ id: z.string(), action: z.string(), runId: z.string().optional(), status: z.string() }))
});

test("React workbench supports the full production flow", async ({ page }) => {
  const title = `E2E 全链路 ${Date.now()}`;
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Huanwrite 工作台" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "多稿线看板" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "生产链路" })).toBeVisible();
  await expect(page.getByText("不可推断项")).toBeVisible();
  await expectApiSurface(page);

  await createNovelFromUi(page, title);
  await editPlanningAndWorkbenchMeta(page, title);
  await runProductionChain(page, title);
  const dashboard = await readDashboard(page);
  const manuscript = findManuscriptByTopicTitle(dashboard.manuscripts, title);
  await expectEmptyOverwriteBlocked(page, manuscript.id);
  await verifyExplicitActionTarget(page, title);
  await runAllWorkbenchActions(page);
  await expectCharts(page);
  await expect(page.getByLabel("平台证据")).toContainText("当前工作台投稿包");
  await expect(page.getByLabel("稿线匹配")).toContainText(title);
  await expectPlanningActions(page, title);
});

async function createNovelFromUi(page: Page, title: string): Promise<void> {
  await page.getByLabel("题材标题").fill(title);
  await page.getByRole("button", { name: "创建题材" }).click();
  await expectNotice(page, "题材已创建");
  const topicItem = page.getByRole("listitem").filter({ hasText: title }).filter({ hasText: "状态：idea" });
  await topicItem.getByRole("button", { name: "选中" }).click();
  await expectNotice(page, "题材已选中");
  await page.getByRole("listitem").filter({ hasText: title }).filter({ hasText: "状态：selected" }).getByRole("button", { name: "创建规划" }).click();
  await expectNotice(page, "规划已创建");
}

async function editPlanningAndWorkbenchMeta(page: Page, title: string): Promise<void> {
  const planId = await readPlanIdForTopic(page, title);
  const planItem = page.getByLabel(`规划 ${planId}`);
  await planItem.getByRole("button", { name: "补齐规划" }).click();
  await expectNotice(page, "规划已补齐");
  await planItem.getByRole("button", { name: "添加章节卡" }).click();
  await planItem.getByLabel("第1章节目标").fill(`真实 E2E 章节目标 ${Date.now()}`);
  await planItem.getByLabel("第1目标字数").fill("2400");
  await planItem.getByLabel("第1出场角色").fill("主角、父亲、贷款经理");
  await planItem.getByLabel("第3章节标题").fill("E2E 新增章节");
  await planItem.getByLabel("第3章节摘要").fill("主角把证据带到公开场合，让压迫者被迫解释。");
  await planItem.getByLabel("第3目标字数").fill("2600");
  await planItem.getByLabel("第3场景数").fill("3");
  await planItem.getByLabel("第3出场角色").fill("主角、压迫者、真正受益人");
  await planItem.getByLabel("第3章节目标").fill("验证结构化规划新增章节能保存");
  await planItem.getByLabel("第3主角目标").fill("把转账链路公开给围观者");
  await planItem.getByLabel("第3章节冲突").fill("旧压力升级为公开对抗");
  await planItem.getByLabel("第3章节变化").fill("主角拿到关键证据");
  await planItem.getByLabel("第3信息变化转折").fill("真正受益人被一条聊天记录暴露");
  await planItem.getByLabel("第3章节钩子").fill("隐藏受益人露出破绽");
  await planItem.getByLabel("第3结尾钩子伏笔").fill("下一章进入公开视频反击");
  await planItem.getByLabel("第3OOC风险").fill("主角不能凭空知道幕后人，只能靠聊天记录");
  await planItem.getByLabel("第3人工备注").fill("用动作和对白推动，不写情绪总结");
  await planItem.getByLabel(/禁用句式/).fill("空气仿佛凝固\n眼眶瞬间红了");
  await planItem.getByLabel(/疲劳词/).fill("复杂\n崩溃\n沉默");
  await planItem.getByLabel(/技法卡/).fill("证据物件推动场景\n每章结尾留下新威胁");
  await planItem.getByRole("button", { name: "保存结构化规划" }).click();
  await expectNotice(page, "规划已保存，等待重新确认");
  await expectStructuredPlanSaved(page, title);
  await planItem.getByRole("button", { name: "确认规划" }).click();
  await expect(planItem.getByText("状态：confirmed")).toBeVisible();
  await expect(planItem.getByRole("button", { name: "创建正文" })).toBeEnabled();
  await planItem.getByRole("button", { name: "创建正文" }).click();
  await expectNotice(page, "正文工程已创建");

  const manuscript = findManuscriptByTopicTitle((await readDashboard(page)).manuscripts, title);
  const manuscriptItem = page.getByLabel(`正文 ${manuscript.id}`);
  await manuscriptItem.getByRole("textbox", { name: `负责人 ${title} 正文`, exact: true }).fill("E2E 编辑");
  await manuscriptItem.getByRole("textbox", { name: `备注 ${title} 正文`, exact: true }).fill("真实浏览器操作写入的备注");
  await manuscriptItem.getByRole("checkbox", { name: `规划已确认 ${title} 正文`, exact: true }).check();
  await manuscriptItem.getByRole("textbox", { name: `规划已确认 负责人 ${title} 正文`, exact: true }).fill("E2E 主编");
  await manuscriptItem.getByRole("textbox", { name: `规划已确认 备注 ${title} 正文`, exact: true }).fill("确认规划质量门已经人工复核");
  await manuscriptItem.getByRole("button", { name: "保存看板信息" }).click();
  await expectNotice(page, "看板信息已保存");

  await page.getByLabel("看板搜索").fill(title);
  await expect(page.getByLabel("状态列 empty").filter({ hasText: title })).toBeVisible();
  await page.getByLabel(`稿线卡片 ${title} 正文`).dragTo(page.getByLabel("状态列 drafting"));
  await expect(page.getByLabel("状态列 drafting").filter({ hasText: title })).toBeVisible();
  const dashboard = await readDashboard(page);
  const savedManuscript = findManuscriptByTopicTitle(dashboard.manuscripts, title);
  expect(savedManuscript.workbench.laneStatus).toBe("drafting");
  expect(savedManuscript.workbench.owner).toBe("E2E 编辑");
  expect(savedManuscript.workbench.notes).toContain("真实浏览器操作");
  const planningGate = savedManuscript.workbench.qualityGates.find((gate) => gate.id === "planning-confirmed");
  expect(planningGate?.passed).toBe(true);
  expect(planningGate?.owner).toBe("E2E 主编");
  expect(planningGate?.note).toContain("人工复核");
}

async function expectStructuredPlanSaved(page: Page, title: string): Promise<void> {
  const dashboard = await readDashboard(page);
  const topic = dashboard.topics.find((item) => item.title === title);
  if (!topic) throw new Error(`topic not found: ${title}`);
  const plan = dashboard.plans.find((item) => item.topicId === topic.id);
  if (!plan) throw new Error(`plan not found for topic: ${title}`);
  expect(plan.structureCards).toHaveLength(3);
  expect(plan.structureCards[2]?.title).toBe("E2E 新增章节");
  expect(plan.structureCards[2]?.targetWords).toBe("2600");
  expect(plan.structureCards[2]?.characters).toContain("真正受益人");
  expect(plan.structureCards[2]?.protagonistGoal).toContain("转账链路");
  expect(plan.structureCards[2]?.turningPoint).toContain("聊天记录");
  expect(plan.structureCards[2]?.oocRisk).toContain("凭空知道");
  expect(plan.bannedPhrases).toContain("眼眶瞬间红了");
  expect(plan.fatigueWords).toContain("沉默");
  const detail = dashboard.planDetails.find((item) => item.planId === plan.id);
  expect(detail?.craftCards).toContain("每章结尾留下新威胁");
}

async function runProductionChain(page: Page, title: string): Promise<void> {
  const manuscript = findManuscriptByTopicTitle((await readDashboard(page)).manuscripts, title);
  const manuscriptItem = page.getByLabel(`正文 ${manuscript.id}`);
  await manuscriptItem.getByRole("button", { name: "生成候选" }).click();
  await expectNotice(page, "正文候选已生成");
  const candidateItem = page.getByLabel("候选操作").locator("article").filter({ hasText: title }).filter({ hasText: "状态：generated" });
  await candidateItem.getByRole("button", { name: "审稿" }).click();
  await expectNotice(page, "候选已审稿");
  const approvedCandidateItem = page.getByLabel("候选操作").locator("article").filter({ hasText: title }).filter({ hasText: "状态：approved" });
  await approvedCandidateItem.getByRole("button", { name: "合并" }).click();
  await expectNotice(page, "候选已合并");
  await manuscriptItem.getByRole("button", { name: "生成投稿包" }).click();
  await expectNotice(page, "投稿包已生成");
}

async function runAllWorkbenchActions(page: Page): Promise<void> {
  const dashboardBeforeActions = await readDashboard(page);
  const candidatesBeforeActions = dashboardBeforeActions.candidates.length;
  const reviewsBeforeActions = dashboardBeforeActions.reviews.length;
  const submissionsBeforeActions = dashboardBeforeActions.submissions.length;

  for (const action of workbenchActionIds) {
    const newRunId = await runWorkbenchActionLikeUser(page, action);
    await expect(page.getByLabel("运行记录").locator("article").filter({ hasText: newRunId })).toBeVisible();
    await expect(page.getByLabel("运行记录").locator("article").filter({ hasText: newRunId })).toContainText("harness：PASS");
    const output = await readRunOutput(page, newRunId);
    expect(output).toContain(`# ${action}`);
    await page.getByLabel("运行记录").locator("article").filter({ hasText: newRunId }).getByRole("button", { name: "查看输出" }).click();
    await expect(page.getByLabel("运行输出正文")).toContainText(`# ${action}`);
    await expect(page.getByLabel("运行输出正文")).toContainText("模型执行结果");
    await expectActionRunObservation(page, newRunId);
    const jobId = await jobIdForRun(page, newRunId);
    await expect(page.getByLabel("任务记录").locator("article").filter({ hasText: jobId })).toContainText("run 已完成");
    await expectJobStatusAndStop(page, jobId);
  }

  const dashboardAfterActions = await readDashboard(page);
  expect(dashboardAfterActions.candidates.length).toBeGreaterThanOrEqual(candidatesBeforeActions + 3);
  expect(dashboardAfterActions.reviews.length).toBeGreaterThanOrEqual(reviewsBeforeActions + 1);
  expect(dashboardAfterActions.submissions.length).toBeGreaterThanOrEqual(submissionsBeforeActions + 1);
}

async function expectPlanningActions(page: Page, title: string): Promise<void> {
  const planId = await readPlanIdForTopic(page, title);
  const planItem = page.getByLabel(`规划 ${planId}`);
  for (const action of ["重新规划", "润色规划", "头脑风暴"]) {
    await planItem.getByRole("button", { name: action }).click();
    await expect(page.getByLabel("操作结果")).toContainText("规划动作已开始");
  }
}

async function verifyExplicitActionTarget(page: Page, title: string): Promise<void> {
  await page.getByLabel("动作目标稿线").selectOption({ label: `${title} 正文` });
  const beforeRuns = new Set((await readActionRuns(page)).map((run) => run.id));
  await page.getByLabel("动作 audit_story_state").getByRole("button", { name: "运行" }).click();
  await expectNotice(page, "动作已开始：audit_story_state");
  const jobId = await newestJobForAction(page, "audit_story_state");
  await waitForJobDone(page, jobId);
  const dashboard = await readDashboard(page);
  const manuscript = findManuscriptByTopicTitle(dashboard.manuscripts, title);
  await expect
    .poll(async () => {
      const newRun = (await readActionRuns(page)).find((run) => !beforeRuns.has(run.id) && run.action === "audit_story_state");
      return newRun?.manuscriptId;
    })
    .toBe(manuscript.id);
}

async function runWorkbenchActionLikeUser(page: Page, action: WorkbenchActionId): Promise<string> {
  const beforeRunIds = new Set(await readActionRunIds(page, action));
  await page.getByLabel(`动作 ${action}`).getByRole("button", { name: "运行" }).click();
  await expectNotice(page, `动作已开始：${action}`);
  const jobId = await newestJobForAction(page, action);
  await waitForJobDone(page, jobId);
  let newRunId = "";
  await expect
    .poll(async () => {
      const ids = await readActionRunIds(page, action);
      const created = ids.find((id) => !beforeRunIds.has(id));
      if (created) newRunId = created;
      return Boolean(created);
    })
    .toBe(true);
  return newRunId;
}

async function newestJobForAction(page: Page, action: WorkbenchActionId): Promise<string> {
  const response = await page.request.get("/api/jobs");
  await expect(response).toBeOK();
  const payload = jobsPayloadSchema.parse(await response.json());
  const job = [...payload.jobs].reverse().find((item) => item.action === action);
  if (!job) throw new Error(`job not found for action ${action}`);
  return job.id;
}

async function expectNotice(page: Page, text: string): Promise<void> {
  await expect(page.getByLabel("操作结果")).toHaveText(text);
}

function findManuscriptByTopicTitle<T extends { title: string }>(manuscripts: T[], topicTitle: string): T {
  const manuscript = manuscripts.find((item) => item.title.includes(topicTitle));
  if (!manuscript) throw new Error(`manuscript not found for topic ${topicTitle}`);
  return manuscript;
}

async function readPlanIdForTopic(page: Page, title: string): Promise<string> {
  const dashboard = await readDashboard(page);
  const topic = dashboard.topics.find((item) => item.title === title);
  if (!topic) throw new Error(`topic not found: ${title}`);
  const plan = dashboard.plans.find((item) => item.topicId === topic.id);
  if (!plan) throw new Error(`plan not found for topic: ${title}`);
  return plan.id;
}

async function jobIdForRun(page: Page, runId: string): Promise<string> {
  const response = await page.request.get("/api/jobs");
  await expect(response).toBeOK();
  const payload = jobsPayloadSchema.parse(await response.json());
  const job = payload.jobs.find((item) => item.runId === runId);
  if (!job) throw new Error(`job not found for run ${runId}`);
  return job.id;
}

async function expectCharts(page: Page): Promise<void> {
  for (const label of ["动作运行图", "生产状态图", "生产漏斗图"]) {
    const chart = page.getByLabel(label);
    await expect(chart).toBeVisible();
    const rendered = await chart.locator("canvas").evaluate((canvas) => {
      if (!(canvas instanceof HTMLCanvasElement)) return false;
      return canvas.width > 0 && canvas.height > 0;
    });
    expect(rendered).toBe(true);
  }
}
