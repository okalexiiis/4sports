-- ============================================================
-- 4Sports — Database Schema v4
-- PostgreSQL 16 · Drizzle ORM · BetterAuth
--
-- Cambios respecto a v3:
-- GAP-001  profiles: onboarding_completed_at, initial_intent
-- GAP-002  organization_members: invitation_expires_at
-- GAP-101  tournaments: wizard_step, wizard_completed_at, tags, created_under_plan
-- GAP-102  stages: transition_status, transition_validated_at, transition_validated_by
-- GAP-103  tournaments: tags TEXT[]
-- GAP-104  tournaments.settings: documentado walkover_score en JSONB
-- GAP-105  Índices de standings optimizados
-- GAP-201  tournaments.settings: transfer_window config en JSONB
-- GAP-202  NUEVA TABLA: match_convocatorias
-- GAP-203  NUEVA TABLA: match_lineups
-- GAP-204  team_members: join_type, transfer_approved_by, transfer_approved_at
-- GAP-205  team_invitations: tournament_id
-- GAP-401  match_status ENUM: +pending_review, +disputed
-- GAP-402  NUEVA TABLA: match_disputes
-- GAP-403  tournaments.settings: dispute_window_hours en JSONB
-- GAP-404  tournament_metrics: forces_game_ejection, suspension_matches
-- GAP-405  NUEVA TABLA: player_suspensions
-- GAP-406  Índice optimizado para WebSocket de eventos
-- GAP-407  matches: captured_by, capture_role
-- GAP-408  player_stat_values / team_stat_values: is_draft, confirmed_at, confirmed_by
-- GAP-409  player_stat_values: period_index
-- GAP-501  organizations / tournaments: gateway_type, gateway_account_id
-- GAP-502  tournaments.settings: financial_tolerance en JSONB
-- GAP-503  tournament_registrations: financial_hold, financial_hold_at, financial_hold_reason
-- GAP-504  NUEVA TABLA: payment_webhooks (cubre también GAP-701)
-- GAP-505  tournament_fee_items: min_partial_payment
-- GAP-506  payment_status ENUM: +processing
-- GAP-601  notifications: is_public, announcement_type, audience_segment, audience_filter
-- GAP-602  NUEVA TABLA: notification_types
-- GAP-604  notification_deliveries: attempt_count, next_retry_at, max_attempts
-- GAP-606  fcm_tokens: platform, app_version
-- GAP-702  organizer_subscriptions: pending_plan_id, pending_change_at, pending_change_type
-- GAP-703  organizer_subscriptions: last_downgrade_abort_at, last_downgrade_abort_reason
-- GAP-704  Índice de renovaciones próximas
-- GAP-706  NUEVA TABLA: subscription_plan_history
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
-- PostGIS se activa en Hito 4 cuando haya mapa de canchas
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- ENUMS
-- v4: match_status +pending_review +disputed
--     payment_status +processing
-- ============================================================

CREATE TYPE org_role AS ENUM ('owner', 'admin', 'organizer', 'coach', 'viewer');
CREATE TYPE team_role AS ENUM ('captain', 'coach', 'player', 'substitute');
CREATE TYPE ownership_scope AS ENUM ('tournament_scoped', 'organization_scoped', 'user_scoped', 'verified_global');
CREATE TYPE tournament_status AS ENUM ('draft', 'private', 'open_registration', 'active', 'completed', 'archived');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected', 'waitlisted', 'withdrawn');
CREATE TYPE membership_status AS ENUM ('invited', 'pending', 'active', 'suspended', 'left');

-- GAP-401: +pending_review (capitán reportó sin árbitro), +disputed (resultado en disputa)
CREATE TYPE match_status AS ENUM (
    'scheduled', 'in_progress', 'pending_review',
    'completed', 'disputed', 'cancelled', 'forfeit'
);

-- GAP-506: +processing (pago iniciado, esperando confirmación de webhook)
CREATE TYPE payment_status AS ENUM (
    'processing', 'pending', 'confirmed', 'failed', 'refunded', 'partial_refund'
);

CREATE TYPE payment_method_type AS ENUM ('manual', 'transfer', 'cash', 'stripe', 'mercadopago', 'spei', 'other');
CREATE TYPE fee_type AS ENUM ('per_team', 'per_match', 'per_tournament');
CREATE TYPE invoice_status AS ENUM ('pending', 'partial', 'paid', 'cancelled', 'waived');
CREATE TYPE venue_verification_status AS ENUM ('unverified', 'pending_verification', 'verified', 'disputed');
CREATE TYPE venue_scope AS ENUM ('tournament_scoped', 'organization_scoped', 'verified_global');
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push', 'sms');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'read');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'cancelled', 'expired');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'restore', 'approve', 'reject', 'archive', 'lock');
CREATE TYPE conflict_severity AS ENUM ('none', 'low', 'medium', 'high', 'critical');

-- ============================================================
-- MODULE 1: IDENTITY
-- BetterAuth genera: user, session, account, verification
-- ============================================================

