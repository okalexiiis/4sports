# Graph Report - .  (2026-07-08)

## Corpus Check
- 379 files · ~93,439 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1573 nodes · 3378 edges · 85 communities (75 shown, 10 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.83)
- Token cost: 257,772 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Seed Data & Shared IDs|Seed Data & Shared IDs]]
- [[_COMMUNITY_Tournament Module|Tournament Module]]
- [[_COMMUNITY_API Core & Sandbox Notes|API Core & Sandbox Notes]]
- [[_COMMUNITY_Match Module & Queues|Match Module & Queues]]
- [[_COMMUNITY_Upload Module (R2)|Upload Module (R2)]]
- [[_COMMUNITY_Team Module|Team Module]]
- [[_COMMUNITY_Dispute Module|Dispute Module]]
- [[_COMMUNITY_Registration Module|Registration Module]]
- [[_COMMUNITY_Onboarding Module|Onboarding Module]]
- [[_COMMUNITY_Domain Error Codes|Domain Error Codes]]
- [[_COMMUNITY_Match Event Module|Match Event Module]]
- [[_COMMUNITY_API Dependencies|API Dependencies]]
- [[_COMMUNITY_Convocatoria Module|Convocatoria Module]]
- [[_COMMUNITY_Mobile Expo Dependencies|Mobile Expo Dependencies]]
- [[_COMMUNITY_Biome Config|Biome Config]]
- [[_COMMUNITY_Lineup Module|Lineup Module]]
- [[_COMMUNITY_Organization Repository|Organization Repository]]
- [[_COMMUNITY_Suspension Module|Suspension Module]]
- [[_COMMUNITY_Match Schema Enums|Match Schema Enums]]
- [[_COMMUNITY_Player Claim Module|Player Claim Module]]
- [[_COMMUNITY_Sport Event Type Module|Sport Event Type Module]]
- [[_COMMUNITY_Audit Logs & Enums|Audit Logs & Enums]]
- [[_COMMUNITY_Sports Module|Sports Module]]
- [[_COMMUNITY_Root Workspace Scripts|Root Workspace Scripts]]
- [[_COMMUNITY_Frontend Dev Guide|Frontend Dev Guide]]
- [[_COMMUNITY_Expo App Config|Expo App Config]]
- [[_COMMUNITY_OpenAPI Response Helpers|OpenAPI Response Helpers]]
- [[_COMMUNITY_Web Dependencies|Web Dependencies]]
- [[_COMMUNITY_Organization Use Cases|Organization Use Cases]]
- [[_COMMUNITY_Match Lifecycle Concepts|Match Lifecycle Concepts]]
- [[_COMMUNITY_Logger Package|Logger Package]]
- [[_COMMUNITY_API Package Manifest|API Package Manifest]]
- [[_COMMUNITY_Auth Guard & Invitations|Auth Guard & Invitations]]
- [[_COMMUNITY_Feature Guard & Payments|Feature Guard & Payments]]
- [[_COMMUNITY_Utils Package|Utils Package]]
- [[_COMMUNITY_API tsconfig|API tsconfig]]
- [[_COMMUNITY_Standings Module|Standings Module]]
- [[_COMMUNITY_Redis & Org Guards|Redis & Org Guards]]
- [[_COMMUNITY_Auth Context Routes|Auth Context Routes]]
- [[_COMMUNITY_Auth Entity & Repository|Auth Entity & Repository]]
- [[_COMMUNITY_Git Hooks & Tooling|Git Hooks & Tooling]]
- [[_COMMUNITY_Team Schema Tables|Team Schema Tables]]
- [[_COMMUNITY_Turbo Task Pipeline|Turbo Task Pipeline]]
- [[_COMMUNITY_Identity & Org Concepts|Identity & Org Concepts]]
- [[_COMMUNITY_Base tsconfig|Base tsconfig]]
- [[_COMMUNITY_Notification Workers|Notification Workers]]
- [[_COMMUNITY_Web tsconfig|Web tsconfig]]
- [[_COMMUNITY_Design System & Milestones|Design System & Milestones]]
- [[_COMMUNITY_Teams & Players Concepts|Teams & Players Concepts]]
- [[_COMMUNITY_Observability Stack|Observability Stack]]
- [[_COMMUNITY_Mobile tsconfig|Mobile tsconfig]]
- [[_COMMUNITY_Subscriptions & Payments Concepts|Subscriptions & Payments Concepts]]
- [[_COMMUNITY_Workspace Package Manifest|Workspace Package Manifest]]
- [[_COMMUNITY_Workspace Package Manifest|Workspace Package Manifest]]
- [[_COMMUNITY_Package tsconfig|Package tsconfig]]
- [[_COMMUNITY_Package tsconfig|Package tsconfig]]
- [[_COMMUNITY_Package tsconfig|Package tsconfig]]
- [[_COMMUNITY_Package tsconfig|Package tsconfig]]
- [[_COMMUNITY_API Conventions Docs|API Conventions Docs]]
- [[_COMMUNITY_Project Docs & CI|Project Docs & CI]]
- [[_COMMUNITY_Config Package Manifest|Config Package Manifest]]
- [[_COMMUNITY_React tsconfig|React tsconfig]]
- [[_COMMUNITY_Token & Fee Tables|Token & Fee Tables]]
- [[_COMMUNITY_Node tsconfig|Node tsconfig]]
- [[_COMMUNITY_Metro Config|Metro Config]]
- [[_COMMUNITY_Standings Tables|Standings Tables]]
- [[_COMMUNITY_Web Root Layout|Web Root Layout]]
- [[_COMMUNITY_Convocatoria Error Codes|Convocatoria Error Codes]]
- [[_COMMUNITY_Match Event Error Codes|Match Event Error Codes]]
- [[_COMMUNITY_Sport Event Type Error Codes|Sport Event Type Error Codes]]
- [[_COMMUNITY_Tournament Error Codes|Tournament Error Codes]]
- [[_COMMUNITY_Web Logger|Web Logger]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Bug Report Template|Bug Report Template]]
- [[_COMMUNITY_pnpm Workspace Definition|pnpm Workspace Definition]]

