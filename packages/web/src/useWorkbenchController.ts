import { type FormEvent, useEffect, useMemo, useState } from "react";
import { type WorkbenchActionId } from "@huanwrite/shared";
import {
  appendEvent,
  buildSubmission,
  completePlan,
  confirmPlan,
  createManuscript,
  createPlan,
  createTopic,
  fetchRunOutput,
  mergeCandidate,
  reviewCandidate,
  runAction,
  runWorkbenchAction,
  saveManuscriptText,
  selectTopic,
  stopAction,
  updatePlan as updatePlanRequest,
  updateManuscriptWorkbench,
} from "./api.js";
import { type Dashboard } from "./dashboardSchema.js";
import { defaultActionType, defaultSelectionReason, defaultTopic } from "./defaultTopic.js";
import { type TopicInput } from "./topicInput.js";
import { useWorkbenchData } from "./useWorkbenchData.js";

export interface WorkbenchController {
  dashboard: Dashboard | null;
  topic: TopicInput;
  message: string;
  error: string;
  runs: ReturnType<typeof useWorkbenchData>["runs"];
  jobs: ReturnType<typeof useWorkbenchData>["jobs"];
  references: ReturnType<typeof useWorkbenchData>["references"];
  platformRadar: ReturnType<typeof useWorkbenchData>["platformRadar"];
  selectedManuscriptId: string;
  selectedManuscript: Dashboard["manuscripts"][number] | undefined;
  setTopic: (topic: TopicInput) => void;
  setSelectedManuscriptId: (manuscriptId: string) => void;
  submitTopic: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  select: (topicId: string) => Promise<void>;
  plan: (topicId: string) => Promise<void>;
  complete: (planId: string) => Promise<void>;
  updatePlan: (planId: string, input: Parameters<typeof updatePlanRequest>[1]) => Promise<void>;
  confirm: (planId: string) => Promise<void>;
  runPlanningAction: (planId: string, action: WorkbenchActionId) => Promise<void>;
  createDraft: (topicId: string, planId: string, title: string) => Promise<void>;
  generate: (manuscriptId: string, planId: string) => Promise<void>;
  review: (candidateId: string) => Promise<void>;
  merge: (candidateId: string) => Promise<void>;
  submit: (manuscriptId: string) => Promise<void>;
  saveDraftText: (manuscriptId: string, text: string) => Promise<void>;
  updateWorkbenchMeta: (manuscriptId: string, input: Dashboard["manuscripts"][number]["workbench"]) => Promise<void>;
  runWorkbench: (action: WorkbenchActionId) => Promise<void>;
  stopJob: (jobId: string) => Promise<void>;
  selectedRunId: string;
  runOutput: string;
  selectRunOutput: (runId: string) => Promise<void>;
}

