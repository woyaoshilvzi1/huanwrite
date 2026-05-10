# Huanwrite Agent Operating Manual

Always read and write text files as UTF-8 unless a file format explicitly requires something else.

Use Simplified Chinese when replying to the project owner.

This project has no tolerance for unfinished surfaces. A feature is complete only when it has real state, real UI, real API behavior, real artifacts where applicable, and tests that verify those facts.

## Required Reading

- `docs/user-preferences.md`
- `docs/core.md`
- `docs/engineering-rules.md`
- `docs/testing-rules.md`
- `spec/README.md`

## Current Architecture

- `packages/shared`: shared contracts, statuses, and workbench action/view definitions.
- `packages/core`: business services, SQLite repositories, asset readers, AI provider configuration, action execution, health, eval baseline, and observability.
- `packages/server`: Hono API routes, OpenAPI document, browser API client, and job WebSocket.
- `packages/web`: React/Vite workbench UI. UI code renders state and calls API; it does not own business rules.
- `packages/cli`: command-line entry.
- `tests`: all tests. End-to-end tests live in `tests/e2e`.
- `.huanwrite/assets`: human-maintained writing assets, templates, skills, corpus, and rules.
- `.huanwrite/huanwrite.sqlite`: machine-read business state.
- `.huanwrite/.env`: local secret configuration, ignored by git.

## Non-Negotiable Rules

- Do not keep compatibility layers, fallback readers, dual writes, or historical aliases.
- Do not use number-suffixed prompt keys or release-stage labels for current functionality.
- Do not use `any`, `unknown as`, `as {}`, fake generic types, or assertions that hide design problems.
- Do not write hardcoded creative content, word banks, platform rules, or writing templates in services. Put maintainable content in `.huanwrite/assets` or explicit configuration.
- Do not create empty shells. Buttons, routes, panels, reports, and actions must change real state or expose real data.
- Do not put tests under packages. Keep tests under root `tests/`.
- Do not commit build output, caches, package-level `dist`, or `*.tsbuildinfo`.
- Do not use fragile E2E selectors such as `.first()`, `.last()`, or order guesses. Use accessible names, stable IDs, and API facts.
- Do not poll in the frontend for background jobs. Use `/ws/jobs`.

## File Responsibility

One file owns one responsibility.

- Contracts are not services.
- Services are not UI.
- API routes are not business logic.
- UI components are not data repositories.
- Chart data builders are not chart renderers.
- Storage modules own paths and persistence details.

Centralize what must be centralized: action IDs, status values, path rules, provider config, schema validation, and storage boundaries.

Separate what must be separate: rendering, controller hooks, service logic, repositories, route registration, fixtures, and E2E helpers.

## Storage

- Machine-read business state uses structured SQLite tables.
- Human-maintained assets use Markdown, JSON, CSV, YAML, images, or text files under `.huanwrite/assets`.
- Runtime action outputs are Markdown plus trace sidecars under `.huanwrite/runs/actions`.
- Secrets live only in `.huanwrite/.env`.

## Workbench Surface

The workbench must expose and keep verified:

- Topic creation and selection.
- Structured planning with chapter cards, relationship rows, voice/style fingerprints, banned phrases, fatigue words, and craft cards.
- Planning actions: write plan, replan, polish plan, brainstorm.
- Planning confirmation gates that block downstream writing when incomplete.
- Multi-lane board with search, filtering, quality gates, owner/notes, and drag status changes.
- Draft editing and empty overwrite protection.
- Candidate generation, review, repair, merge brief, merge, submission package, drama adaptation, platform radar, daily platform radar, and state audit.
- Background jobs with progress, logs, status, stop requests, and WebSocket updates.
- Action availability reasons.
- Run output viewer, trace sidecar, prompt hash, prompt registry key, model metadata, usage, harness, and eval baseline.
- Reference context from formal assets.
- Health, config, OpenAPI, generated browser API client, dashboard, events, runs, jobs, action status, action stop, context, platform radar, and eval baseline endpoints.

## Verification

Before claiming completion, run:

```powershell
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
```

Then run the bad-smell audit:

```powershell
npm.cmd run audit:smells
```

Only intentional model names or provider URL paths may remain from these scans.
