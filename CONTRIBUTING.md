# Contributing

## Ground Rules

- Read `AGENTS.md` first.
- Read `docs/user-preferences.md` before making decisions.
- Read `spec/README.md` before changing behavior.
- Keep communication in Simplified Chinese unless a task explicitly requires another language.
- Use UTF-8 for text files unless a file format requires otherwise.

## Development Rules

- Do not implement behavior that is not backed by `spec/`.
- Do not add compatibility layers for removed designs.
- Do not add empty future extension shells.
- Do not store secrets, cookies, account credentials, contract privacy, identity data, banking data, or tax privacy.
- Do not let generated content overwrite official manuscripts without review and manual merge.
- Keep one file focused on one responsibility.

## Testing Rules

- Tests protect core facts and main workflows.
- Tests do not lock incidental wording, layout, variable names, or future empty extensions.
- Add or update tests before implementation when changing core behavior.
- Run verification before handoff:

```powershell
npm.cmd run verify
```

## Pull Request Checklist

- [ ] The change maps to a current spec.
- [ ] The changed files have clear responsibilities.
- [ ] Core tests cover the changed behavior.
- [ ] Verification has run successfully.
- [ ] Documentation/specs are consistent with implementation.
- [ ] No secrets or private platform data are stored.

