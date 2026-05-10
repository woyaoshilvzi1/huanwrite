# Huanwrite 开源项目标准

Huanwrite 按严肃开源项目维护。任何贡献者或 Agent 接手前，都必须先做结构审计，再改代码。

## 根目录必须具备

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `AGENTS.md`
- `.gitignore`
- `.huanwrite/.env.example`

## 代码标准

- 包边界清晰。
- 文件职责单一。
- 类型严格。
- 没有源码级 `any`。
- 没有空壳功能。
- 没有硬编码写作资产。
- 没有构建产物入库。
- 没有包内测试目录。
- 没有前端任务轮询。

## 文档标准

- README 面向第一次使用者。
- AGENTS 面向 Agent 和维护者。
- docs 面向当前工程审计。
- spec 面向当前功能验收。
- 文档只写当前事实，不写历史过程。

## 安全标准

- MIT License。
- 密钥只在 `.huanwrite/.env`。
- `.huanwrite/.env` 被 git 忽略。
- API 配置接口不返回密钥。
- 平台雷达只处理公开信息。
- 不保存平台账号、cookie、合同隐私、回款隐私或身份隐私。

## 验收标准

每个功能必须同时具备：

- 业务契约。
- API 或 UI 入口。
- 真实状态变化。
- 真实产物或可读取事实。
- 单元测试或 E2E。
- 文档同步。

缺任何一项，都不能标记完成。
