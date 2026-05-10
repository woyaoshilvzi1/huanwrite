# Status Machine Checklist

## 目标

定义核心对象的状态和允许转换。

## 题材状态

- [ ] `idea`：只有初始想法。
- [ ] `screening`：正在筛选。
- [ ] `selected`：已选中，可进入规划。
- [ ] `paused`：暂停。
- [ ] `discarded`：废弃。
- [ ] 题材只能从 `selected` 进入规划。

## 规划状态

- [ ] `draft`：规划草稿。
- [ ] `ready-for-review`：规划待确认。
- [ ] `confirmed`：规划已确认。
- [ ] `dirty`：已确认规划被修改，需要重新确认。
- [ ] `archived`：规划归档。
- [ ] 正文候选只能基于 `confirmed` 规划生成。

## 候选状态

- [ ] `generated`：已生成，待审。
- [ ] `under-review`：审稿中。
- [ ] `approved`：审稿通过。
- [ ] `needs-revision`：需要返修。
- [ ] `manual-merge-required`：需要人工合入。
- [ ] `merged`：已合入正文。
- [ ] `discarded`：废弃。
- [ ] 候选只能从 `approved` 或 `manual-merge-required` 进入合入处理。

## 正文状态

- [ ] `empty`：尚无正文。
- [ ] `drafting`：正文生产中。
- [ ] `reviewing`：正文审阅中。
- [ ] `ready-for-submission`：可准备投稿。
- [ ] `submitted`：已有真实投递。
- [ ] `paused`：暂停。
- [ ] 正文状态只由人工确认或真实投递事实推进。

## 审稿状态

- [ ] `pending`：待审。
- [ ] `running`：审稿中。
- [ ] `passed`：通过。
- [ ] `failed`：退回。
- [ ] `requires-human`：需要人工判断。
- [ ] 审稿结论不能自动修改正文。

## 投稿状态

- [ ] `package-draft`：投稿包草稿。
- [ ] `package-confirmed`：投稿包已确认。
- [ ] `submitted`：已投递。
- [ ] `response-received`：已有回执。
- [ ] `accepted`：已接受。
- [ ] `rejected`：已拒绝。
- [ ] `contracting`：合同处理中。
- [ ] `paid`：已有回款事实。
- [ ] `closed`：结束。

## 短剧状态

- [ ] `not-started`：未开始。
- [ ] `adapting`：改编中。
- [ ] `candidate`：改编候选。
- [ ] `reviewing`：改编审稿中。
- [ ] `confirmed`：改编已确认。
- [ ] `submission-ready`：短剧投稿包已准备。

## 完成验收

- [ ] 每个核心对象有明确状态。
- [ ] 每个状态转换有触发动作。
- [ ] 状态转换不能绕过人工确认点。
- [ ] 状态能支持中断后继续。
