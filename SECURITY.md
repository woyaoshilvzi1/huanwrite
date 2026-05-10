# Security Policy

## Supported Versions

The current main branch is the only supported development line.

## Reporting a Vulnerability

Report security issues privately to the project maintainer. Do not publish exploit details before the maintainer has had time to assess and fix the issue.

## Security Rules

- Do not commit API keys.
- Do not commit cookies.
- Do not commit platform account credentials.
- Do not commit contract privacy.
- Do not commit identity, banking, or tax privacy.
- Do not store secrets in manuscripts, candidates, reviews, submissions, runtime logs, or workbench state.
- Use environment variables or local ignored secret storage for runtime credentials.
- Platform data must come from public information unless the project owner explicitly records a confirmed non-secret fact.

## Expected Handling

- Secrets found in project files must be treated as exposed.
- Exposed secrets must be rotated before reuse.
- Runtime logs must redact secrets.
- Tests should protect the no-secret-storage boundary at the core workflow level.