-- GAP-001: +onboarding_completed_at, +initial_intent
-- GAP-003: +initial_intent registra si el usuario se registró como jugador u organizador
CREATE TABLE profiles (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 TEXT NOT NULL UNIQUE,       -- FK a user.id de BetterAuth
    username                VARCHAR(40) UNIQUE,
    avatar_url              TEXT,                       -- Cloudflare R2
    phone                   VARCHAR(20),
    city                    VARCHAR(80),
    country_code            CHAR(2),
    is_looking_for_team     BOOLEAN DEFAULT FALSE,
    -- GAP-001: estado de onboarding
    initial_intent          TEXT,                       -- 'player' | 'organizer'
    onboarding_completed_at TIMESTAMPTZ,               -- null = onboarding pendiente
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 2: ORGANIZATIONS
-- ============================================================

-- GAP-501: +gateway_type, +gateway_account_id para pasarela de pagos
CREATE TABLE organizations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT,
    logo_url            TEXT,                           -- Cloudflare R2
    website_url         TEXT,
    country_code        CHAR(2),
    city                TEXT,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    -- GAP-501: pasarela de pago a nivel de organización
    gateway_type        TEXT,                           -- 'stripe' | 'mercadopago' | null
    gateway_account_id  TEXT,                           -- external account ID (cifrado en app)
    gateway_connected_at    TIMESTAMPTZ,
    gateway_connected_by    TEXT,                       -- user.id del owner que conectó
    metadata            JSONB DEFAULT '{}',
    created_by          TEXT NOT NULL,                  -- user.id del creador
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

-- GAP-002: +invitation_expires_at para invitaciones sin TTL
CREATE TABLE organization_members (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id         UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id                 TEXT NOT NULL,              -- user.id de BetterAuth
    role                    org_role NOT NULL DEFAULT 'viewer',
    tournament_ids          UUID[] DEFAULT '{}',        -- torneos asignados si es organizer
    invited_by              TEXT,                       -- user.id quien invitó
    -- GAP-002: expiración de invitaciones pendientes
    invitation_expires_at   TIMESTAMPTZ,               -- null = sin expiración
    joined_at               TIMESTAMPTZ,
    status                  membership_status NOT NULL DEFAULT 'invited',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- Permisos granulares (RBAC — activo desde Hito 5)
CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    description TEXT,
    module      TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role            org_role NOT NULL,
    permission_id   UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- ============================================================
-- MODULE 3: SPORTS
-- ============================================================

CREATE TABLE sports (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    icon_url    TEXT,
    -- metadata contiene: default_tiebreaker[], default_points_win/draw/loss,
    -- default_metrics[], suspension_rules por tipo de evento
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sport_positions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id    UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    name        VARCHAR(60) NOT NULL,
    is_default  BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tournament_formats (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL UNIQUE,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT,
    supports_groups     BOOLEAN NOT NULL DEFAULT FALSE,
    supports_playoffs   BOOLEAN NOT NULL DEFAULT FALSE,
    config_schema       JSONB DEFAULT '{}',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 4: TOURNAMENTS
-- ============================================================

-- GAP-101: +wizard_step, +wizard_completed_at para reanudar asistente
-- GAP-103: +tags para etiquetas de contexto (Femenil, Sub-17, Veteranos)
-- GAP-501: +override_billing_account, +gateway_type, +gateway_account_id
-- created_under_plan ya existía — documentado aquí explícitamente
--
-- settings JSONB documenta los campos esperados:
-- {
--   points_win, points_draw, points_loss,
--   tiebreaker[],
--   has_third_place_match,
--   sets_to_win,
--   rounds_per_match,
--   walkover_score: { winner: 3, loser: 0 },   -- GAP-104
--   dispute_window_hours: 48,                   -- GAP-403
--   financial_tolerance: {                      -- GAP-502
--     enabled, max_debt_amount, min_payment_percentage,
--     enforcement_from_round, action
--   },
--   transfer_window: {                          -- GAP-201
--     enabled, start_date, end_date, max_round, requires_approval
--   }
-- }
CREATE TABLE tournaments (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id             UUID NOT NULL REFERENCES organizations(id),
    sport_id                    UUID NOT NULL REFERENCES sports(id),
    format_id                   UUID NOT NULL REFERENCES tournament_formats(id),
    name                        TEXT NOT NULL,
    slug                        TEXT NOT NULL,
    description                 TEXT,
    rules_pdf_url               TEXT,
    banner_url                  TEXT,
    status                      tournament_status NOT NULL DEFAULT 'draft',
    -- Fechas
    registration_opens_at       TIMESTAMPTZ,
    registration_closes_at      TIMESTAMPTZ,
    starts_at                   TIMESTAMPTZ,
    ends_at                     TIMESTAMPTZ,
    -- Límites
    max_teams                   INT,
    min_teams                   INT DEFAULT 2,
    max_players_per_team        INT,
    min_players_per_team        INT,
    -- Elegibilidad
    min_age                     INT,
    max_age                     INT,
    gender_restriction          TEXT DEFAULT 'none',
    validation_mode             TEXT DEFAULT 'hybrid', -- 'strict' | 'flexible' | 'hybrid'
    eligibility_mode            TEXT DEFAULT 'flexible', -- 'flexible' | 'strict'
    -- Campos de jugadores visibles/requeridos por torneo
    player_fields               JSONB DEFAULT '{}',
    -- GAP-103: tags de contexto (texto plano para filtros)
    tags                        TEXT[] DEFAULT '{}',
    -- Clonación (activo desde Hito 4)
    clone_from_tournament_id    UUID REFERENCES tournaments(id),
    is_template                 BOOLEAN NOT NULL DEFAULT FALSE,
    -- Lifecycle
    archived_at                 TIMESTAMPTZ,
    locked_at                   TIMESTAMPTZ,
    -- Plan bajo el cual fue publicado — inmutable post-publicación
    created_under_plan          TEXT,                   -- 'free' | 'starter' | 'pro' | 'elite'
    -- GAP-101: estado del asistente de creación
    wizard_step                 INT DEFAULT 1,          -- 1=info 2=formato 3=elegib. 4=inscr. 5=campos 6=revisión
    wizard_completed_at         TIMESTAMPTZ,            -- null = borrador incompleto
    -- Acceso
    is_public                   BOOLEAN NOT NULL DEFAULT TRUE,
    requires_approval           BOOLEAN NOT NULL DEFAULT FALSE,
    allow_external_teams        BOOLEAN NOT NULL DEFAULT FALSE,
    join_code                   VARCHAR(12) UNIQUE,
    -- Configuración dinámica (ver comentario arriba para estructura completa)
    settings                    JSONB DEFAULT '{}',
    fee_config                  JSONB DEFAULT '{}',
    -- GAP-501: pasarela de pago propia del torneo (override)
    override_billing_account    BOOLEAN NOT NULL DEFAULT FALSE,
    gateway_type                TEXT,                   -- si override: 'stripe' | 'mercadopago'
    gateway_account_id          TEXT,                   -- si override: account ID propio
    gateway_connected_at        TIMESTAMPTZ,
    metadata                    JSONB DEFAULT '{}',
    created_by                  TEXT NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, slug)
);

CREATE TABLE tournament_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    min_age         INT,
    max_age         INT,
    gender          TEXT,
    max_teams       INT,
    entry_fee       INT DEFAULT 0,
    currency        CHAR(3) DEFAULT 'MXN',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-404: +forces_game_ejection, +suspension_matches
CREATE TABLE tournament_metrics (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id           UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name                    VARCHAR(60) NOT NULL,
    slug                    VARCHAR(60) NOT NULL,
    description             TEXT,
    scope                   TEXT NOT NULL,              -- 'player' | 'team' | 'match'
    data_type               TEXT NOT NULL DEFAULT 'integer',
    unit                    TEXT,
    is_cumulative           BOOLEAN NOT NULL DEFAULT TRUE,
    affects_standings       BOOLEAN DEFAULT FALSE,
    display_order           INT DEFAULT 0,
    is_default              BOOLEAN DEFAULT FALSE,
    -- GAP-404: mecánica de expulsión y suspensión
    forces_game_ejection    BOOLEAN NOT NULL DEFAULT FALSE,
    -- true = el jugador es bloqueado en tiempo real del partido en curso
    suspension_matches      INT DEFAULT 0,
    -- partidos de suspensión sugeridos por defecto para este tipo de evento
    -- 0 = solo expulsión del partido, sin suspensión adicional
    stat_visibility         TEXT DEFAULT 'public',      -- 'public' | 'private'
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tournament_id, slug)
);

-- ============================================================
-- MODULE 5: VENUES / CANCHAS
-- ============================================================

CREATE TABLE venues (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope               venue_scope NOT NULL DEFAULT 'tournament_scoped',
    organization_id     UUID REFERENCES organizations(id),
    tournament_id       UUID REFERENCES tournaments(id),
    owned_by_user_id    TEXT REFERENCES profiles(user_id),
    name                TEXT NOT NULL,
    address             TEXT,
    city                TEXT,
    state               TEXT,
    country_code        CHAR(2),
    postal_code         TEXT,
    -- PostGIS — se activa en Hito 4
    -- location          GEOGRAPHY(POINT, 4326),
    verification_status venue_verification_status NOT NULL DEFAULT 'unverified',
    verified_at         TIMESTAMPTZ,
    verified_by         TEXT,
    capacity            INT,
    surface_type        TEXT,
    amenities           JSONB DEFAULT '[]',
    photos              JSONB DEFAULT '[]',
    metadata            JSONB DEFAULT '{}',
    created_by          TEXT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT chk_venue_scope CHECK (
        (scope = 'tournament_scoped' AND tournament_id IS NOT NULL) OR
        (scope = 'organization_scoped' AND organization_id IS NOT NULL) OR
        (scope = 'verified_global') OR
        (scope = 'user_scoped' AND owned_by_user_id IS NOT NULL)
    )
);

CREATE TABLE venue_disputes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id        UUID NOT NULL REFERENCES venues(id),
    reported_by     TEXT NOT NULL,
    reason          TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'open',
    resolved_at     TIMESTAMPTZ,
    resolved_by     TEXT,
    resolution_notes TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 6: TEAMS
-- ============================================================

CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope           ownership_scope NOT NULL DEFAULT 'tournament_scoped',
    organization_id UUID REFERENCES organizations(id),
    tournament_id   UUID REFERENCES tournaments(id),
    owned_by_user_id TEXT,
    name            TEXT NOT NULL,
    short_name      TEXT,
    slug            VARCHAR(120) UNIQUE,
    logo_url        TEXT,
    primary_color   CHAR(7),
    secondary_color CHAR(7),
    country_code    CHAR(2),
    city            TEXT,
    gender_type     TEXT DEFAULT 'mixed',
    join_policy     TEXT NOT NULL DEFAULT 'request',
    join_code       VARCHAR(12) UNIQUE,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}',
    created_by      TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE players (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             TEXT,
    display_name        TEXT NOT NULL,
    first_name          TEXT,
    last_name           TEXT,
    date_of_birth       DATE,
    sex                 TEXT,
    nationality         CHAR(2),
    avatar_url          TEXT,
    email               TEXT,
    phone               TEXT,
    jersey_number       INT,
    preferred_position  TEXT,
    is_guest            BOOLEAN NOT NULL DEFAULT FALSE,
    guest_created_by    TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT chk_player_identity CHECK (
        user_id IS NOT NULL OR is_guest = TRUE
    )
);

-- GAP-204: +join_type, +transfer_approved_by, +transfer_approved_at
CREATE TABLE team_members (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id                 UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id               UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    role                    team_role NOT NULL DEFAULT 'player',
    jersey_number           INT,
    position                TEXT,
    status                  membership_status NOT NULL DEFAULT 'invited',
    approved_by             TEXT,
    approved_at             TIMESTAMPTZ,
    joined_at               TIMESTAMPTZ,
    left_at                 TIMESTAMPTZ,
    -- GAP-204: tipo de ingreso y datos de transferencia
    join_type               TEXT DEFAULT 'direct',
    -- 'direct' | 'invitation' | 'request' | 'transfer' | 'token'
    transfer_approved_by    TEXT,                       -- user.id del organizador
    transfer_approved_at    TIMESTAMPTZ,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (team_id, player_id),
    CONSTRAINT chk_jersey_number CHECK (jersey_number IS NULL OR jersey_number BETWEEN 0 AND 999)
);

CREATE TABLE team_member_positions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id      UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    sport_position_id   UUID REFERENCES sport_positions(id) ON DELETE SET NULL,
    custom_position     TEXT
);

