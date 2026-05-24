# Git Workflow

## Pre-push / pre-PR checklist

Run these steps before pushing a branch or opening a PR. This keeps `pnpm-lock.yaml` in sync with `development` and prevents merge conflicts on the lockfile.

```bash
git fetch origin
git rebase origin/development
pnpm install
git add pnpm-lock.yaml
```

### Why

`pnpm-lock.yaml` is regenerated on every `pnpm install`. If two branches add or update different packages, their lockfiles diverge and git produces a conflict that cannot be auto-resolved. Rebasing onto the latest `development` first and reinstalling ensures your lockfile already incorporates everything already merged, so there is nothing to conflict.

## Branch naming

```
feat/name
fix/name
chore/name
refactor/name
docs/name
```

Never push directly to `master` or `development`.

## Commit format

Enforced by `commitlint.config.js`:

- **Type**: `feat | fix | chore | refactor | docs | test | style | ci`
- **Format**: `<type>: <subject>` — max 100 chars, no trailing `.`
- **Body**: optional, separated from subject by a blank line; explain *why*, not *what*
- No `Co-Authored-By` trailers
- Never commit `.env` files