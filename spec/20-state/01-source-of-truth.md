# Source Of Truth Checklist

## 目标

定义当前项目哪些资料是正式事实，哪些只是候选或运行证据。

## 真相源

- [ ] `docs/` 记录当前项目规则、偏好、核心边界。
- [ ] `spec/` 记录当前项目规格和验收。
- [ ] `.huanwrite/huanwrite.sqlite` 保存题材、规划、正文元数据、候选元数据、审稿、投稿包、事件和运行记录。
- [ ] `.huanwrite/manuscripts/*.md` 保存正式正文长文本。
- [ ] `.huanwrite/candidates/*.md` 保存自动生成的待审长文本。
- [ ] `.huanwrite/runs/actions/*.md` 保存动作输出报告。
- [ ] `.huanwrite/revenue/` 保存维护者确认过的收入和回款附件。
- [ ] `.huanwrite/platforms/` 保存维护者确认过的平台公开规则附件。
- [ ] `.huanwrite/assets/` 保存人类可维护资产。

## 资料分层

- [ ] 正式正文长文本只放在 `.huanwrite/manuscripts/`，元数据只放在 SQLite。
- [ ] 自动生成长文本先放在 `.huanwrite/candidates/`，元数据只放在 SQLite。
- [ ] 审稿意见只放在 SQLite。
- [ ] 投稿资料只放在 SQLite；真实平台附件另放 `.huanwrite/platforms/`。
- [ ] 运行结构化记录只放在 SQLite，动作报告长文本只放在 `.huanwrite/runs/actions/`。
- [ ] 工作台展示这些资料，但不另建隐藏真相源。

## JSON 边界

- [ ] 人类维护资产可以使用 JSON。
- [ ] 机器运行态业务状态不能使用 JSON 文件。
- [ ] 不保留 SQLite 与业务 JSON 双真相源。

## 禁止事项

- [ ] 不把参考资料当正式真相源。
- [ ] 不把临时聊天记录当正式真相源。
- [ ] 不把运行输出直接覆盖正式正文。
- [ ] 不在项目资料中保存敏感凭据。

## 完成验收

- [ ] 每个正式目录都有明确职责。
- [ ] 每类资料只有一个默认落点。
- [ ] 每个落点都能说明负责什么、不负责什么。
