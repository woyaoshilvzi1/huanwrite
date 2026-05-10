# Acceptance Map Checklist

## 目标

把核心规格映射到骨干验收，保证后续 TDD 不发散。

## Project Definition

- [ ] `project-definition` 验收项目核心流程存在。
- [ ] `project-definition` 验收项目不保存敏感凭据。
- [ ] `project-definition` 验收项目不自动投稿。

## Source Of Truth

- [ ] `source-of-truth` 验收正式正文、候选、审稿、投稿、运行证据分离。
- [ ] `source-of-truth` 验收每类资料只有一个默认落点。

## Topic Selection

- [ ] `topic-selection` 验收题材具备卖点、冲突、平台和体量判断。
- [ ] `topic-selection` 验收题材不能跳过规划进入正文。

## Story Planning

- [ ] `story-planning` 验收规划确认状态。
- [ ] `story-planning` 验收正文候选只能基于已确认规划生成。

## Draft Management

- [ ] `draft-management` 验收正文与候选分离。
- [ ] `draft-management` 验收空内容不能覆盖已有正文。
- [ ] `draft-management` 验收候选合入需要人工确认。

## Candidate Workflow

- [ ] `candidate-workflow` 验收自动生成结果先进入候选。
- [ ] `candidate-workflow` 验收候选状态可追踪。

## Review And Quality

- [ ] `review-and-quality` 验收审稿输出结论、理由和问题清单。
- [ ] `review-and-quality` 验收审稿不直接修改正文。

## Submission Workflow

- [ ] `submission-workflow` 验收投稿包和真实投递记录分离。
- [ ] `submission-workflow` 验收收入事实不提前虚构。

## Drama Adaptation

- [ ] `drama-adaptation` 验收短剧改编不覆盖原稿。
- [ ] `drama-adaptation` 验收改编稿能追溯原稿。

## Workbench

- [ ] `workbench` 验收工作台展示来自正式资料落点。
- [ ] `workbench` 验收工作台写入进入对应真相源。

## Provider And Secrets

- [ ] `provider-and-secrets` 验收 API key 不进入项目文件。
- [ ] `provider-and-secrets` 验收模型输出不会绕过候选流程。

## Observability

- [ ] `observability` 验收每次动作都有运行记录。
- [ ] `observability` 验收接手者不用翻聊天记录继续。

## 验收克制

- [ ] 验收不锁死无关文案。
- [ ] 验收不锁死临时布局。
- [ ] 验收不锁死内部实现细节。
- [ ] 验收不保护未来空壳。
