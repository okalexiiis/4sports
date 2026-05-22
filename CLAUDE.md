# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

4Sports is a sports tournament and league management platform. Three user roles: **Organizer** (creates/manages tournaments), **Coach/Captain** (manages roster), **Player** (finds teams, tracks stats). Reference: sportwey.com — 4Sports differentiates with multi-sport support and a stronger player-finding-team UX.

## Commands

```bash
bun install                              # install all workspaces
bun dev                                  # run all apps in parallel (Turbo)
bun dev --filter @4sports/api            # run only the API
bun dev --filter @4sports/web            # run only the web app
bun dev --filter @4sports/mobile         # run only mobile
bun build                                # build all apps
bun check                                # lint + format + organize imports (Biome)
bun lint                                 # lint only
bun format                               # format only
```

No test commands are configured yet.

## Architecture

### Monorepo layout

```
apps/api      → Bun + ElysiaJS — REST API and WebSockets
apps/web      → Next.js 14 App Router — organizer dashboard (Turbopack dev)
apps/mobile   → Expo + React Native + NativeWind v4 + Tailwind v3 — iOS & Android
packages/types   → Shared TypeScript types (never redefine in apps)
packages/utils   → Shared helpers and Zod validation schemas
packages/ui      → Shared components used by both web and mobile
packages/config  → Shared tsconfig files (base, node, react)
```

### API: clean architecture

Routes → Services → Repositories. Business logic never goes in route handlers.

### Shared code rules

- Types: always `packages/types`, imported as `@4sports/types`
- Validation: Zod schemas live in `packages/utils`
- Cross-platform UI: `packages/ui`, imported as `@4sports/ui`

### Key stack decisions

| Layer | Choice | Why |
|---|---|---|
| Runtime | Bun | Performance, native TypeScript, faster installs |
| API framework | ElysiaJS | Built for Bun, best-in-class TS inference, native WebSockets |
| ORM | Drizzle | Lightweight, SQL-first, edge-compatible |
| Auth | BetterAuth | OAuth (Google/Facebook) + sessions out of the box |
| Styling (mobile) | NativeWind v4 + Tailwind v3 | Stable combo — v5+Tailwind v4 not production-ready yet |
| Storage | Cloudflare R2 | S3-compatible, no egress fees |
| API hosting | Railway | Zero-ops, auto SSL |

## Constraints

- **Runtime: Bun only** — never use Node-only APIs, never suggest npm/pnpm/yarn
- **Linting/formatting: Biome only** — never suggest ESLint or Prettier
- **TypeScript strict mode** — no `any`, no `!` assertions without a comment explaining why
- **tsconfig `extends`** uses relative paths (e.g. `../../packages/config/tsconfig.node.json`), not package names — intentional due to TypeScript `baseUrl` interaction
- Internal packages are private and not published to npm; import via workspace name (`@4sports/*`)

## Git

- Branch format: `feat/name`, `fix/name`, `chore/name`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Never push directly to `master` or `development`
- Never commit `.env` files

## Additional context

For project roadmap and milestone details, read `agent_docs/project.md`.