CREATE TABLE team_join_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id         TEXT NOT NULL,
    message         TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    reviewed_by     TEXT,
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-205: +tournament_id para invitaciones en contexto de torneo específico
CREATE TABLE team_invitations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    -- GAP-205: contexto de torneo específico (null = invitación general)
    tournament_id   UUID REFERENCES tournaments(id),
    invited_by      TEXT NOT NULL,
    invited_user_id TEXT,
    invited_email   TEXT,
    role            team_role NOT NULL DEFAULT 'player',
    token           TEXT UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    accepted_at     TIMESTAMPTZ,
    declined_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_invitation_target CHECK (
        invited_user_id IS NOT NULL OR invited_email IS NOT NULL
    )
);

CREATE TABLE captain_invite_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    token           VARCHAR(64) UNIQUE NOT NULL,
    created_by      TEXT NOT NULL,
    is_used         BOOLEAN DEFAULT FALSE,
    expires_at      TIMESTAMPTZ,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 7: TOURNAMENT REGISTRATIONS
-- ============================================================

-- GAP-503: +financial_hold, +financial_hold_at, +financial_hold_reason
CREATE TABLE tournament_registrations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id           UUID NOT NULL REFERENCES tournaments(id),
    team_id                 UUID NOT NULL REFERENCES teams(id),
    category_id             UUID REFERENCES tournament_categories(id),
    status                  registration_status NOT NULL DEFAULT 'pending',
    seed                    INT,
    is_external             BOOLEAN NOT NULL DEFAULT FALSE,
    registered_by           TEXT NOT NULL,
    approved_by             TEXT,
    approved_at             TIMESTAMPTZ,
    rejection_reason        TEXT,
    -- GAP-503: bloqueo financiero activo
    financial_hold          BOOLEAN NOT NULL DEFAULT FALSE,
    financial_hold_at       TIMESTAMPTZ,
    financial_hold_reason   TEXT,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tournament_id, team_id)
);

CREATE TABLE tournament_venues (
    tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, venue_id)
);

-- ============================================================
-- MODULE 8: STAGES, BRACKETS, ROUNDS, MATCHES
-- ============================================================

