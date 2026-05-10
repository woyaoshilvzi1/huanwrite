import { workbenchActionIds } from "@huanwrite/shared";

export function openApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Huanwrite Local API",
      version: "0.1.0"
    },
    paths: {
      "/api/health": { get: { summary: "健康检查" } },
      "/api/config": { get: { summary: "AI 配置状态，不返回密钥" } },
      "/api/contract": { get: { summary: "工作台动作和视图契约" } },
      "/api/dashboard": { get: { summary: "工作台看板" } },
      "/api/context": { get: { summary: "参考上下文" } },
      "/api/platform-radar": { get: { summary: "平台雷达快照" } },
      "/api/eval-baseline": { get: { summary: "动作观测基线" } },
      "/api/topics": { post: { summary: "创建题材" } },
      "/api/topics/{id}/select": { post: { summary: "选中题材" } },
      "/api/topics/{id}/plans": { post: { summary: "创建规划" } },
      "/api/plans/{id}": { put: { summary: "保存结构化规划" } },
      "/api/plans/{id}/complete": { post: { summary: "补齐规划" } },
      "/api/plans/{id}/confirm": { post: { summary: "确认规划" } },
      "/api/topics/{id}/manuscripts": { post: { summary: "创建正文工程" } },
      "/api/manuscripts/{id}/text": {
        get: { summary: "读取正文" },
        put: { summary: "保存正文" }
      },
      "/api/manuscripts/{id}/workbench": { patch: { summary: "保存看板和质量门" } },
      "/api/manuscripts/{id}/actions": { post: { summary: "生成正文候选" } },
      "/api/candidates/{id}/review": { post: { summary: "候选审稿" } },
      "/api/candidates/{id}/merge": { post: { summary: "合入候选" } },
      "/api/manuscripts/{id}/submissions": { post: { summary: "生成投稿包" } },
      "/api/runs": { get: { summary: "运行记录列表" } },
      "/api/runs/{id}": { get: { summary: "读取运行输出" } },
      "/api/action": { post: { summary: "运行工作台动作" } },
      "/api/action-status": { get: { summary: "查询后台任务状态" } },
      "/api/action-stop": { post: { summary: "请求停止后台任务" } },
      "/api/runs/{id}/trace": { get: { summary: "读取运行观测 trace sidecar" } },
      "/api/jobs": { get: { summary: "后台任务列表" } },
      "/ws/jobs": { get: { summary: "后台任务 WebSocket 推送" } },
      "/api/events": {
        get: { summary: "读取 UI/动作事件" },
        post: { summary: "记录 UI/动作事件" }
      }
    },
    components: {
      schemas: {
        ActionId: {
          type: "string",
          enum: workbenchActionIds
        }
      }
    }
  };
}

export function browserApiClient(): string {
  return [
    "export function createHuanwriteApi(fetcher = fetch) {",
    "  const json = (path, init) => fetcher(path, init).then((response) => response.json());",
    "  return {",
    "    dashboard: () => json('/api/dashboard'),",
    "    config: () => json('/api/config'),",
    "    contract: () => json('/api/contract'),",
    "    context: () => json('/api/context'),",
    "    platformRadar: () => json('/api/platform-radar'),",
    "    evalBaseline: () => json('/api/eval-baseline'),",
    "    runs: () => json('/api/runs'),",
    "    jobs: () => json('/api/jobs'),",
    "    actionStatus: (jobId) => json('/api/action-status?jobId=' + encodeURIComponent(jobId)),",
    "    runTrace: (runId) => json('/api/runs/' + encodeURIComponent(runId) + '/trace'),",
    "    runOutput: (runId) => fetcher('/api/runs/' + encodeURIComponent(runId)).then((response) => response.text()),",
    "    runAction: (body) => json('/api/action', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),",
    "    jobSocketUrl: () => ((location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/ws/jobs'),",
    "    stopAction: (jobId) => json('/api/action-stop', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jobId }) })",
    "  };",
    "}"
  ].join("\n");
}
