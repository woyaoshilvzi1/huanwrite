# Huanwrite

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vite.dev/) [![Vitest](https://img.shields.io/badge/tests-Vitest-yellow.svg)](https://vitest.dev/) [![Playwright](https://img.shields.io/badge/e2e-Playwright-2EAD33.svg)](https://playwright.dev/)

Huanwrite 是一个本地小说生产工作台，面向完整写作流程：选题、规划、写稿、候选、审稿、合入、投稿包、短剧改编、平台雷达、运行观测和参考资产。

它不是提示词文件夹，也不是演示页面。每个动作都要落到真实状态、真实输出和真实测试。

## 功能

- 多稿线看板：搜索、筛选、拖拽改状态、负责人、备注和质量门。
- 结构化规划：章节卡、摘要、目标字数、场景数、出场角色、主角目标、冲突、转折、钩子、OOC 风险、人工备注、人物关系、说话指纹、文风指纹、禁用句式、疲劳词和技法卡。
- 规划动作：写前规划、重新规划、润色规划、头脑风暴、规划确认硬闸。
- 正文生产：创建正文、保存正文、空稿覆盖保护、候选生成、候选审稿、按审稿返修、合入简报、候选合入。
- 运营输出：投稿包、短剧改编、平台雷达、每日平台雷达。
- 后台任务：真实 job、进度、日志、停止请求和 WebSocket 更新。
- 运行观测：运行输出、trace sidecar、prompt hash、prompt registry key、模型信息、usage、harness 和 eval baseline。
- 参考资产：读取 `.huanwrite/assets` 下的模板、规则、技能和语料。
- API 契约：健康检查、配置、dashboard、context、platform radar、runs、jobs、events、OpenAPI 和浏览器 API client。

## 安装

```powershell
npm.cmd install
```

## 配置 AI

复制示例配置：

```powershell
Copy-Item .huanwrite\.env.example .huanwrite\.env
```

编辑 `.huanwrite/.env`：

```env
HUANWRITE_PROVIDER=yls
HUANWRITE_API_KEY=填你自己的 key
HUANWRITE_BASE_URL=https://code.ylsagi.com/codex
HUANWRITE_MODEL=gpt-5.5
HUANWRITE_API_TIMEOUT_MS=300000
HUANWRITE_REASONING_EFFORT=medium
HUANWRITE_SHOW_REASONING=false
HUANWRITE_STREAMING=true
```

`.huanwrite/.env` 已被 git 忽略，不要上传密钥。

## 启动

开第一个终端：

```powershell
npm.cmd run dev
```

API 默认地址：

```text
http://127.0.0.1:4627/api/health
```

开第二个终端：

```powershell
npm.cmd run dev:web
```

前端默认地址：

```text
http://127.0.0.1:5173
```

## 使用顺序

1. 创建题材。
2. 选中题材。
3. 创建规划。
4. 补齐结构化规划。
5. 按需要运行重新规划、润色规划或头脑风暴。
6. 确认规划。
7. 创建正文。
8. 写入或保存正文。
9. 生成候选。
10. 候选审稿。
11. 需要返修时按审稿返修；需要人工接缝时看合入简报。
12. 合入通过审稿的候选。
13. 生成投稿包、短剧改编或平台雷达判断。
14. 在输出与任务里查看 run、job、trace 和模型执行结果。

## 验证

普通验证：

```powershell
npm.cmd run typecheck
npm.cmd run test
```

浏览器实测：

```powershell
npm.cmd run test:e2e
```

E2E 会启动 Hono API 和 Vite 前端，使用 headed Playwright 像真人一样操作页面，并通过 API 校验真实状态、真实 run、真实 job 和真实输出。测试工作区在 `test-results/e2e-workspaces/<时间戳>`，不会污染当前项目数据。

完整验证：

```powershell
npm.cmd run verify:e2e
```

## 目录

- `AGENTS.md`：协作规则和工程边界。
- `docs/`：当前项目说明、工程规则、测试规则和开源规范。
- `spec/`：当前功能规格。
- `packages/shared`：共享契约。
- `packages/core`：业务核心、SQLite、资产、AI、动作和观测。
- `packages/server`：Hono API 和 WebSocket。
- `packages/web`：React/Vite 工作台。
- `packages/cli`：命令行入口。
- `tests/`：单元、服务端和 E2E 测试。
- `.huanwrite/assets/`：人工维护资产。

## 安全边界

- 不自动投稿。
- 不保存平台账号、cookie、合同隐私或回款隐私。
- 不绕过登录墙、WAF 或平台访问限制。
- 平台雷达只处理公开信息。
- API 配置接口不返回密钥。

## License

MIT