-- GAP-102: +transition_status, +transition_validated_at, +transition_validated_by
CREATE TABLE stages (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id               UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name                        TEXT NOT NULL,
    stage_type                  TEXT NOT NULL,
    order_index                 INT NOT NULL DEFAULT 0,
    format_config               JSONB DEFAULT '{}',
    starts_at                   TIMESTAMPTZ,
    ends_at                     TIMESTAMPTZ,
    is_active                   BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at                TIMESTAMPTZ,
    -- GAP-102: estado de transición Grupos → Playoffs
    transition_status           TEXT DEFAULT 'not_started',
    -- 'not_started' | 'groups_pending_validation' | 'playoffs_generated'
    transition_validated_at     TIMESTAMPTZ,
    transition_validated_by     TEXT,                   -- user.id del organizador
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE groups (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id    UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_teams (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id    UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    team_id     UUID NOT NULL REFERENCES teams(id),
    seed        INT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (group_id, team_id)
);

CREATE TABLE brackets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id        UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    bracket_type    TEXT NOT NULL DEFAULT 'winners',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rounds (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bracket_id  UUID REFERENCES brackets(id) ON DELETE CASCADE,
    stage_id    UUID REFERENCES stages(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    best_of     INT NOT NULL DEFAULT 1,
    starts_at   TIMESTAMPTZ,
    ends_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_round_parent CHECK (bracket_id IS NOT NULL OR stage_id IS NOT NULL)
);

-- GAP-401: status ahora usa el enum actualizado con pending_review y disputed
-- GAP-407: +captured_by, +capture_role
CREATE TABLE matches (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id           UUID NOT NULL REFERENCES tournaments(id),
    stage_id                UUID NOT NULL REFERENCES stages(id),
    round_id                UUID REFERENCES rounds(id),
    bracket_id              UUID REFERENCES brackets(id),
    group_id                UUID REFERENCES groups(id),
    home_team_id            UUID REFERENCES teams(id),
    away_team_id            UUID REFERENCES teams(id),
    next_match_id           UUID REFERENCES matches(id),
    loser_next_match_id     UUID REFERENCES matches(id),
    bracket_position        INT,
    venue_id                UUID REFERENCES venues(id),
    field_name              TEXT,
    scheduled_at            TIMESTAMPTZ,
    started_at              TIMESTAMPTZ,
    ended_at                TIMESTAMPTZ,
    status                  match_status NOT NULL DEFAULT 'scheduled',
    home_score              INT DEFAULT 0,
    away_score              INT DEFAULT 0,
    winner_team_id          UUID REFERENCES teams(id),
    is_third_place_match    BOOLEAN DEFAULT FALSE,
    referee_id              TEXT,
    referee_session_token   VARCHAR(64) UNIQUE,
    referee_name            TEXT,
    -- GAP-407: quién capturó los eventos del partido
    captured_by             TEXT,                       -- user.id
    capture_role            TEXT,
    -- 'referee' | 'organizer' | 'captain' | 'system'
    notes                   TEXT,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_match_teams_distinct CHECK (home_team_id IS DISTINCT FROM away_team_id),
    CONSTRAINT chk_match_winner CHECK (
        winner_team_id IS NULL OR
        winner_team_id = home_team_id OR
        winner_team_id = away_team_id
    )
);

CREATE TABLE match_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    period_label    TEXT NOT NULL,
    period_index    INT NOT NULL DEFAULT 0,
    home_score      INT NOT NULL DEFAULT 0,
    away_score      INT NOT NULL DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE match_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id         TEXT NOT NULL,
    role            TEXT NOT NULL,
    confirmed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, user_id, role)
);

-- GAP-202: NUEVA TABLA — convocatorias por partido y jugador
CREATE TABLE match_convocatorias (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id       UUID NOT NULL REFERENCES players(id),
    team_id         UUID NOT NULL REFERENCES teams(id),
    response        TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'confirmed' | 'declined' | 'uncertain'
    responded_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, player_id)
);

-- GAP-203: NUEVA TABLA — alineaciones tácticas por partido
CREATE TABLE match_lineups (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id         UUID NOT NULL REFERENCES teams(id),
    player_id       UUID NOT NULL REFERENCES players(id),
    lineup_role     TEXT NOT NULL DEFAULT 'starter',
    -- 'starter' | 'substitute' | 'did_not_play'
    field_position  TEXT,                               -- posición táctica (opcional)
    jersey_number   INT,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    created_by      TEXT NOT NULL,                      -- user.id del capitán
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, team_id, player_id)
);

-- GAP-402: NUEVA TABLA — disputas formales de resultado
CREATE TABLE match_disputes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id),
    opened_by       TEXT NOT NULL,                      -- user.id del capitán
    team_id         UUID NOT NULL REFERENCES teams(id),
    reason          TEXT NOT NULL,
    -- 'incorrect_score' | 'wrong_card' | 'ineligible_player' | 'other'
    description     TEXT NOT NULL,
    evidence_urls   JSONB DEFAULT '[]',                 -- URLs en Cloudflare R2
    status          TEXT NOT NULL DEFAULT 'open',
    -- 'open' | 'resolved_rejected' | 'resolved_corrected'
    resolved_by     TEXT,                               -- user.id del organizador
    resolved_at     TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 9: STATISTICS
-- ============================================================

-- GAP-408: +is_draft, +confirmed_at, +confirmed_by (captura post-partido)
-- GAP-409: +period_index (referencia al período para eventos sin minuto exacto)
CREATE TABLE player_stat_values (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id       UUID NOT NULL REFERENCES players(id),
    team_id         UUID NOT NULL REFERENCES teams(id),
    metric_id       UUID NOT NULL REFERENCES tournament_metrics(id),
    value           NUMERIC NOT NULL DEFAULT 0,
    minute          INT,                                -- null si no se conoce el minuto
    -- GAP-409: período de referencia para eventos post-partido sin minuto
    period_index    INT,
    -- referencia a match_results.period_index (null si no se conoce)
    recorded_by     TEXT,
    -- GAP-408: control de borradores en captura post-partido
    is_draft        BOOLEAN NOT NULL DEFAULT FALSE,
    -- true = guardado pero sin impactar standings todavía
    confirmed_at    TIMESTAMPTZ,
    confirmed_by    TEXT,                               -- user.id
    extra_data      JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, player_id, metric_id)
);

-- GAP-408: +is_draft, +confirmed_at, +confirmed_by
CREATE TABLE team_stat_values (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id         UUID NOT NULL REFERENCES teams(id),
    metric_id       UUID NOT NULL REFERENCES tournament_metrics(id),
    value           NUMERIC NOT NULL DEFAULT 0,
    recorded_by     TEXT,
    -- GAP-408: control de borradores
    is_draft        BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_at    TIMESTAMPTZ,
    confirmed_by    TEXT,
    extra_data      JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, team_id, metric_id)
);

