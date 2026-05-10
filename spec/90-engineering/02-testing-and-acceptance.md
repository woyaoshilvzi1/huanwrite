# Testing And Acceptance

## 必跑命令

```powershell
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
```

## 验收层级

- TypeScript 类型检查保护类型边界。
- Vitest 保护核心服务、仓库结构、资产、契约和服务端 API。
- Playwright 保护真实浏览器工作台、真实 API、真实 job、真实 run、真实 trace。

## 工作台完成标准

工作台相关改动必须证明：

- 页面入口存在。
- 用户能通过页面操作。
- API 收到真实请求。
- SQLite 状态发生真实变化。
- 长文本或运行报告可读取。
- job 状态可查询。
- WebSocket 能刷新任务状态。
- trace sidecar 可读取。
- E2E 校验最终事实。

## 坏味道扫描

```powershell
npm.cmd run audit:smells
```

命中必须解释或清理。测试文件中用于审计坏味道的正则文本可以保留。
