# Huanwrite Spec Index

这里记录当前 Huanwrite 的正式规格。规格只描述当前项目，不记录历史过程。

## 阅读顺序

1. `00-project/01-project-definition.md`
2. `00-project/02-user-workflow.md`
3. `10-production/01-topic-selection.md`
4. `10-production/02-story-planning.md`
5. `10-production/03-draft-management.md`
6. `10-production/04-candidate-workflow.md`
7. `10-production/05-review-and-quality.md`
8. `10-production/06-action-system.md`
9. `10-production/07-submission-workflow.md`
10. `10-production/08-drama-adaptation.md`
11. `20-state/01-source-of-truth.md`
12. `20-state/02-directory-structure.md`
13. `20-state/03-data-contracts.md`
14. `20-state/04-status-machine.md`
15. `30-workbench/01-workbench.md`
16. `30-workbench/02-workbench-pages.md`
17. `40-integrations/01-provider-and-secrets.md`
18. `40-integrations/02-asset-reuse.md`
19. `90-engineering/01-observability.md`
20. `90-engineering/02-testing-and-acceptance.md`
21. `90-engineering/03-acceptance-map.md`

## 审计原则

- 每个 spec 必须能对应代码、测试或验收命令。
- 每个用户可见能力必须有真实状态变化。
- 每个工作台动作必须有 API、job、run、trace 和测试。
- 每个新增页面入口必须有页面职责和 E2E 覆盖。
- 每个新增数据结构必须有真相源说明。

## 修改规则

- 改规格必须同步实现和测试。
- 改实现必须同步规格和测试。
- 改测试必须对应当前规格。
- 不能把未实现能力写成当前能力。
- 不能把历史过程写成当前规格。
