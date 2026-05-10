# Action System Checklist

## 目标

定义工作台动作的输入、输出、状态和边界。

## 通用动作规则

- [ ] 每个动作有唯一动作类型。
- [ ] 每个动作有输入对象。
- [ ] 每个动作有输出对象。
- [ ] 每个动作有运行记录。
- [ ] 每个动作有状态。
- [ ] 每个动作失败时有错误信息。
- [ ] 每个动作不直接写入无关真相源。
- [ ] 每个自动生成动作输出先进入候选。

## plan-story

- [ ] 输入 Topic。
- [ ] 输出 Plan。
- [ ] 输出状态为规划草稿或待确认。
- [ ] 不输出正式正文。

## continue-draft

- [ ] 输入 confirmed Plan。
- [ ] 输入 Manuscript 当前正文。
- [ ] 输出 Candidate。
- [ ] 不直接覆盖 Manuscript。

## revise-ai-flavor

- [ ] 输入 Manuscript 或 Candidate。
- [ ] 输入文风规则、禁用句式和疲劳词。
- [ ] 输出 Candidate。
- [ ] 不直接覆盖原内容。

## repair-candidate

- [ ] 输入 Candidate。
- [ ] 输入 Review。
- [ ] 输出新的 Candidate。
- [ ] 只修复审稿指出的问题。
- [ ] 不重新开新稿。

## review-candidate

- [ ] 输入 Candidate。
- [ ] 输入当前有效 Plan。
- [ ] 输入目标平台要求。
- [ ] 输出 Review。
- [ ] 不直接修改 Candidate 或 Manuscript。

## merge-candidate

- [ ] 输入 approved Candidate。
- [ ] 输入 Manuscript。
- [ ] 需要人工确认。
- [ ] 输出 Manuscript 更新。
- [ ] 输出合入记录。

## build-submission-package

- [ ] 输入 Manuscript 或 Adaptation。
- [ ] 输入目标平台。
- [ ] 输出 SubmissionPackage 候选。
- [ ] 不记录真实投递。

## record-submission

- [ ] 输入 confirmed SubmissionPackage。
- [ ] 输入用户确认的投递事实。
- [ ] 输出 SubmissionRecord。
- [ ] 不自动访问平台后台。

## adapt-drama

- [ ] 输入 Manuscript。
- [ ] 输出 Adaptation 候选。
- [ ] 包含人物小传和 10 集一卡。
- [ ] 不覆盖原稿。

## platform-radar

- [ ] 输入公开平台来源。
- [ ] 输出平台规则或平台简报。
- [ ] 记录来源和核验时间。
- [ ] 不登录平台。
- [ ] 不使用 cookie。

## 完成验收

- [ ] 每个动作职责单一。
- [ ] 每个动作有明确输入输出。
- [ ] 每个动作运行可追溯。
- [ ] 每个动作遵守候选和人工确认边界。