CREATE TABLE standings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id),
    stage_id        UUID REFERENCES stages(id),
    group_id        UUID REFERENCES groups(id),
    team_id         UUID NOT NULL REFERENCES teams(id),
    played          INT NOT NULL DEFAULT 0,
    wins            INT NOT NULL DEFAULT 0,
    draws           INT NOT NULL DEFAULT 0,
    losses          INT NOT NULL DEFAULT 0,
    points          INT NOT NULL DEFAULT 0,
    goal_difference INT GENERATED ALWAYS AS (0) STORED,
    extra_stats     JSONB DEFAULT '{}',
    rank            INT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tournament_id, stage_id, group_id, team_id),
    CONSTRAINT chk_standings_positive CHECK (
        played >= 0 AND wins >= 0 AND draws >= 0 AND losses >= 0 AND points >= 0
    )
);

CREATE TABLE player_schedule_conflicts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id   UUID NOT NULL REFERENCES players(id),
    match_id_a  UUID NOT NULL REFERENCES matches(id),
    match_id_b  UUID NOT NULL REFERENCES matches(id),
    severity    conflict_severity NOT NULL DEFAULT 'medium',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    resolution  TEXT,
    notes       TEXT
);

-- GAP-405: NUEVA TABLA — suspensiones activas por jugador
CREATE TABLE player_suspensions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id           UUID NOT NULL REFERENCES players(id),
    tournament_id       UUID NOT NULL REFERENCES tournaments(id),
    organization_id     UUID NOT NULL REFERENCES organizations(id),
    -- la suspensión tiene alcance por organización — no es global
    metric_event_id     UUID REFERENCES player_stat_values(id),
    -- el evento que generó la suspensión (null si es manual)
    matches_suspended   INT NOT NULL DEFAULT 1,
    matches_served      INT NOT NULL DEFAULT 0,
    status              TEXT NOT NULL DEFAULT 'active',
    -- 'active' | 'completed' | 'overturned'
    imposed_by          TEXT NOT NULL,                  -- user.id del organizador
    imposed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason              TEXT,
    audit_log_id        UUID REFERENCES audit_logs(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 10: PAYMENTS
-- ============================================================

-- GAP-505: +min_partial_payment
CREATE TABLE tournament_fee_items (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id           UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    concept                 TEXT NOT NULL,
    unit_price              INT NOT NULL,               -- en centavos
    currency                CHAR(3) NOT NULL DEFAULT 'MXN',
    fee_type                fee_type NOT NULL,
    is_required             BOOLEAN DEFAULT TRUE,
    accepts_online_payment  BOOLEAN DEFAULT FALSE,
    -- GAP-505: monto mínimo de abono (0 = cualquier monto válido)
    min_partial_payment     INT DEFAULT 0,              -- en centavos
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fee_invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_item_id     UUID NOT NULL REFERENCES tournament_fee_items(id),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id),
    team_id         UUID REFERENCES teams(id),
    match_id        UUID REFERENCES matches(id),
    enrollment_id   UUID REFERENCES tournament_registrations(id),
    total_amount    INT NOT NULL,                       -- congelado al crear
    currency        CHAR(3) NOT NULL DEFAULT 'MXN',
    status          invoice_status NOT NULL DEFAULT 'pending',
    trigger         TEXT DEFAULT 'auto',
    notes           TEXT,
    due_date        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-506: payment_status ahora incluye 'processing'
CREATE TABLE payment_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id      UUID NOT NULL REFERENCES fee_invoices(id),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id),
    received_by     TEXT NOT NULL,
    paid_by         TEXT,
    amount          INT NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'MXN',
    payment_method  payment_method_type NOT NULL DEFAULT 'cash',
    status          payment_status NOT NULL DEFAULT 'pending',
    is_online       BOOLEAN DEFAULT FALSE,
    external_ref    TEXT,
    notes           TEXT,
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

-- GAP-504 + GAP-701: NUEVA TABLA — registro de webhooks recibidos
-- Cubre webhooks de torneos (pagos de inscripción) y de suscripciones SaaS
CREATE TABLE payment_webhooks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway         TEXT NOT NULL,                      -- 'stripe' | 'mercadopago'
    event_type      TEXT NOT NULL,
    -- torneos: 'payment_intent.succeeded', 'payment.approved'
    -- suscripciones: 'invoice.paid', 'invoice.payment_failed', 'customer.subscription.updated'
    external_ref    TEXT NOT NULL,                      -- ID del evento en la pasarela
    webhook_scope   TEXT NOT NULL DEFAULT 'tournament',
    -- 'tournament' | 'subscription'
    payload         JSONB NOT NULL,
    status          TEXT NOT NULL DEFAULT 'received',
    -- 'received' | 'processed' | 'failed' | 'duplicate'
    processed_at    TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (gateway, external_ref)                      -- previene procesamiento duplicado
);

-- ============================================================
-- MODULE 11: SAAS SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscription_plans (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    TEXT NOT NULL UNIQUE,
    slug                    TEXT NOT NULL UNIQUE,
    price_monthly           INT NOT NULL DEFAULT 0,
    price_yearly            INT,
    currency                CHAR(3) NOT NULL DEFAULT 'MXN',
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    features                JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-702: +pending_plan_id, +pending_change_at, +pending_change_type
-- GAP-703: +last_downgrade_abort_at, +last_downgrade_abort_reason
CREATE TABLE organizer_subscriptions (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id             UUID NOT NULL REFERENCES organizations(id),
    plan_id                     UUID NOT NULL REFERENCES subscription_plans(id),
    status                      subscription_status NOT NULL DEFAULT 'trialing',
    billing_cycle               TEXT NOT NULL DEFAULT 'monthly',
    current_period_start        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end          TIMESTAMPTZ NOT NULL,
    trial_ends_at               TIMESTAMPTZ,            -- reservado, sin uso en modelo actual
    cancelled_at                TIMESTAMPTZ,
    cancel_at_period_end        BOOLEAN NOT NULL DEFAULT FALSE,
    -- GAP-702: downgrade pendiente
    pending_plan_id             UUID REFERENCES subscription_plans(id),
    pending_change_at           TIMESTAMPTZ,
    pending_change_type         TEXT,
    -- 'downgrade' | 'upgrade' | 'cancel'
    -- GAP-703: registro de aborts de downgrade
    last_downgrade_abort_at     TIMESTAMPTZ,
    last_downgrade_abort_reason JSONB,
    -- ej: { "reason": "incompatible_tournaments", "tournament_ids": ["uuid"] }
    external_id                 TEXT,
    metadata                    JSONB DEFAULT '{}',
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_subscription_period CHECK (current_period_end > current_period_start)
);

CREATE TABLE subscription_payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES organizer_subscriptions(id),
    amount          INT NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'MXN',
    status          payment_status NOT NULL DEFAULT 'pending',
    payment_method  payment_method_type DEFAULT 'card',
    external_ref    TEXT,
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feature_overrides (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    feature_key     TEXT NOT NULL,
    feature_value   JSONB NOT NULL,
    reason          TEXT,
    expires_at      TIMESTAMPTZ,
    created_by      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, feature_key)
);

