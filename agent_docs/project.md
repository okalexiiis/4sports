# Project context

## What is 4Sports
A platform for managing sports tournaments and leagues. Three user roles:
- **Organizer** — creates and manages tournaments, teams, matches, results
- **Coach / Captain** — manages their team roster and participates in tournaments
- **Player** — finds teams to join, tracks personal stats and match history

Reference product: sportwey.com — but 4Sports differentiates with multi-sport support and a stronger player-finding-team experience.

## Stack decisions and why
| Decision | Reason |
|---|---|
| Bun over Node | Performance, native TypeScript, faster installs |
| ElysiaJS over Hono/Express | Built for Bun, best-in-class TypeScript inference, native WebSocket support |
| Drizzle over Prisma | Lightweight, SQL-first, edge-runtime compatible |
| BetterAuth | Handles OAuth (Google/Facebook) + sessions out of the box |
| NativeWind v4 + Tailwind v3 | Stable combination — v5+Tailwind v4 not production-ready yet |
| JSONB in Postgres | Used for: tournament settings, player field config, stats summary, fee config — avoids MongoDB |
| Cloudflare R2 | S3-compatible, no egress fees, integrated with CDN |
| Railway for API | Zero-ops deploys, auto SSL, affordable at early scale |

## Current milestone
See the roadmap in `agent_docs/project.md`. Target is **Hito 3 (MVP)**: a fully working tournament from registration to results with push notifications.

## Monorepo packages
Packages are internal only (`"private": true`). They are not published to npm.
Import them in apps using their workspace name: `import { X } from '@4sports/types'`
