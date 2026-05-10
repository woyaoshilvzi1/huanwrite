# Huanwrite 测试审计规则

测试只保护当前项目事实。测试失败时，必须能指出一个真实能力缺失。

## 测试层级

- `tests/core`: 业务服务、配置、契约、目录结构。
- `tests/server`: Hono API 的公开行为。
- `tests/production-line`: 仓库结构和工程规则。
- `tests/assets`: 正式资产存在性和资产契约。
- `tests/e2e`: headed Playwright，真实启动 API 和前端，真实操作页面，真实校验 API 事实。

## 必须覆盖

- 题材创建和选中。
- 创作稿线选择，并验证稿线要求进入题材、规划、质量门和雷达匹配。
- 结构化规划补齐、编辑、保存和确认。
- 规划动作：写前规划、重新规划、润色规划、头脑风暴。
- 正文创建、保存和空内容保护。
- 候选生成、审稿、返修、合入简报、合入。
- 投稿包、短剧改编、平台雷达、每日平台雷达。
- 工作台动作产生真实 job、run、trace 和 event。
- 多稿线看板搜索、筛选、拖拽改状态、稿线画像、质量门、负责人、备注。
- 输出查看器读取真实 run 正文。
- `/api/health`、`/api/config`、`/api/contract`、`/api/openapi.json`、`/assets/api-client.js`、`/api/eval-baseline`。
- WebSocket 任务更新。
- AI 配置不泄露密钥。

## E2E 标准

- E2E 必须像真人一样操作页面。
- E2E 必须用 API 校验真实状态变化。
- E2E 不允许只点按钮看文案。
- E2E 不允许使用 `.first()`、`.last()`、顺序猜测或固定像素定位。
- E2E 每次使用隔离工作区。
- E2E 测试结束必须清理进程。

## 不写的测试

- 不测临时文案。
- 不测按钮顺序。
- 不测内部实现细节。
- 不用历史问题黑名单代替当前事实。
- 不为不存在的未来能力写空测试。

## 验证命令

```powershell
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
```

如果改动影响工作台、API、动作、状态、AI、WebSocket、图表或输出查看器，必须跑 E2E。
