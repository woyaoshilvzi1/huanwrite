# Huanwrite Agent Map

Always read and write text files as UTF-8 unless a file format explicitly requires something else.

Reply to the project owner in Simplified Chinese.

This file is the project map and operating law. Keep detailed engineering, testing, and user-preference rules in `docs/`.

## Read First

- `docs/user-preferences.md`: owner-facing preferences and unacceptable behaviors.
- `docs/core.md`: product purpose, architecture, and source-of-truth map.
- `docs/engineering-rules.md`: maintainability audit rules.
- `docs/testing-rules.md`: real-test standards and verification commands.
- `spec/README.md`: current product and engineering specifications.

## Iron Rules

- Do not run `git push`, publish packages, upload releases, or otherwise upload project state unless the owner explicitly asks for that exact upload/push action in the current conversation.
- Do not claim completion until code, documentation, and tests describe the same current behavior and the required verification has passed.
- Do not write fake tests. Tests must exercise real API behavior, real UI behavior, real persisted state, or real generated artifacts.
- Do not create empty shells. User-visible features need real state, real behavior, real artifacts where applicable, and real tests.
- Do not keep compatibility layers, fallback readers, dual writes, historical aliases, or old residue.
- Do not hide design problems with `any`, `unknown as`, `as {}`, fake generics, brittle selectors, or order guesses.
- Do not hardcode creative content, platform rules, word banks, writing templates, or quality rules inside services or UI. Maintain them under `.huanwrite/assets` or explicit configuration.

## Project Map

- `packages/shared`: contracts, statuses, workbench action/view definitions, and shared schemas.
- `packages/core`: business services, SQLite repositories, asset readers, AI provider configuration, action execution, observability, health, and eval baseline.
- `packages/server`: Hono API routes, OpenAPI document, browser API client, and job WebSocket.
- `packages/web`: React/Vite workbench UI. UI renders state and triggers user intent; it does not own business rules.
- `packages/cli`: command-line entry.
- `tests`: all tests. End-to-end tests live in `tests/e2e`.
- `.huanwrite/assets`: human-maintained writing assets, creative lanes, templates, skills, corpus, and rules.
- `.huanwrite/huanwrite.sqlite`: machine-read business state.
- `.huanwrite/.env`: local secret configuration, ignored by git.

## Required Verification

```powershell
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
npm.cmd run audit:smells
```
