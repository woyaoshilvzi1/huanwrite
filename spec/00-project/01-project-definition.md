# Project Definition

## 当前定位

Huanwrite 是本地小说生产工作台，服务中文商业小说从题材到投稿准备的完整生产链。

## 必须具备

- 多题材管理。
- 结构化写前规划。
- 多稿线看板。
- 正文工程。
- 候选生成。
- 候选审稿。
- 按审稿返修。
- 合入简报。
- 候选合入正文。
- 投稿包。
- 短剧改编。
- 平台雷达。
- 运行记录。
- 后台任务。
- 事件记录。
- 参考资产。
- AI provider 配置。
- OpenAPI 和浏览器 API client。

## 不做

- 不自动投稿。
- 不保存平台账号、cookie、合同隐私或回款隐私。
- 不把候选自动覆盖正式正文。
- 不把 UI 当第二套真相源。
- 不把资产硬编码进服务。

## 验收

- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run test:e2e`
