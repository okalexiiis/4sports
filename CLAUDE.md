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
packages/utils   → Shared helpers: Result<T>, DomainError, createLogger
packages/ui      → Shared components used by both web and mobile
packages/config  → Shared tsconfig files (base, node, react)
```

### API: use-case architecture

```
HTTP routes (thin) → Use Cases (pure functions) → Repository interfaces → Implementations
```

Business logic lives exclusively in use cases. Route handlers do nothing beyond calling a use case and passing the result to `toApiResponse`. Never add logic to route handlers.

#### Entry point (`src/index.ts`)
- Derives `requestId` + `requestStartedAt` globally on every request.
- After-response hook: structured HTTP log (method, path, status, ms, requestId).
- Global error handler: maps ElysiaJS error codes (VALIDATION → 422, NOT_FOUND → 404, PARSE → 400, fallback → 500). All errors return `{ error: { code, message, details } }`.
- OpenAPI docs served at `/openapi`.
- BetterAuth mounted at `/auth/*`.

#### API versioning (`src/shared/versioning.ts`)
- `createVersion(n)` returns an Elysia app prefixed at `/vN`.
- Production modules are mounted in `src/v1/index.ts` via `.use(moduleRoutes)`.
- Sandbox routes are **not** version-prefixed through `v1`; they mount directly with their own `/sandbox/v1/...` prefix.

#### Shared layer (`src/shared/`)
| File | Purpose |
|---|---|
| `env.ts` | Strict env validation via `requireEnv()` — fails fast at startup |
| `logger.ts` | Thin re-export of `@4sports/utils/logger`, scoped to `'api'` |
| `api-response.ts` | `toApiResponse(ctx, result, meta?)` — maps `Result<T>` to HTTP responses |
| `middleware/auth.guard.ts` | BetterAuth session check; attaches `user` + `session` to `ctx.store` |
| `middleware/request-logger.ts` | Per-request structured logging middleware |
| `db/client.ts` | Drizzle client (`drizzle-orm/bun-sql`) |
| `db/redis.ts` | Redis client |
| `db/schemas/` | Drizzle schema definitions |
| `lib/auth.ts` | BetterAuth instance |
| `openapi/responses.ts` | Reusable OpenAPI response shape helpers |

#### Sandbox (`src/_sandbox/`)
Reference implementation that shows the required folder structure for every domain module. Use it as a template — do not put production features in `_sandbox`.

Each domain module follows this layout:
```
<domain>/
  <domain>.entity.ts          → Plain interface (no class, no ORM coupling)
  <domain>.repository.ts      → INoteRepository interface
  in-memory-<domain>.repository.ts  → Dev/test implementation
  errors/
    codes.ts                  → Error code constants
    index.ts                  → DomainError factory functions
  use-cases/
    <action>-<domain>.use-case.ts   → Pure async function: (repo, input) → Promise<Result<T>>
  http/
    v1/
      routes.ts               → Elysia handlers (thin: call use case + toApiResponse)
      schemas.ts              → TypeBox body/param schemas
      docs.ts                 → OpenAPI detail objects
```

#### `packages/utils` sub-exports
- `@4sports/utils/result` — `Result<T>`, `Ok<T>`, `Err<E>`, `ok()`, `err()`, `DomainError`
- `@4sports/utils/logger` — `createLogger({ scope? })`, levels: `info | warn | error`

### Shared code rules

- Types: always `packages/types`, imported as `@4sports/types`
- Validation: Zod schemas live in `packages/utils`
- Cross-platform UI: `packages/ui`, imported as `@4sports/ui`
- Result/error handling: use `Result<T>` + `DomainError` from `@4sports/utils/result` — never throw from use cases

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

### Branches
- Format: `feat/name`, `fix/name`, `chore/name`, `refactor/name`, `docs/name`
- Never push directly to `master` or `development`

### Commits — rules enforced by `commitlint.config.js`
- **Atomic**: one logical change per commit. Never bundle unrelated changes.
- **Subject line**: max 100 characters (header-max-length default from `@commitlint/config-conventional`).
- **Types** (must be one of): `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `ci`
- **Format**: `<type>: <subject>` — subject must not be empty and must not end with `.`
- **Body**: optional; if present, must be separated from the subject by a blank line.
- **No changelogs in commit body**: list of changed files or bullet summaries of every touched line belong in the PR description, not the commit message. The message should explain *why*, not *what*.
- **No co-author trailers**: do not add `Co-Authored-By` lines. The subject line budget is tight; trailers add noise with no value here.
- Never commit `.env` files

## Additional context

For project roadmap and milestone details, read `agent_docs/project.md`.
