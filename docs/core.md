# Huanwrite 当前核心

Huanwrite 是本地小说生产工作台。当前核心目标是把稿线、选题、规划、写稿、候选、审稿、合入、投稿、短剧改编、平台雷达、运行观测和参考资产放在一条可验证的生产链里。

## 主流程

1. 从创作稿线进入题材。稿线定义平台、受众、长度、雷达信号、创作要求和质量门。
2. 创建题材。
3. 选中题材。
4. 创建结构化规划。
4. 补齐或编辑规划。
5. 运行规划动作：写前规划、重新规划、润色规划、头脑风暴。
6. 确认规划。
7. 创建正文工程。
8. 保存正文。
9. 生成候选。
10. 候选审稿。
11. 按审稿返修或生成合入简报。
12. 合入通过审稿的候选。
13. 生成投稿包、短剧改编或平台雷达判断。
14. 查看运行输出、任务、trace 和 eval baseline。

## 当前模块边界

- `packages/shared` 只负责共享契约、状态和工作台动作/视图定义。
- `packages/core` 负责业务规则、SQLite 仓储、资产读取、AI provider 配置、动作执行、健康检查、观测和 eval baseline。
- `packages/server` 负责 Hono 路由、OpenAPI、浏览器 API client 和 `/ws/jobs`。
- `packages/web` 负责 React/Vite UI、controller hooks、API client、图表和组件。
- `packages/cli` 负责命令行入口。
- `tests` 负责所有自动验证。

## 真相源

- 机器读写业务状态：`.huanwrite/huanwrite.sqlite`。
- 人类维护资产：`.huanwrite/assets`，其中 `.huanwrite/assets/topic-rules/creative-lanes.json` 是稿线定义。
- 本机密钥：`.huanwrite/.env`。
- 正文、候选正文、动作输出：Markdown 文件。
- 动作 trace：同 run 关联的 JSON sidecar。
- API/动作/视图契约：`packages/shared/src/workbenchContract.ts`。

## 工作台能力

- 多稿线看板：稿线画像、搜索、筛选、拖拽改状态、负责人、备注、质量门。
- 结构化规划：章节卡完整字段、人物关系、说话指纹、文风指纹、禁用句式、疲劳词、技法卡。
- 动作工作台：14 个正式动作，每个动作进入后台 job，完成后写 run 和 trace。
- 输出与任务：查看 run 列表、job 列表、日志、停止请求和运行输出正文。
- 平台雷达：公开信息证据、稿线匹配、证据评分、噪音降权和不可推断项。
- 稿线驱动创作：从稿线创建题材后，稿线要求进入题材、规划规则、正文工作台元数据、质量门和雷达匹配。
- 参考资产：模板、规则、技能、语料和写作指南。

## API 面

当前 API 包含：

- `/api/health`
- `/api/config`
- `/api/contract`
- `/api/creative-lanes`
- `/api/openapi.json`
- `/assets/api-client.js`
- `/api/dashboard`
- `/api/context`
- `/api/platform-radar`
- `/api/eval-baseline`
- `/api/topics`
- `/api/plans/:id`
- `/api/manuscripts/:id/text`
- `/api/manuscripts/:id/workbench`
- `/api/candidates/:id/review`
- `/api/candidates/:id/merge`
- `/api/runs`
- `/api/runs/:id`
- `/api/runs/:id/trace`
- `/api/jobs`
- `/api/action`
- `/api/action-status`
- `/api/action-stop`
- `/api/events`
- `/ws/jobs`

## 审计结论标准

一次改动只有同时满足以下条件，才可以称为完成：

- 代码职责边界清楚。
- 真相源没有分裂。
- 用户可见功能有真实状态变化。
- API、UI、测试、文档一致。
- `npm.cmd run typecheck` 通过。
- `npm.cmd run test` 通过。
- 涉及工作台时 `npm.cmd run test:e2e` 通过。
- 坏味道扫描无非预期命中。