export function useWorkbenchController(): WorkbenchController {
  const data = useWorkbenchData();
  const [topic, setTopic] = useState<TopicInput>(defaultTopic);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRunId, setSelectedRunId] = useState("");
  const [runOutput, setRunOutput] = useState("");

  const manuscripts = data.dashboard?.manuscripts ?? [];
  const selectedManuscript = useMemo(
    () => manuscripts.find((manuscript) => manuscript.id === selectedManuscriptId),
    [manuscripts, selectedManuscriptId]
  );

  useEffect(() => {
    if (!selectedManuscriptId && manuscripts.length === 1) {
      setSelectedManuscriptId(manuscripts[0].id);
      return;
    }
    if (selectedManuscriptId && !selectedManuscript) {
      setSelectedManuscriptId("");
    }
  }, [manuscripts, selectedManuscript, selectedManuscriptId]);

  async function runWithMessage(nextMessage: string, action: () => Promise<void>) {
    setError("");
    await action();
    setMessage(nextMessage);
    await data.refresh();
  }

  async function submitTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runWithMessage("题材已创建", async () => createTopic(topic));
  }

  async function select(topicId: string) {
    await runWithMessage("题材已选中", async () => selectTopic(topicId, defaultSelectionReason));
  }

  async function plan(topicId: string) {
    await runWithMessage("规划已创建", async () => createPlan(topicId));
  }

  async function complete(planId: string) {
    await runWithMessage("规划已补齐", async () => completePlan(planId));
  }

  async function updatePlan(planId: string, input: Parameters<typeof updatePlanRequest>[1]) {
    await runWithMessage("规划已保存，等待重新确认", async () => updatePlanRequest(planId, input));
  }

  async function confirm(planId: string) {
    await runWithMessage("规划已确认", async () => confirmPlan(planId));
  }

  async function runPlanningAction(planId: string, action: WorkbenchActionId) {
    const traceId = `ui-${Date.now()}-${action}`;
    await runWithMessage(`规划动作已开始：${action}`, async () => {
      await appendEvent({ type: "planning.action.click", traceId, action, message: action });
      await runWorkbenchAction({
        action,
        planId,
        manuscriptId: selectedManuscript?.currentPlanId === planId ? selectedManuscript.id : undefined,
        clientTraceId: traceId,
        instructions: `结构化规划页真实动作入口：${traceId}`
      });
    });
  }

  async function createDraft(topicId: string, planId: string, title: string) {
    await runWithMessage("正文工程已创建", async () => createManuscript(topicId, planId, title));
  }

  async function generate(manuscriptId: string, planId: string) {
    await runWithMessage("正文候选已生成", async () => runAction(manuscriptId, planId, defaultActionType));
  }

  async function review(candidateId: string) {
    await runWithMessage("候选已审稿", async () => reviewCandidate(candidateId));
  }

  async function merge(candidateId: string) {
    await runWithMessage("候选已合并", async () => mergeCandidate(candidateId));
  }

  async function submit(manuscriptId: string) {
    await runWithMessage("投稿包已生成", async () => buildSubmission(manuscriptId, "番茄短故事"));
  }

  async function saveDraftText(manuscriptId: string, text: string) {
    await runWithMessage("正文已保存", async () => saveManuscriptText(manuscriptId, text));
  }

  async function updateWorkbenchMeta(manuscriptId: string, input: Dashboard["manuscripts"][number]["workbench"]) {
    await runWithMessage("看板信息已保存", async () => updateManuscriptWorkbench(manuscriptId, input));
  }

  async function runWorkbench(action: WorkbenchActionId) {
    const traceId = `ui-${Date.now()}-${action}`;
    await runWithMessage(`动作已开始：${action}`, async () => {
      await appendEvent({ type: "action.click", traceId, action, message: action });
      await runWorkbenchAction({
        action,
        manuscriptId: selectedManuscript?.id,
        planId: selectedManuscript?.currentPlanId,
        targetPlatform: "番茄短故事",
        clientTraceId: traceId,
        instructions: `浏览器工作台真实动作入口：${traceId}`
      });
    });
  }

  async function stopJob(jobId: string) {
    await runWithMessage("任务停止请求已记录", async () => {
      await stopAction(jobId);
    });
  }

  async function selectRunOutput(runId: string) {
    const output = await fetchRunOutput(runId);
    setSelectedRunId(output.runId);
    setRunOutput(output.content);
  }

  return {
    dashboard: data.dashboard,
    topic,
    message,
    error: error || data.loadError,
    runs: data.runs,
    jobs: data.jobs,
    references: data.references,
    platformRadar: data.platformRadar,
    selectedManuscriptId,
    selectedManuscript,
    setTopic,
    setSelectedManuscriptId,
    submitTopic,
    select,
    plan,
    complete,
    updatePlan,
    confirm,
    runPlanningAction,
    createDraft,
    generate,
    review,
    merge,
    submit,
    saveDraftText,
    updateWorkbenchMeta,
    runWorkbench,
    stopJob,
    selectedRunId,
    runOutput,
    selectRunOutput
  };
}