CREATE TABLE tournament_archives (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id   UUID,
    organization_id UUID REFERENCES organizations(id),
    snapshot        JSONB NOT NULL,
    is_accessible   BOOLEAN DEFAULT TRUE,
    archived_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-706: NUEVA TABLA — historial de planes por organización
CREATE TABLE subscription_plan_history (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID NOT NULL REFERENCES organizations(id),
    subscription_id     UUID NOT NULL REFERENCES organizer_subscriptions(id),
    plan_id             UUID NOT NULL REFERENCES subscription_plans(id),
    billing_cycle       TEXT NOT NULL,
    started_at          TIMESTAMPTZ NOT NULL,
    ended_at            TIMESTAMPTZ,
    change_type         TEXT NOT NULL,
    -- 'initial' | 'upgrade' | 'downgrade' | 'renewal' | 'cancellation' | 'reactivation'
    changed_by          TEXT,                           -- user.id del Owner
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 12: NOTIFICATIONS
-- ============================================================

-- GAP-602: NUEVA TABLA — catálogo de tipos de notificación con is_mutable
CREATE TABLE notification_types (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_key            TEXT NOT NULL UNIQUE,
    -- 'match_rescheduled' | 'match_result' | 'team_approved' | etc.
    label               TEXT NOT NULL,
    description         TEXT,
    is_mutable          BOOLEAN NOT NULL DEFAULT TRUE,
    -- false = inmutable, el usuario no puede silenciarla
    default_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    available_channels  TEXT[] DEFAULT '{in_app,push}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-601: +is_public, +announcement_type, +audience_segment, +audience_filter
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID REFERENCES organizations(id),
    user_id             TEXT NOT NULL,
    title               TEXT NOT NULL,
    body                TEXT,
    type                TEXT NOT NULL,
    channel             notification_channel NOT NULL DEFAULT 'in_app',
    status              notification_status NOT NULL DEFAULT 'pending',
    entity_type         TEXT,
    entity_id           UUID,
    action_url          TEXT,
    read_at             TIMESTAMPTZ,
    sent_at             TIMESTAMPTZ,
    -- GAP-601: tablón de anuncios y segmentación
    is_public           BOOLEAN NOT NULL DEFAULT FALSE,
    -- true = visible en pestaña pública del torneo sin autenticación
    announcement_type   TEXT,
    -- null = notificación personal
    -- 'announcement' = comunicado manual del organizador
    -- 'auto_audit' = generado automáticamente por cambio post-publicación
    audience_segment    TEXT,
    -- 'all' | 'captains' | 'captains_with_debt' | 'referees' | 'specific_team'
    audience_filter     JSONB DEFAULT '{}',
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notification_preferences (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             TEXT NOT NULL,
    notification_type   TEXT NOT NULL,
    channel             notification_channel NOT NULL,
    is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, notification_type, channel)
);

-- GAP-604: +attempt_count, +next_retry_at, +max_attempts
CREATE TABLE notification_deliveries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    channel         notification_channel NOT NULL,
    status          notification_status NOT NULL DEFAULT 'pending',
    external_id     TEXT,
    error_message   TEXT,
    attempted_at    TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    -- GAP-604: control de reintentos BullMQ
    attempt_count   INT NOT NULL DEFAULT 0,
    next_retry_at   TIMESTAMPTZ,
    max_attempts    INT NOT NULL DEFAULT 3,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GAP-606: +platform, +app_version
CREATE TABLE fcm_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         TEXT NOT NULL,
    token           TEXT NOT NULL UNIQUE,
    device_name     VARCHAR(80),
    -- GAP-606: plataforma y versión
    platform        TEXT,                               -- 'ios' | 'android' | 'web'
    app_version     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODULE 13: AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    actor_user_id   TEXT,
    actor_role      TEXT,
    action          audit_action NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       UUID NOT NULL,
    before_data     JSONB,
    after_data      JSONB,
    diff            JSONB,
    ip_address      INET,
    user_agent      TEXT,
    request_id      TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE entity_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id   UUID NOT NULL,
    version     INT NOT NULL DEFAULT 1,
    snapshot    JSONB NOT NULL,
    changed_by  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_user_id         ON profiles(user_id);
CREATE INDEX idx_profiles_looking         ON profiles(is_looking_for_team) WHERE is_looking_for_team = TRUE;
CREATE INDEX idx_profiles_onboarding      ON profiles(onboarding_completed_at) WHERE onboarding_completed_at IS NULL;

-- Organizations
CREATE INDEX idx_orgs_slug                ON organizations(slug);
CREATE INDEX idx_orgs_created_by          ON organizations(created_by);
CREATE UNIQUE INDEX idx_orgs_slug_active  ON organizations(slug) WHERE deleted_at IS NULL;

-- Organization members
CREATE INDEX idx_org_members_org          ON organization_members(organization_id);
CREATE INDEX idx_org_members_user         ON organization_members(user_id);
CREATE INDEX idx_org_members_role         ON organization_members(organization_id, role);
CREATE INDEX idx_org_members_invites      ON organization_members(status, invitation_expires_at)
    WHERE status = 'invited';

-- Tournaments
CREATE INDEX idx_tournaments_org          ON tournaments(organization_id);
CREATE INDEX idx_tournaments_status       ON tournaments(status) WHERE archived_at IS NULL;
CREATE INDEX idx_tournaments_sport        ON tournaments(sport_id);
CREATE INDEX idx_tournaments_dates        ON tournaments(starts_at, ends_at);
CREATE INDEX idx_tournaments_join_code    ON tournaments(join_code) WHERE join_code IS NOT NULL;
CREATE INDEX idx_tournaments_name_trgm    ON tournaments USING GIN(name gin_trgm_ops);
CREATE INDEX idx_tournaments_tags         ON tournaments USING GIN(tags);
CREATE INDEX idx_tournaments_plan         ON tournaments(created_under_plan) WHERE created_under_plan IS NOT NULL;

-- Teams
CREATE INDEX idx_teams_scope              ON teams(scope);
CREATE INDEX idx_teams_org                ON teams(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_teams_join_code          ON teams(join_code) WHERE join_code IS NOT NULL;
CREATE INDEX idx_teams_active             ON teams(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_teams_name_trgm          ON teams USING GIN(name gin_trgm_ops);

-- Players
CREATE INDEX idx_players_user             ON players(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_players_active           ON players(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_name_trgm        ON players USING GIN(display_name gin_trgm_ops);
CREATE INDEX idx_players_guest            ON players(guest_created_by) WHERE is_guest = TRUE;

-- Team members
CREATE INDEX idx_team_members_team        ON team_members(team_id);
CREATE INDEX idx_team_members_player      ON team_members(player_id);
CREATE INDEX idx_team_members_status      ON team_members(team_id, status);

-- Tournament registrations
CREATE INDEX idx_treg_tournament          ON tournament_registrations(tournament_id);
CREATE INDEX idx_treg_team                ON tournament_registrations(team_id);
CREATE INDEX idx_treg_status              ON tournament_registrations(tournament_id, status);
CREATE INDEX idx_treg_financial_hold      ON tournament_registrations(tournament_id, financial_hold)
    WHERE financial_hold = TRUE;

-- Stages, brackets, rounds
CREATE INDEX idx_stages_tournament        ON stages(tournament_id);
CREATE INDEX idx_stages_order             ON stages(tournament_id, order_index);
CREATE INDEX idx_stages_transition        ON stages(transition_status)
    WHERE transition_status = 'groups_pending_validation';
CREATE INDEX idx_brackets_stage           ON brackets(stage_id);
CREATE INDEX idx_rounds_bracket           ON rounds(bracket_id);

-- Matches
CREATE INDEX idx_matches_tournament       ON matches(tournament_id);
CREATE INDEX idx_matches_stage            ON matches(stage_id);
CREATE INDEX idx_matches_round            ON matches(round_id);
CREATE INDEX idx_matches_home             ON matches(home_team_id);
CREATE INDEX idx_matches_away             ON matches(away_team_id);
CREATE INDEX idx_matches_venue            ON matches(venue_id) WHERE venue_id IS NOT NULL;
CREATE INDEX idx_matches_scheduled        ON matches(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_matches_status           ON matches(status);
CREATE INDEX idx_matches_referee_token    ON matches(referee_session_token)
    WHERE referee_session_token IS NOT NULL;
CREATE INDEX idx_matches_pending_review   ON matches(tournament_id, status)
    WHERE status IN ('pending_review', 'disputed');

-- Match convocatorias y lineups
CREATE INDEX idx_convocatoria_match       ON match_convocatorias(match_id);
CREATE INDEX idx_convocatoria_player      ON match_convocatorias(player_id);
CREATE INDEX idx_convocatoria_pending     ON match_convocatorias(match_id, response)
    WHERE response = 'pending';
CREATE INDEX idx_lineup_match             ON match_lineups(match_id, team_id);
CREATE INDEX idx_lineup_published         ON match_lineups(match_id, is_published)
    WHERE is_published = TRUE;

-- Match disputes
CREATE INDEX idx_disputes_match           ON match_disputes(match_id);
CREATE INDEX idx_disputes_tournament      ON match_disputes(tournament_id, status);

-- Statistics
CREATE INDEX idx_psv_match                ON player_stat_values(match_id);
CREATE INDEX idx_psv_player               ON player_stat_values(player_id);
CREATE INDEX idx_psv_metric               ON player_stat_values(metric_id);
-- GAP-406: índice optimizado para WebSocket — eventos recientes por partido
CREATE INDEX idx_psv_match_minute         ON player_stat_values(match_id, minute DESC)
    WHERE match_id IS NOT NULL;
-- GAP-408: índice para borradores pendientes de confirmar
CREATE INDEX idx_psv_drafts               ON player_stat_values(match_id, is_draft)
    WHERE is_draft = TRUE;
CREATE INDEX idx_tsv_match                ON team_stat_values(match_id);
CREATE INDEX idx_tsv_team                 ON team_stat_values(team_id);
CREATE INDEX idx_tsv_drafts               ON team_stat_values(match_id, is_draft)
    WHERE is_draft = TRUE;

-- GAP-105: índices optimizados para consultas de standings frecuentes
CREATE INDEX idx_standings_tournament     ON standings(tournament_id);
CREATE INDEX idx_standings_points         ON standings(tournament_id, points DESC);
CREATE INDEX idx_matches_completed_tour   ON matches(tournament_id, status)
    WHERE status = 'completed';
CREATE INDEX idx_matches_completed_stage  ON matches(stage_id, status)
    WHERE status = 'completed';

-- Suspensions
CREATE INDEX idx_suspensions_player       ON player_suspensions(player_id, status);
CREATE INDEX idx_suspensions_tournament   ON player_suspensions(tournament_id, status);
CREATE INDEX idx_suspensions_org          ON player_suspensions(organization_id, player_id, status);

-- Payments
CREATE INDEX idx_fee_invoices_team        ON fee_invoices(team_id);
CREATE INDEX idx_fee_invoices_status      ON fee_invoices(tournament_id, status);
CREATE INDEX idx_payment_records_inv      ON payment_records(invoice_id);
CREATE INDEX idx_payment_records_status   ON payment_records(status);
CREATE INDEX idx_webhooks_status          ON payment_webhooks(status, created_at);
CREATE INDEX idx_webhooks_ref             ON payment_webhooks(external_ref);
CREATE INDEX idx_webhooks_scope           ON payment_webhooks(webhook_scope, status);

-- Subscriptions
CREATE INDEX idx_subs_org                 ON organizer_subscriptions(organization_id);
CREATE INDEX idx_subs_status              ON organizer_subscriptions(status);
CREATE INDEX idx_subs_period              ON organizer_subscriptions(current_period_end)
    WHERE status = 'active';
-- GAP-704: índice para job de renovaciones próximas
CREATE INDEX idx_subs_renewal             ON organizer_subscriptions(current_period_end, status)
    WHERE status IN ('active', 'past_due') AND cancel_at_period_end = FALSE;
CREATE INDEX idx_subs_pending_change      ON organizer_subscriptions(pending_change_type)
    WHERE pending_plan_id IS NOT NULL;
CREATE INDEX idx_plan_history_org         ON subscription_plan_history(organization_id, started_at DESC);

-- Notifications
CREATE INDEX idx_notif_user               ON notifications(user_id, status);
CREATE INDEX idx_notif_unread             ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_notif_entity             ON notifications(entity_type, entity_id);
-- GAP-605: índice para tablón público del torneo
CREATE INDEX idx_notif_public_tournament  ON notifications(entity_id, is_public, created_at DESC)
    WHERE is_public = TRUE AND entity_type = 'tournament';
CREATE INDEX idx_fcm_tokens_user          ON fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_platform      ON fcm_tokens(user_id, platform);

-- Audit
CREATE INDEX idx_audit_org                ON audit_logs(organization_id);
CREATE INDEX idx_audit_actor              ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_entity             ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created            ON audit_logs(created_at DESC);
CREATE INDEX idx_entity_history           ON entity_history(entity_type, entity_id, version DESC);

-- ============================================================
-- TRIGGERS — updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON organization_members
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tournaments
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tournament_categories
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON match_lineups
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON match_disputes
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON player_suspensions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON player_stat_values
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_stat_values
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON fee_invoices
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON organizer_subscriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tournament_registrations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON stages
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TRIGGER — bloquear ediciones en torneos archivados
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_locked_tournament_edits()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM tournaments
        WHERE id = NEW.tournament_id AND locked_at IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Tournament is locked. No modifications allowed.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_tournament_lock
    BEFORE UPDATE OR DELETE ON matches
    FOR EACH ROW EXECUTE FUNCTION prevent_locked_tournament_edits();

-- ============================================================
-- FUNCIÓN — verificar feature por organización
-- Prioridad: feature_override → plan activo → created_under_plan del torneo
-- ============================================================

CREATE OR REPLACE FUNCTION org_has_feature(
    p_org_id UUID,
    p_feature TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_override   JSONB;
    v_features   JSONB;
BEGIN
    -- 1. Verificar override manual
    SELECT feature_value INTO v_override
    FROM feature_overrides
    WHERE organization_id = p_org_id
      AND feature_key = p_feature
      AND (expires_at IS NULL OR expires_at > NOW());

    IF v_override IS NOT NULL THEN
        RETURN COALESCE((v_override->>'enabled')::BOOLEAN, FALSE);
    END IF;

    -- 2. Verificar plan activo de la organización
    SELECT sp.features INTO v_features
    FROM organizer_subscriptions os
    JOIN subscription_plans sp ON sp.id = os.plan_id
    WHERE os.organization_id = p_org_id
      AND os.status IN ('active', 'trialing')
    ORDER BY os.created_at DESC
    LIMIT 1;

    IF v_features IS NULL THEN RETURN FALSE; END IF;
    RETURN COALESCE((v_features->>p_feature)::BOOLEAN, FALSE);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- FUNCIÓN — verificar feature para un torneo específico
-- Considera el created_under_plan del torneo (ciclo de vida protegido)
-- ============================================================

CREATE OR REPLACE FUNCTION tournament_has_feature(
    p_tournament_id UUID,
    p_feature TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_org_id        UUID;
    v_under_plan    TEXT;
    v_plan_features JSONB;
BEGIN
    SELECT organization_id, created_under_plan
    INTO v_org_id, v_under_plan
    FROM tournaments WHERE id = p_tournament_id;

    -- 1. Verificar feature a nivel de organización (incluye overrides)
    IF org_has_feature(v_org_id, p_feature) THEN
        RETURN TRUE;
    END IF;

    -- 2. Verificar el plan bajo el cual fue publicado el torneo
    IF v_under_plan IS NOT NULL THEN
        SELECT features INTO v_plan_features
        FROM subscription_plans
        WHERE slug = v_under_plan;

        IF v_plan_features IS NOT NULL THEN
            RETURN COALESCE((v_plan_features->>p_feature)::BOOLEAN, FALSE);
        END IF;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

-- Uso: SELECT tournament_has_feature('uuid-tournament', 'can_accept_online_payments');

-- ============================================================
-- FUNCIÓN — recalcular estado de fee_invoice tras un pago
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_invoice_status()
RETURNS TRIGGER AS $$
DECLARE
    v_total   INT;
    v_paid    INT;
    v_status  invoice_status;
BEGIN
    SELECT total_amount INTO v_total
    FROM fee_invoices WHERE id = NEW.invoice_id;

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
    FROM payment_records
    WHERE invoice_id = NEW.invoice_id AND status = 'confirmed';

    IF v_paid = 0 THEN
        v_status := 'pending';
    ELSIF v_paid < v_total THEN
        v_status := 'partial';
    ELSE
        v_status := 'paid';
    END IF;

    UPDATE fee_invoices SET status = v_status, updated_at = NOW()
    WHERE id = NEW.invoice_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Nota v4: el trigger ahora filtra status = 'confirmed' en lugar de 'paid'
-- para excluir pagos en estado 'processing' del cálculo del saldo
CREATE TRIGGER trigger_invoice_status
    AFTER INSERT OR UPDATE ON payment_records
    FOR EACH ROW EXECUTE FUNCTION recalculate_invoice_status();

-- ============================================================
-- FUNCIÓN — verificar elegibilidad financiera de un equipo
-- Retorna TRUE si el equipo está dentro del rango de tolerancia
-- ============================================================

CREATE OR REPLACE FUNCTION team_is_financially_eligible(
    p_tournament_id UUID,
    p_team_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_settings          JSONB;
    v_tolerance         JSONB;
    v_max_debt          INT;
    v_total_debt        INT;
BEGIN
    SELECT settings INTO v_settings
    FROM tournaments WHERE id = p_tournament_id;

    v_tolerance := v_settings->'financial_tolerance';

    IF v_tolerance IS NULL OR NOT (v_tolerance->>'enabled')::BOOLEAN THEN
        RETURN TRUE;  -- sin reglas de tolerancia, siempre elegible
    END IF;

    v_max_debt := COALESCE((v_tolerance->>'max_debt_amount')::INT, 2147483647);

    SELECT COALESCE(SUM(fi.total_amount - COALESCE(paid.total_paid, 0)), 0)
    INTO v_total_debt
    FROM fee_invoices fi
    LEFT JOIN (
        SELECT invoice_id, SUM(amount) AS total_paid
        FROM payment_records
        WHERE status = 'confirmed'
        GROUP BY invoice_id
    ) paid ON paid.invoice_id = fi.id
    WHERE fi.tournament_id = p_tournament_id
      AND fi.team_id = p_team_id
      AND fi.status IN ('pending', 'partial');

    RETURN v_total_debt <= v_max_debt;
END;
$$ LANGUAGE plpgsql STABLE;

-- Uso: SELECT team_is_financially_eligible('uuid-tournament', 'uuid-team');