## God Nodes (most connected - your core abstractions)
1. `Ok` - 65 edges
2. `Result` - 65 edges
3. `DB` - 53 edges
4. `Err` - 46 edges
5. `DomainError` - 26 edges
6. `DrizzleOrganizationRepository` - 23 edges
7. `toApiResponse()` - 22 edges
8. `scripts` - 22 edges
9. `ApiResponses` - 21 edges
10. `matches` - 19 edges

## Surprising Connections (you probably didn't know these)
- `CLAUDE.md Project Instructions` --semantically_similar_to--> `AGENTS.md Agent Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `CLAUDE.md Project Instructions` --semantically_similar_to--> `Git Workflow (pre-push rebase + lockfile sync)`  [INFERRED] [semantically similar]
  CLAUDE.md → agent_docs/git-workflow.md
- `createNote()` --calls--> `Err`  [INFERRED]
  apps/api/src/_sandbox/note/use-cases/create-note.use-case.ts → packages/utils/src/result/result.ts
- `createNote()` --calls--> `Ok`  [INFERRED]
  apps/api/src/_sandbox/note/use-cases/create-note.use-case.ts → packages/utils/src/result/result.ts
- `deleteNote()` --calls--> `Err`  [INFERRED]
  apps/api/src/_sandbox/note/use-cases/delete-note.use-case.ts → packages/utils/src/result/result.ts

## Import Cycles
- 1-file cycle: `apps/api/src/index.ts -> apps/api/src/index.ts`

## Hyperedges (group relationships)
- **API Authorization Guard Chain** — agent_docs_api_routes_reference_auth_guard, agent_docs_api_routes_reference_org_guard, agent_docs_api_routes_reference_feature_guard, agent_docs_api_routes_reference_active_context, db_4sports_schema_v4_diagramas_organization_members [EXTRACTED 1.00]
- **Sanctions & Discipline Flow (ejection to confirmed suspension)** — agent_docs_prd_forces_game_ejection, agent_docs_prd_discipline_panel, db_4sports_schema_v4_diagramas_player_suspensions, hitos_hito_3_finish_match_transaction, db_4sports_schema_v4_diagramas_audit_logs [EXTRACTED 1.00]
- **Guest Profile Identity Lifecycle** — agent_docs_prd_guest_player_profile, agent_docs_prd_identity_linking, use_cases_4sports_uc_bloque3_equiposjugadores_guest_claim_flow, db_4sports_schema_v4_diagramas_players [EXTRACTED 1.00]
- **Local Observability Stack (Loki + Promtail + Grafana)** — observability_docker_compose_loki_service, observability_docker_compose_promtail_service, observability_docker_compose_grafana_service, observability_loki_config_loki_config, observability_promtail_config_api_logs_scrape, datasources_loki_loki_datasource [EXTRACTED 1.00]
- **Elysia Route Guard Plugins** — dev_docs_josue_dev_guide_authguard, dev_docs_josue_dev_guide_orgguard, dev_docs_josue_dev_guide_featureguard [EXTRACTED 1.00]
- **API JSON Log Flow (LOG_FILE -> Promtail -> Loki -> Grafana)** — observability_readme_log_file_env, observability_promtail_config_api_logs_scrape, observability_docker_compose_loki_service, observability_readme_logql_queries [EXTRACTED 1.00]

## Communities (85 total, 10 thin omitted)

### Community 0 - "Seed Data & Shared IDs"
Cohesion: 0.06
Nodes (67): DB, seedDummyEventTypes(), EVENT_TYPE_IDS, MATCH_IDS, ORG_IDS, PLAYER_IDS, STANDING_IDS, TEAM_IDS (+59 more)

### Community 1 - "Tournament Module"
Cohesion: 0.06
Nodes (48): repo, security, AuthStore, repo, TournamentErrors, DrizzleTournamentFormatRepository, rowToFormat(), TournamentFormat (+40 more)

### Community 2 - "API Core & Sandbox Notes"
Cohesion: 0.06
Nodes (44): repo, logger, NoteErrors, AnyServer, getBunServer(), setBunServer(), startWorkers(), requestLogger (+36 more)

### Community 3 - "Match Module & Queues"
Cohesion: 0.06
Nodes (48): security, AuthStore, repo, MatchErrors, AuditJobData, auditQueue, connection, NotificationJobData (+40 more)

### Community 4 - "Upload Module (R2)"
Cohesion: 0.06
Nodes (58): AuthStore, repo, Err, Ok, ALLOWED_CONTENT_TYPES, AllowedContentType, PresignedUrlResult, UploadContext (+50 more)

### Community 5 - "Team Module"
Cohesion: 0.09
Nodes (31): security, AuthStore, repo, TeamErrors, DrizzleTeamRepository, rowToTeam(), AddGuestPlayerInput, CreateTeamInput (+23 more)

### Community 6 - "Dispute Module"
Cohesion: 0.08
Nodes (31): security, AuthStore, repo, Dispute, DisputeStatus, CreateDisputeInput, IDisputeRepository, ResolveDisputeInput (+23 more)

### Community 7 - "Registration Module"
Cohesion: 0.09
Nodes (29): security, AuthStore, RegistrationErrorCodes, RegistrationErrors, DrizzleRegistrationRepository, rowToRegistration(), EligibilityAlert, PaginatedRegistrations (+21 more)

### Community 8 - "Onboarding Module"
Cohesion: 0.09
Nodes (31): repo, OnboardingErrors, DrizzleOnboardingRepository, OrgCreated, OrgOnboardingInput, PlayerOnboardingInput, PlayerProfile, SlugCheckResult (+23 more)

### Community 9 - "Domain Error Codes"
Cohesion: 0.07
Nodes (13): AuthErrorCodes, DisputeErrorCodes, LineupErrorCodes, MatchErrorCodes, NoteErrorCodes, OnboardingErrorCodes, OrgErrorCodes, PlayerClaimErrorCodes (+5 more)

### Community 10 - "Match Event Module"
Cohesion: 0.10
Nodes (22): security, MatchEventErrors, DrizzleMatchEventRepository, CreateMatchEventInput, MatchEvent, IMatchEventRepository, matchCaptureGuard(), matchRepo (+14 more)

### Community 11 - "API Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, better-auth, @better-auth/drizzle-adapter, bullmq, drizzle-orm, elysia (+28 more)

### Community 12 - "Convocatoria Module"
Cohesion: 0.12
Nodes (22): security, AuthStore, repo, Convocatoria, ConvocatoriaResponse, UpsertConvocatoriaInput, IConvocatoriaRepository, DrizzleConvocatoriaRepository (+14 more)

### Community 13 - "Mobile Expo Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @4sports/logger, expo, expo-asset, expo-constants, expo-dev-client, expo-linking, @expo/metro-runtime (+25 more)

### Community 14 - "Biome Config"
Cohesion: 0.06
Nodes (31): source, assist, actions, files, includes, formatter, enabled, indentStyle (+23 more)

### Community 15 - "Lineup Module"
Cohesion: 0.12
Nodes (20): security, repo, LineupErrors, publishToMatch(), DrizzleLineupRepository, LineupEntry, LineupPlayerInput, LineupRole (+12 more)

### Community 16 - "Organization Repository"
Cohesion: 0.10
Nodes (10): betterAuthUsers, DrizzleOrganizationRepository, AuditLogInput, CreateOrgInput, InvitationRecord, InviteMemberInput, Organization, OrgMember (+2 more)

### Community 17 - "Suspension Module"
Cohesion: 0.14
Nodes (18): security, AuthStore, repo, SuspensionErrors, DrizzleSuspensionRepository, rowToSuspension(), Suspension, ConfirmSuspensionInput (+10 more)

### Community 18 - "Match Schema Enums"
Cohesion: 0.12
Nodes (17): assignmentRoleEnum, convocatoriaResponseEnum, disputeStatusEnum, lineupRoleEnum, matchStatusEnum, matchAssignments, matchConvocatorias, matchDisputes (+9 more)

### Community 19 - "Player Claim Module"
Cohesion: 0.17
Nodes (10): AuthStore, PlayerClaimErrors, DrizzlePlayerClaimRepository, rowToClaim(), ClaimStatus, PlayerClaim, PlayerForClaim, IPlayerClaimRepository (+2 more)

### Community 20 - "Sport Event Type Module"
Cohesion: 0.15
Nodes (13): repo, createVersion(), DrizzleSportEventTypeRepository, SportEventType, ISportEventTypeRepository, listSportEventTypes(), matchesV1Routes, organizationsV1Routes (+5 more)

### Community 21 - "Audit Logs & Enums"
Cohesion: 0.15
Nodes (16): auditLogs, inet, auditActionEnum, bracketTypeEnum, eligibilityModeEnum, genderRestrictionEnum, membershipStatusEnum, notificationChannelEnum (+8 more)

### Community 22 - "Sports Module"
Cohesion: 0.17
Nodes (12): repo, SportErrors, DrizzleSportsRepository, Sport, SportPosition, ISportsRepository, listSports(), getSportDetail (+4 more)

### Community 23 - "Root Workspace Scripts"
Cohesion: 0.09
Nodes (22): scripts, build, check, dev, dev:api, dev:mobile, dev:tui, dev:web (+14 more)

### Community 24 - "Frontend Dev Guide"
Cohesion: 0.11
Nodes (21): .expo Local Folder, Elysia with Bun Runtime Template, BetterAuth Session Cookie Authentication (Client Side), Expo Router v4 File-Based Navigation, Frontend Dev Guide (Garib & Ivan), NativeWind v4 + Tailwind v3 Styling Stack, Interactive API Documentation URLs, Primary Color Tokens (tailwind.config.js) (+13 more)

### Community 25 - "Expo App Config"
Cohesion: 0.10
Nodes (20): backgroundColor, adaptiveIcon, package, expo, android, icon, ios, name (+12 more)

### Community 26 - "OpenAPI Response Helpers"
Cohesion: 0.12
Nodes (12): security, ApiResponses, ErrorBody, PaginationMeta, listSportEventTypesDetail, listTournamentFormatsDetail, requestClaimDetail, reviewClaimDetail (+4 more)

### Community 27 - "Web Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, @4sports/logger, next, react, react-dom, devDependencies, @types/node, @types/react (+11 more)

### Community 28 - "Organization Use Cases"
Cohesion: 0.33
Nodes (6): OrgErrors, ListMembersResult, IOrganizationRepository, Result, RESTRICTED_ROLES, RESTRICTED_ROLES

### Community 29 - "Match Lifecycle Concepts"
Cohesion: 0.17
Nodes (17): forces_game_ejection Sanction Flag, Tournament Lifecycle States, Walkover Resolution, matches table, standings table (computed on the fly), tournaments table, BullMQ Notification & Audit Queues, Match Finish Atomic Transaction (+9 more)

### Community 30 - "Logger Package"
Cohesion: 0.12
Nodes (16): dependencies, pino, devDependencies, pino-pretty, exports, ./native, name, private (+8 more)

### Community 31 - "API Package Manifest"
Cohesion: 0.12
Nodes (16): dependencies, @elysia/openapi, @sinclair/typebox, engines, node, lint-staged, *.json, *.{ts,tsx,js,jsx} (+8 more)

### Community 32 - "Auth Guard & Invitations"
Cohesion: 0.17
Nodes (10): AuthStore, authGuard(), getPresignedUrlDetail, acceptInvitationDetail, rejectInvitationDetail, AuthStore, invitationsV1Routes, repo (+2 more)

### Community 33 - "Feature Guard & Payments"
Cohesion: 0.15
Nodes (11): registrationStatusEnum, subscriptionStatusEnum, organizationMembers, organizerSubscriptions, feeInvoices, paymentRecords, paymentWebhooks, subscriptionPlanHistory (+3 more)

### Community 34 - "Utils Package"
Cohesion: 0.12
Nodes (15): dependencies, @4sports/logger, exports, ./logger, ./result, name, private, scripts (+7 more)

### Community 35 - "API tsconfig"
Cohesion: 0.13
Nodes (14): compilerOptions, outDir, paths, rootDir, exclude, extends, include, @/* (+6 more)

### Community 36 - "Standings Module"
Cohesion: 0.16
Nodes (12): security, activeOrgGuard(), getGroupStandingsDetail, getStandingsDetail, recalculateStandingsDetail, enrichEntries(), loadEnrichedEntries(), RawEntry (+4 more)

### Community 37 - "Redis & Org Guards"
Cohesion: 0.17
Nodes (10): redis, AuthErrors, MatchWsPayload, ActiveContext, OrgRole, ROLE_HIERARCHY, ActiveContext, orgGuard() (+2 more)

### Community 38 - "Auth Context Routes"
Cohesion: 0.16
Nodes (11): repo, getMe(), ActiveContextSchema, getMeDetail, setContextDetail, authV1Routes, ActiveContextSchema, ContextBodySchema (+3 more)

### Community 39 - "Auth Entity & Repository"
Cohesion: 0.30
Nodes (7): ActiveContext, MeData, OrgMembership, ProfileData, UserIdentity, IAuthRepository, DrizzleAuthRepository

### Community 40 - "Git Hooks & Tooling"
Cohesion: 0.14
Nodes (12): husky.sh script, devDependencies, @biomejs/biome, @commitlint/cli, @commitlint/config-conventional, husky, lint-staged, turbo (+4 more)

### Community 41 - "Team Schema Tables"
Cohesion: 0.21
Nodes (10): teamMemberRoleEnum, teamScopeEnum, playerStatValues, captainInviteTokens, players, teamInvitations, teamJoinRequests, teamMemberPositions (+2 more)

### Community 42 - "Turbo Task Pipeline"
Cohesion: 0.15
Nodes (13): dependsOn, outputs, dependsOn, cache, persistent, dependsOn, tasks, build (+5 more)

### Community 43 - "Identity & Org Concepts"
Cohesion: 0.23
Nodes (12): Active Org Context in Redis (context:{userId}), orgGuard(minRole), Identity UC Gap Analysis (Hito 1), Hybrid Roles & Permissions Model, audit_logs table (append-only), organization_members table, organizations table, profiles table (+4 more)

### Community 44 - "Base tsconfig"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, esModuleInterop, module, moduleResolution, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 45 - "Notification Workers"
Cohesion: 0.29
Nodes (9): connection, getMatchPlayerUserIds(), getOrgAdminUserIds(), handleDisputeOpened(), handleDisputeResolved(), handleMatchFinished(), handleMatchRescheduled(), handleSuspensionConfirmed() (+1 more)

### Community 46 - "Web tsconfig"
Cohesion: 0.17
Nodes (11): compilerOptions, paths, plugins, exclude, extends, include, @/*, @4sports/types (+3 more)

### Community 47 - "Design System & Milestones"
Cohesion: 0.24
Nodes (11): Team Roles (Alexis, Josue, Garib, Ivan), R2 Presigned Upload Gap (blocking UC-002/003), Schema v4 Module Diagrams, Dark-First Dual Theme, 4Sports Design System (DESIGN.md), CSS Design Tokens (dark/light), Bebas Neue / DM Sans Typography Scale, Volt & Ember Brand Palette (+3 more)

### Community 48 - "Teams & Players Concepts"
Cohesion: 0.24
Nodes (11): Panel de Disciplina, Perfil Puente (Guest Player), Identity Linking Rule (never auto-merge), player_suspensions table (org-scoped), players table (is_guest), team_members table, Convocatoria & Tactical Lineup (UC-208/UC-209), Guest Profile Claim Flow (UC-205) (+3 more)

### Community 49 - "Observability Stack"
Cohesion: 0.31
Nodes (11): Grafana Loki Datasource Provisioning, Grafana Service (4sports-grafana, host port 3001), Loki Service (4sports-loki, port 3100), Promtail Service (4sports-promtail), Loki Single-Node Config (tsdb + filesystem), Promtail api_logs Scrape Config, Pino Numeric Level to String Mapping, LOG_FILE Environment Variable (+3 more)

### Community 50 - "Mobile tsconfig"
Cohesion: 0.18
Nodes (10): compilerOptions, paths, exclude, extends, include, @/*, @4sports/types, @4sports/ui (+2 more)

### Community 51 - "Subscriptions & Payments Concepts"
Cohesion: 0.22
Nodes (10): featureGuard(feature), Motor de Elegibilidad, Modo Liquidación (subscription expiry), No-Intermediary Payment Model, Product Requirements Document v1.0, Protected Tournament Lifecycle (created_under_plan), Roster Validation Modes (strict/flexible/hybrid), Subscription Plans (Free/Starter/Pro/Elite) (+2 more)

### Community 52 - "Workspace Package Manifest"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, check, dev, lint, typecheck (+1 more)

### Community 53 - "Workspace Package Manifest"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, check, dev, lint, typecheck (+1 more)

### Community 54 - "Package tsconfig"
Cohesion: 0.22
Nodes (8): compilerOptions, allowImportingTsExtensions, noEmit, outDir, rootDir, exclude, extends, include

### Community 55 - "Package tsconfig"
Cohesion: 0.22
Nodes (8): compilerOptions, allowImportingTsExtensions, noEmit, outDir, rootDir, exclude, extends, include

### Community 56 - "Package tsconfig"
Cohesion: 0.22
Nodes (8): compilerOptions, allowImportingTsExtensions, noEmit, outDir, rootDir, exclude, extends, include

### Community 57 - "Package tsconfig"
Cohesion: 0.22
Nodes (8): compilerOptions, allowImportingTsExtensions, noEmit, outDir, rootDir, exclude, extends, include

### Community 58 - "API Conventions Docs"
Cohesion: 0.25
Nodes (8): authGuard (BetterAuth session check), API Error Codes Catalog, requestLogger Global Plugin, Standard API Response Format ({data}/{error}/meta), API Routes & Use-Cases Reference, Standard Pagination Format (page/limit + meta), Project Setup Guide (README), BetterAuth Flows (UC-001/001B/001C/001D)

### Community 59 - "Project Docs & CI"
Cohesion: 0.32
Nodes (8): Git Workflow (pre-push rebase + lockfile sync), Project Context & Stack Decisions, AGENTS.md Agent Instructions, CLAUDE.md Project Instructions, Layered API Architecture (routes -> use-case -> repository), Domain Module Folder Structure, CI Pipeline (Biome lint, typecheck, Turbo build), Commit Lint Workflow (PR title + commits)

### Community 60 - "Config Package Manifest"
Cohesion: 0.29
Nodes (6): name, private, scripts, check, lint, version

### Community 61 - "React tsconfig"
Cohesion: 0.40
Nodes (4): compilerOptions, jsx, lib, extends

### Community 62 - "Token & Fee Tables"
Cohesion: 0.50
Nodes (4): referee_session_token Access, captain_invite_tokens table, fee_invoices table, teams table

### Community 63 - "Node tsconfig"
Cohesion: 0.50
Nodes (3): compilerOptions, types, extends

### Community 64 - "Metro Config"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

## Knowledge Gaps
- **459 isolated node(s):** `husky.sh script`, `name`, `version`, `private`, `dev` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Result` connect `Organization Use Cases` to `Seed Data & Shared IDs`, `Tournament Module`, `API Core & Sandbox Notes`, `Match Module & Queues`, `Upload Module (R2)`, `Team Module`, `Dispute Module`, `Registration Module`, `Onboarding Module`, `Domain Error Codes`, `Match Event Module`, `Convocatoria Module`, `Lineup Module`, `Suspension Module`, `Player Claim Module`, `Sport Event Type Module`, `Sports Module`, `Redis & Org Guards`, `Auth Entity & Repository`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `DB` connect `Seed Data & Shared IDs` to `Tournament Module`, `Match Module & Queues`, `Team Module`, `Dispute Module`, `Registration Module`, `Onboarding Module`, `Match Event Module`, `Convocatoria Module`, `Lineup Module`, `Organization Repository`, `Suspension Module`, `Player Claim Module`, `Sport Event Type Module`, `Sports Module`, `Feature Guard & Payments`, `Standings Module`, `Redis & Org Guards`, `Auth Entity & Repository`, `Notification Workers`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `toApiResponse()` connect `API Core & Sandbox Notes` to `Auth Guard & Invitations`, `Tournament Module`, `Match Module & Queues`, `Upload Module (R2)`, `Standings Module`, `Auth Context Routes`, `Dispute Module`, `Onboarding Module`, `Registration Module`, `Match Event Module`, `Team Module`, `Convocatoria Module`, `Lineup Module`, `Suspension Module`, `Player Claim Module`, `Sport Event Type Module`, `Sports Module`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 63 inferred relationships involving `Ok` (e.g. with `acceptInvitation()` and `addGuestPlayer()`) actually correct?**
  _`Ok` has 63 INFERRED edges - model-reasoned connections that need verification._
- **Are the 44 inferred relationships involving `Err` (e.g. with `acceptInvitation()` and `addGuestPlayer()`) actually correct?**
  _`Err` has 44 INFERRED edges - model-reasoned connections that need verification._
- **What connects `husky.sh script`, `name`, `version` to the rest of the system?**
  _459 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Seed Data & Shared IDs` be split into smaller, more focused modules?**
  _Cohesion score 0.0566880217433508 - nodes in this community are weakly interconnected._