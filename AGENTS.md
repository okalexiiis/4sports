# 4Sports — Agent Instructions

## Project
Sports tournament management platform. Monorepo with three apps and shared packages.

## Workspace layout
```
apps/api      → Bun + ElysiaJS (REST API + WebSockets)
apps/web      → Next.js 14 App Router (organizer dashboard)
apps/mobile   → Expo + React Native + NativeWind (iOS & Android)
packages/types   → Shared TypeScript types
packages/utils   → Shared helpers and Zod schemas
packages/ui      → Shared base components
packages/config  → Shared tsconfig and tooling config
```

## Commands
```bash
bun install               # install all workspaces from root
bun dev                   # run all apps in parallel (Turborepo)
bun dev --filter @4sports/api     # run only the API
bun dev --filter @4sports/web     # run only the web
bun dev --filter @4sports/mobile  # run only mobile
bun check                 # lint + format + organize imports (Biome)
bun build                 # build all apps
```

## Key constraints
- Runtime: Bun — never use Node-only APIs
- Package manager: Bun — never suggest npm, pnpm, or yarn commands
- Linting/formatting: Biome — never suggest ESLint or Prettier
- TypeScript strict mode is on everywhere — no `any`, no `!` assertions without a comment
- Monorepo packages are referenced as `@4sports/*`
- `tsconfig extends` uses relative paths (e.g. `../../packages/config/tsconfig.node.json`), not package names — this is intentional due to TypeScript `baseUrl` interaction

## Architecture rules
- API follows clean architecture: routes → services → repositories. Never put business logic in routes.
- Shared types live in `packages/types` — never redefine them in an app
- Shared validation schemas (Zod) live in `packages/utils`
- UI components used by both web and mobile live in `packages/ui`

## Before starting any task, read the relevant doc:
- Unsure of project context → read `agent_docs/project.md`

## Git
- Branch format: `feat/name`, `fix/name`, `chore/name`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Never push directly to `master` or `development`
- Never commit `.env` files
