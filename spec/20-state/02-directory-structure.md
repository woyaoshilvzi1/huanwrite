# Directory Structure Checklist

## 目标

定义当前项目完成后的正式目录结构。

## 根目录

- [ ] `AGENTS.md` 存放 Agent 运行地图。
- [ ] `docs/` 存放当前项目规则和核心边界。
- [ ] `spec/` 存放当前项目规格和 checklist 验收。
- [ ] `packages/` 存放 TypeScript monorepo 实现。
- [ ] `scripts/` 存放项目级验证和运行脚本。
- [ ] `.huanwrite/` 存放当前项目正式生产资料。
- [ ] `.huanwrite/huanwrite.sqlite` 存放结构化业务状态。

## data 目录

- [ ] `.huanwrite/huanwrite.sqlite` 存放题材池、写前规划、正文元数据、候选元数据、审稿结果、投稿包、事件和运行记录。
- [ ] `.huanwrite/manuscripts/` 存放正式正文长文本。
- [ ] `.huanwrite/candidates/` 存放候选长文本。
- [ ] `.huanwrite/revenue/` 存放收入和回款事实。
- [ ] `.huanwrite/platforms/` 存放平台公开规则。
- [ ] `.huanwrite/adaptations/` 存放短剧改编。
- [ ] `.huanwrite/assets/` 存放已正式纳入项目的写作资产。

## packages 目录

- [ ] `packages/core/` 存放领域模型、状态机、数据契约和业务服务。
- [ ] `packages/server/` 存放本地 API 服务。
- [ ] `packages/web/` 存放工作台前端。
- [ ] `packages/cli/` 存放项目初始化、检查和运行命令。
- [ ] `packages/shared/` 存放共享类型和契约。
- [ ] `packages/*/src/` 存放源码。
- [ ] `packages/*/tests/` 存放对应包的骨干测试。
- [ ] 各包不能互相偷拿内部实现。

## runs 目录

- [ ] `.huanwrite/runs/actions/` 存放动作输出报告长文本。
- [ ] 事件结构化记录只进入 SQLite。
- [ ] `.huanwrite/runs/errors/` 存放错误附件。
- [ ] `.huanwrite/runs/reports/` 存放验证报告附件。

## 禁止结构

- [ ] 不创建空壳扩展目录。
- [ ] 不创建未来可能用到但当前没有职责的目录。
- [ ] 不让工作台另建隐藏数据库替代 `.huanwrite/` 真相源。
- [ ] 不把参考材料路径写成正式运行路径。
- [ ] 不创建 `.huanwrite/topics/`、`.huanwrite/plans/`、`.huanwrite/reviews/`、`.huanwrite/submissions/` 作为业务 JSON 目录。
- [ ] 不把机器运行态业务状态写成 JSON 文件。

## 完成验收

- [ ] 每个根目录都有职责。
- [ ] 每个 data 子目录都有唯一资料类型。
- [ ] 每个运行产物都有落点。
- [ ] 目录结构能支撑完整用户流程。
