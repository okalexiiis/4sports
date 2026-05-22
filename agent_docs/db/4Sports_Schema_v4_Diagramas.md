# 4Sports — Schema v4 · Diagramas por módulo

> PostgreSQL 16 · Drizzle ORM · BetterAuth
> Cada diagrama cubre un módulo funcional con sus campos principales.

---

## Módulo 1 — Identidad

BetterAuth genera `user`, `session`, `account` y `verification` automáticamente. Nosotros extendemos con `profiles`. Un usuario puede pertenecer a múltiples organizaciones con roles distintos en cada una.

- **profiles** — extiende `user` de BetterAuth con datos de negocio. `initial_intent` registra si el usuario se registró como jugador u organizador. `onboarding_completed_at` permite reanudar el asistente si lo abandona a mitad.
- **organizations** — entidad raíz de cada liga o complejo deportivo. Incluye los campos de pasarela de pago (`gateway_type`, `gateway_account_id`) para cobros digitales.
- **organization_members** — tabla pivote entre usuarios y organizaciones. `role` define los permisos dentro de esa organización. `invitation_expires_at` cierra invitaciones abiertas indefinidamente. `tournament_ids[]` restringe el scope del organizador local a torneos específicos.

```mermaid
erDiagram
  USER ||--|| PROFILES : extends
  USER ||--o{ ORGANIZATION_MEMBERS : "member of"
  ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : has

  USER {
    text id PK
    string email
    string name
  }

  PROFILES {
    uuid id PK
    text user_id FK
    varchar username
    text avatar_url
    varchar phone
    varchar city
    char country_code
    boolean is_looking_for_team
    text initial_intent
    timestamptz onboarding_completed_at
  }

  ORGANIZATIONS {
    uuid id PK
    text name
    text slug
    text logo_url
    boolean is_verified
    text gateway_type
    text gateway_account_id
    timestamptz gateway_connected_at
    text created_by
    timestamptz deleted_at
  }

  ORGANIZATION_MEMBERS {
    uuid id PK
    uuid organization_id FK
    text user_id FK
    org_role role
    uuid[] tournament_ids
    membership_status status
    timestamptz invitation_expires_at
    timestamptz joined_at
  }
```

---

## Módulo 2 — Deportes y formatos

Catálogos base de la plataforma. `sports.metadata` almacena los defaults de tiebreakers, sistema de puntos y métricas base por deporte. `tournament_formats` define qué tipos de competición están disponibles y qué estructuras soportan.

- **sports** — catálogo de deportes disponibles. `metadata` contiene tiebreakers por default, puntos por victoria/empate/derrota y métricas base.
- **sport_positions** — posiciones base por deporte (portero, delantero, base, alero). El organizador puede agregar posiciones custom en su torneo.
- **tournament_formats** — formatos disponibles: `round_robin`, `single_elimination`, `double_elimination`, `world_cup`. Define qué estructuras soporta cada formato.

```mermaid
erDiagram
  SPORTS ||--o{ SPORT_POSITIONS : has
  SPORTS ||--o{ TOURNAMENTS : "used in"
  TOURNAMENT_FORMATS ||--o{ TOURNAMENTS : "defines"

  SPORTS {
    uuid id PK
    text name
    text slug
    text icon_url
    jsonb metadata
  }

  SPORT_POSITIONS {
    uuid id PK
    uuid sport_id FK
    varchar name
    boolean is_default
  }

  TOURNAMENT_FORMATS {
    uuid id PK
    text name
    text slug
    boolean supports_groups
    boolean supports_playoffs
    jsonb config_schema
    boolean is_active
  }
```

---

## Módulo 3 — Torneos

El corazón del producto. `tournaments` concentra toda la configuración del torneo. `settings` JSONB almacena: sistema de puntos, tiebreakers, walkover_score, dispute_window_hours, financial_tolerance y transfer_window. `created_under_plan` se estampa al publicar y garantiza el ciclo de vida protegido.

- **tournaments** — entidad principal. `wizard_step` permite reanudar el asistente de creación. `tags[]` son etiquetas de contexto (Femenil, Sub-17) para filtros dinámicos. `override_billing_account` activa la pasarela propia del torneo en lugar de heredar la de la organización.
- **tournament_metrics** — métricas configurables por torneo. `forces_game_ejection` bloquea al jugador en tiempo real. `suspension_matches` es la sanción sugerida por default para ese tipo de evento.
- **tournament_categories** — categorías opcionales dentro de un torneo (Sub-17, Femenil). Las restricciones de elegibilidad viven en las reglas del torneo, no en las categorías.

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ TOURNAMENTS : owns
  SPORTS ||--o{ TOURNAMENTS : "sport of"
  TOURNAMENT_FORMATS ||--o{ TOURNAMENTS : "format of"
  TOURNAMENTS ||--o{ TOURNAMENT_METRICS : has
  TOURNAMENTS ||--o{ TOURNAMENT_CATEGORIES : has

  TOURNAMENTS {
    uuid id PK
    uuid organization_id FK
    uuid sport_id FK
    uuid format_id FK
    text name
    text slug
    tournament_status status
    text created_under_plan
    text[] tags
    int wizard_step
    timestamptz wizard_completed_at
    text validation_mode
    text eligibility_mode
    jsonb player_fields
    jsonb settings
    jsonb fee_config
    boolean override_billing_account
    text gateway_type
    text gateway_account_id
    boolean is_public
    boolean requires_approval
    varchar join_code
    timestamptz locked_at
    timestamptz archived_at
  }

  TOURNAMENT_METRICS {
    uuid id PK
    uuid tournament_id FK
    varchar name
    varchar slug
    text scope
    text data_type
    boolean is_cumulative
    boolean affects_standings
    boolean forces_game_ejection
    int suspension_matches
    text stat_visibility
  }

  TOURNAMENT_CATEGORIES {
    uuid id PK
    uuid tournament_id FK
    text name
    int min_age
    int max_age
    text gender
    int max_teams
    int entry_fee
  }
```

---

## Módulo 4 — Canchas

Ownership progresivo: una cancha nace como `tournament_scoped` y puede escalar a `organization_scoped` o `verified_global`. `tournament_venues` vincula las canchas disponibles en un torneo específico.

- **venues** — canchas y espacios deportivos. `scope` controla a quién pertenece la cancha. `verification_status` es el proceso de validación por parte de 4Sports.
- **tournament_venues** — tabla pivote: qué canchas están disponibles en cada torneo.

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ VENUES : "org-scoped"
  TOURNAMENTS ||--o{ TOURNAMENT_VENUES : uses
  VENUES ||--o{ TOURNAMENT_VENUES : "available in"

  VENUES {
    uuid id PK
    venue_scope scope
    uuid organization_id FK
    uuid tournament_id FK
    text name
    text address
    text city
    text state
    char country_code
    venue_verification_status verification_status
    int capacity
    text surface_type
    jsonb amenities
    jsonb photos
    text created_by
    timestamptz deleted_at
  }

  TOURNAMENT_VENUES {
    uuid tournament_id FK
    uuid venue_id FK
  }
```

---

## Módulo 5 — Equipos y jugadores

Ownership progresivo en equipos: `tournament_scoped` → `organization_scoped` → `verified_global`. Los jugadores pueden ser usuarios reales (`user_id` presente) o perfiles puente (`is_guest = true`). La vinculación de identidad nunca ocurre automáticamente.

- **teams** — equipo deportivo. `join_policy` define cómo se ingresa: open, request, invite_only o code. `scope` controla la visibilidad y ownership del equipo.
- **players** — jugador real o perfil puente. `is_guest = true` indica que fue creado por el capitán sin que el jugador tenga cuenta. `CONSTRAINT chk_player_identity` garantiza que siempre tenga `user_id` o sea guest.
- **team_members** — membresía de un jugador en un equipo. `join_type` registra cómo ingresó (directo, invitación, solicitud, transferencia, token). `transfer_approved_by` registra quién autorizó la transferencia regulada.

```mermaid
erDiagram
  TEAMS ||--o{ TEAM_MEMBERS : has
  PLAYERS ||--o{ TEAM_MEMBERS : "plays in"
  TEAM_MEMBERS ||--o{ TEAM_MEMBER_POSITIONS : "has position"
  SPORT_POSITIONS ||--o{ TEAM_MEMBER_POSITIONS : "base position"

  TEAMS {
    uuid id PK
    ownership_scope scope
    uuid organization_id FK
    uuid tournament_id FK
    text name
    text short_name
    text logo_url
    char primary_color
    char secondary_color
    text gender_type
    text join_policy
    varchar join_code
    boolean is_verified
    boolean is_active
    timestamptz deleted_at
  }

  PLAYERS {
    uuid id PK
    text user_id FK
    text display_name
    date date_of_birth
    text sex
    text email
    text phone
    boolean is_guest
    text guest_created_by
    boolean is_active
    timestamptz deleted_at
  }

  TEAM_MEMBERS {
    uuid id PK
    uuid team_id FK
    uuid player_id FK
    team_role role
    int jersey_number
    membership_status status
    text join_type
    text transfer_approved_by
    timestamptz transfer_approved_at
    timestamptz joined_at
    timestamptz left_at
  }

  TEAM_MEMBER_POSITIONS {
    uuid id PK
    uuid team_member_id FK
    uuid sport_position_id FK
    text custom_position
  }
```

---

## Módulo 6 — Invitaciones y tokens

Tres mecanismos de acceso sin cuenta completa: invitaciones por email, solicitudes de ingreso y tokens de capitán. Todos son de un solo uso o tienen expiración configurable.

- **team_invitations** — invitación formal a un equipo. Puede ir a un `user_id` existente o a un email. `tournament_id` permite invitaciones en el contexto de un torneo específico para validar elegibilidad.
- **team_join_requests** — solicitud iniciada por el jugador en equipos con `join_policy = request`. El capitán la aprueba o rechaza.
- **captain_invite_tokens** — link de capitán que permite gestionar un equipo sin cuenta completa. `is_used = true` al consumirse.

```mermaid
erDiagram
  TEAMS ||--o{ TEAM_INVITATIONS : sends
  TEAMS ||--o{ TEAM_JOIN_REQUESTS : receives
  TEAMS ||--o{ CAPTAIN_INVITE_TOKENS : generates
  TOURNAMENTS ||--o{ TEAM_INVITATIONS : "context of"

  TEAM_INVITATIONS {
    uuid id PK
    uuid team_id FK
    uuid tournament_id FK
    text invited_by
    text invited_user_id
    text invited_email
    team_role role
    text token
    timestamptz expires_at
    timestamptz accepted_at
    timestamptz declined_at
  }

  TEAM_JOIN_REQUESTS {
    uuid id PK
    uuid team_id FK
    text user_id
    text message
    text status
    text reviewed_by
    timestamptz reviewed_at
  }

  CAPTAIN_INVITE_TOKENS {
    uuid id PK
    uuid team_id FK
    varchar token
    text created_by
    boolean is_used
    timestamptz expires_at
    timestamptz used_at
  }
```

---

## Módulo 7 — Inscripciones

Vincula equipos con torneos. `financial_hold` bloquea al equipo en la cédula arbitral cuando supera el límite de deuda configurado. `seed` se usa para la distribución de grupos en Modo Mundial.

- **tournament_registrations** — inscripción de un equipo en un torneo. `status` va de `pending` → `approved` o `rejected`. `financial_hold` es el bloqueo operativo por deuda, distinto del estado de inscripción.

```mermaid
erDiagram
  TOURNAMENTS ||--o{ TOURNAMENT_REGISTRATIONS : receives
  TEAMS ||--o{ TOURNAMENT_REGISTRATIONS : "registers in"
  TOURNAMENT_CATEGORIES ||--o{ TOURNAMENT_REGISTRATIONS : "category of"

  TOURNAMENT_REGISTRATIONS {
    uuid id PK
    uuid tournament_id FK
    uuid team_id FK
    uuid category_id FK
    registration_status status
    int seed
    boolean is_external
    text registered_by
    text approved_by
    timestamptz approved_at
    text rejection_reason
    boolean financial_hold
    timestamptz financial_hold_at
    text financial_hold_reason
  }
```

---

## Módulo 8 — Estructura del torneo (stages y brackets)

Jerarquía de estructura competitiva. Un torneo tiene stages → cada stage tiene grupos o brackets → cada bracket tiene rounds → cada round tiene matches. `transition_status` controla el estado de validación manual entre Fase de Grupos y Playoffs.

- **stages** — fase del torneo (Fase de Grupos, Cuartos, Semifinal, Final). `transition_status` registra si la transición a playoffs está pendiente de validación del organizador.
- **groups** — grupos dentro de una stage de tipo `groups`. `group_teams` asocia los equipos a cada grupo con su seed.
- **brackets** — árbol de eliminación. `bracket_type` distingue entre ganadores, perdedores y gran final (double elimination).
- **rounds** — jornada o ronda dentro de un bracket o stage. `best_of` define el formato de la serie.

```mermaid
erDiagram
  TOURNAMENTS ||--o{ STAGES : has
  STAGES ||--o{ GROUPS : contains
  STAGES ||--o{ BRACKETS : has
  STAGES ||--o{ ROUNDS : groups
  BRACKETS ||--o{ ROUNDS : has
  GROUPS ||--o{ GROUP_TEAMS : includes

  STAGES {
    uuid id PK
    uuid tournament_id FK
    text name
    text stage_type
    int order_index
    jsonb format_config
    boolean is_active
    timestamptz completed_at
    text transition_status
    timestamptz transition_validated_at
    text transition_validated_by
  }

  GROUPS {
    uuid id PK
    uuid stage_id FK
    text name
    int order_index
  }

  GROUP_TEAMS {
    uuid id PK
    uuid group_id FK
    uuid team_id FK
    int seed
  }

  BRACKETS {
    uuid id PK
    uuid stage_id FK
    text bracket_type
  }

  ROUNDS {
    uuid id PK
    uuid bracket_id FK
    uuid stage_id FK
    text name
    int order_index
    int best_of
    timestamptz starts_at
    timestamptz ends_at
  }
```

---

## Módulo 9 — Partidos

La tabla más compleja del schema. `status` incluye `pending_review` (capitán reportó sin árbitro) y `disputed` (resultado en disputa activa). `next_match_id` encadena el ganador al siguiente partido del bracket. `captured_by` y `capture_role` registran quién capturó los eventos para auditoría.

- **matches** — partido individual. `loser_next_match_id` es para double elimination. `referee_session_token` permite árbitros externos sin cuenta. `captured_by` registra el actor que capturó los eventos (árbitro, organizador, capitán).
- **match_results** — resultados por período (1er Tiempo, Set 1, OT, Penales).
- **match_assignments** — árbitros y staff asignados a un partido con su rol específico.
- **match_convocatorias** — respuestas de asistencia al partido por jugador (Voy / No voy / Duda).
- **match_lineups** — alineación táctica publicable. `lineup_role` distingue titular, suplente o no jugó.
- **match_disputes** — formulario formal de disputa de resultado con evidencia adjunta.

```mermaid
erDiagram
  ROUNDS ||--o{ MATCHES : schedules
  MATCHES ||--o{ MATCH_RESULTS : "detail by period"
  MATCHES ||--o{ MATCH_ASSIGNMENTS : "staff assigned"
  MATCHES ||--o{ MATCH_CONVOCATORIAS : "attendance"
  MATCHES ||--o{ MATCH_LINEUPS : "lineup"
  MATCHES ||--o{ MATCH_DISPUTES : "dispute"

  MATCHES {
    uuid id PK
    uuid tournament_id FK
    uuid stage_id FK
    uuid round_id FK
    uuid bracket_id FK
    uuid group_id FK
    uuid home_team_id FK
    uuid away_team_id FK
    uuid next_match_id FK
    uuid loser_next_match_id FK
    uuid venue_id FK
    timestamptz scheduled_at
    timestamptz started_at
    timestamptz ended_at
    match_status status
    int home_score
    int away_score
    uuid winner_team_id FK
    boolean is_third_place_match
    text referee_id
    varchar referee_session_token
    text captured_by
    text capture_role
  }

  MATCH_RESULTS {
    uuid id PK
    uuid match_id FK
    text period_label
    int period_index
    int home_score
    int away_score
  }

  MATCH_ASSIGNMENTS {
    uuid id PK
    uuid match_id FK
    text user_id
    text role
    timestamptz confirmed_at
  }

  MATCH_CONVOCATORIAS {
    uuid id PK
    uuid match_id FK
    uuid player_id FK
    uuid team_id FK
    text response
    timestamptz responded_at
  }

  MATCH_LINEUPS {
    uuid id PK
    uuid match_id FK
    uuid team_id FK
    uuid player_id FK
    text lineup_role
    text field_position
    int jersey_number
    boolean is_published
    text created_by
  }

  MATCH_DISPUTES {
    uuid id PK
    uuid match_id FK
    uuid tournament_id FK
    text opened_by
    uuid team_id FK
    text reason
    text description
    jsonb evidence_urls
    text status
    text resolved_by
    timestamptz resolved_at
    text resolution_notes
  }
```

---

## Módulo 10 — Estadísticas

`player_stat_values` y `team_stat_values` registran cada evento del partido. `is_draft = true` indica que el evento fue registrado post-partido y aún no ha impactado standings. `minute = null` es válido para eventos sin minuto exacto. `player_suspensions` encapsula las suspensiones por organización — nunca son globales.

- **player_stat_values** — estadística individual por partido. `is_draft` controla el borrador post-partido. `period_index` referencia el período para eventos sin minuto exacto.
- **team_stat_values** — estadística de equipo por partido. Misma mecánica de borrador.
- **standings** — tabla de posiciones calculada al vuelo — no almacena el rank fijo. `extra_stats` JSONB almacena goles a favor, en contra, diferencia de goles, sets ganados, etc.
- **player_suspensions** — suspensiones activas con alcance por organización. `matches_served` rastrea cuántos partidos ya cumplió el jugador suspendido.

```mermaid
erDiagram
  TOURNAMENT_METRICS ||--o{ PLAYER_STAT_VALUES : "records"
  TOURNAMENT_METRICS ||--o{ TEAM_STAT_VALUES : "records"
  MATCHES ||--o{ PLAYER_STAT_VALUES : generates
  MATCHES ||--o{ TEAM_STAT_VALUES : generates
  PLAYERS ||--o{ PLAYER_STAT_VALUES : "has stats"
  TEAMS ||--o{ TEAM_STAT_VALUES : "has stats"
  TEAMS ||--o{ STANDINGS : "appears in"
  PLAYERS ||--o{ PLAYER_SUSPENSIONS : "suspended"

  PLAYER_STAT_VALUES {
    uuid id PK
    uuid match_id FK
    uuid player_id FK
    uuid team_id FK
    uuid metric_id FK
    numeric value
    int minute
    int period_index
    boolean is_draft
    timestamptz confirmed_at
    text confirmed_by
    text recorded_by
    jsonb extra_data
  }

  TEAM_STAT_VALUES {
    uuid id PK
    uuid match_id FK
    uuid team_id FK
    uuid metric_id FK
    numeric value
    boolean is_draft
    timestamptz confirmed_at
    text confirmed_by
    jsonb extra_data
  }

  STANDINGS {
    uuid id PK
    uuid tournament_id FK
    uuid stage_id FK
    uuid group_id FK
    uuid team_id FK
    int played
    int wins
    int draws
    int losses
    int points
    jsonb extra_stats
    int rank
  }

  PLAYER_SUSPENSIONS {
    uuid id PK
    uuid player_id FK
    uuid tournament_id FK
    uuid organization_id FK
    uuid metric_event_id FK
    int matches_suspended
    int matches_served
    text status
    text imposed_by
    timestamptz imposed_at
    text reason
  }
```

---

## Módulo 11 — Pagos

Flujo: `tournament_fee_items` define los conceptos de cobro → `fee_invoices` genera la deuda automáticamente al cumplirse el trigger → `payment_records` registra cada pago (parcial o total). `payment_webhooks` previene procesamiento duplicado con `UNIQUE (gateway, external_ref)`.

- **tournament_fee_items** — conceptos de cobro del torneo (inscripción, arbitraje, credenciales). `min_partial_payment` define el monto mínimo de abono.
- **fee_invoices** — deuda generada automáticamente. `total_amount` se congela al crear — nunca se recalcula si el organizador cambia el precio del fee_item.
- **payment_records** — cada pago registrado. Puede ser parcial. `is_online` distingue efectivo de pago digital. `status = processing` es el estado transitorio mientras llega el webhook.
- **payment_webhooks** — registro de webhooks recibidos de Stripe / Mercado Pago. Cubre tanto pagos de torneos como cobros de suscripción SaaS.

```mermaid
erDiagram
  TOURNAMENTS ||--o{ TOURNAMENT_FEE_ITEMS : defines
  TOURNAMENT_FEE_ITEMS ||--o{ FEE_INVOICES : "generates debt"
  FEE_INVOICES ||--o{ PAYMENT_RECORDS : "settled by"
  TEAMS ||--o{ FEE_INVOICES : "debtor team"

  TOURNAMENT_FEE_ITEMS {
    uuid id PK
    uuid tournament_id FK
    text concept
    int unit_price
    char currency
    fee_type fee_type
    boolean is_required
    boolean accepts_online_payment
    int min_partial_payment
    boolean is_active
  }

  FEE_INVOICES {
    uuid id PK
    uuid fee_item_id FK
    uuid tournament_id FK
    uuid team_id FK
    uuid match_id FK
    uuid enrollment_id FK
    int total_amount
    char currency
    invoice_status status
    text trigger
    timestamptz due_date
  }

  PAYMENT_RECORDS {
    uuid id PK
    uuid invoice_id FK
    uuid tournament_id FK
    text received_by
    text paid_by
    int amount
    payment_method_type payment_method
    payment_status status
    boolean is_online
    text external_ref
    timestamptz paid_at
  }

  PAYMENT_WEBHOOKS {
    uuid id PK
    text gateway
    text event_type
    text external_ref
    text webhook_scope
    jsonb payload
    text status
    timestamptz processed_at
    text error_message
  }
```

---

## Módulo 12 — Suscripciones SaaS

`subscription_plans.features` JSONB define qué tiene cada plan. `organizer_subscriptions` rastrea el ciclo de vida completo incluyendo downgrades pendientes y razones de abort. `subscription_plan_history` reconstruye el historial completo de cambios de plan.

- **subscription_plans** — catálogo de planes: free, starter, pro, elite. `features` JSONB contiene todos los feature flags y límites del plan.
- **organizer_subscriptions** — suscripción activa de la organización. `pending_plan_id` registra un downgrade pendiente hasta el fin del ciclo. `last_downgrade_abort_reason` documenta por qué el sistema abortó un downgrade automáticamente.
- **feature_overrides** — ajustes manuales de features por organización. Tienen prioridad máxima sobre el plan. Pueden habilitar o deshabilitar features independientemente.
- **subscription_plan_history** — historial completo de cambios de plan para auditoría.

```mermaid
erDiagram
  SUBSCRIPTION_PLANS ||--o{ ORGANIZER_SUBSCRIPTIONS : "contracted as"
  ORGANIZER_SUBSCRIPTIONS ||--o{ SUBSCRIPTION_PAYMENTS : generates
  ORGANIZATIONS ||--o| ORGANIZER_SUBSCRIPTIONS : has
  ORGANIZATIONS ||--o{ FEATURE_OVERRIDES : "may have"
  ORGANIZER_SUBSCRIPTIONS ||--o{ SUBSCRIPTION_PLAN_HISTORY : tracks

  SUBSCRIPTION_PLANS {
    uuid id PK
    text name
    text slug
    int price_monthly
    int price_yearly
    char currency
    boolean is_active
    jsonb features
  }

  ORGANIZER_SUBSCRIPTIONS {
    uuid id PK
    uuid organization_id FK
    uuid plan_id FK
    subscription_status status
    text billing_cycle
    timestamptz current_period_start
    timestamptz current_period_end
    boolean cancel_at_period_end
    timestamptz cancelled_at
    uuid pending_plan_id FK
    text pending_change_type
    timestamptz last_downgrade_abort_at
    jsonb last_downgrade_abort_reason
    text external_id
  }

  SUBSCRIPTION_PAYMENTS {
    uuid id PK
    uuid subscription_id FK
    int amount
    payment_status status
    text external_ref
    timestamptz paid_at
  }

  FEATURE_OVERRIDES {
    uuid id PK
    uuid organization_id FK
    text feature_key
    jsonb feature_value
    text reason
    timestamptz expires_at
    text created_by
  }

  SUBSCRIPTION_PLAN_HISTORY {
    uuid id PK
    uuid organization_id FK
    uuid subscription_id FK
    uuid plan_id FK
    text billing_cycle
    timestamptz started_at
    timestamptz ended_at
    text change_type
    text changed_by
  }
```

---

## Módulo 13 — Notificaciones

Dos categorías de notificaciones: inmutables (dictadas por la liga, no se pueden silenciar) y personalizables (el usuario controla). `notification_types` es el catálogo que define si cada tipo es mutable o no. `is_public` habilita el tablón de anuncios visible para fanáticos anónimos.

- **notification_types** — catálogo de tipos con `is_mutable`. `false` = la liga la dicta, el usuario no puede silenciarla. El backend rechaza cualquier intento de modificarla con 403.
- **notifications** — notificación individual. `is_public` la hace visible en el tablón público del torneo. `announcement_type` distingue comunicados manuales de los generados automáticamente por cambios post-publicación.
- **notification_preferences** — preferencias del usuario por tipo y canal. Solo aplica a tipos mutables.
- **notification_deliveries** — registro de entrega por canal. `attempt_count` y `max_attempts` controlan los reintentos de BullMQ.
- **fcm_tokens** — tokens de Firebase por dispositivo. `platform` distingue iOS, Android y web.

```mermaid
erDiagram
  NOTIFICATION_TYPES ||--o{ NOTIFICATION_PREFERENCES : "governs"
  NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERIES : "delivered via"
  USER ||--o{ FCM_TOKENS : "has devices"

  NOTIFICATION_TYPES {
    uuid id PK
    text type_key
    text label
    boolean is_mutable
    boolean default_enabled
    text[] available_channels
  }

  NOTIFICATIONS {
    uuid id PK
    uuid organization_id FK
    text user_id
    text title
    text body
    text type
    notification_channel channel
    notification_status status
    text entity_type
    uuid entity_id
    text action_url
    timestamptz read_at
    boolean is_public
    text announcement_type
    text audience_segment
    jsonb audience_filter
  }

  NOTIFICATION_PREFERENCES {
    uuid id PK
    text user_id
    text notification_type
    notification_channel channel
    boolean is_enabled
  }

  NOTIFICATION_DELIVERIES {
    uuid id PK
    uuid notification_id FK
    notification_channel channel
    notification_status status
    text external_id
    text error_message
    int attempt_count
    timestamptz next_retry_at
    int max_attempts
  }

  FCM_TOKENS {
    uuid id PK
    text user_id
    text token
    varchar device_name
    text platform
    text app_version
    timestamptz last_used_at
  }
```

---

## Módulo 14 — Auditoría

Registro completo e inmutable de todas las operaciones críticas. `audit_logs` es append-only — no se actualiza ni elimina. `entity_history` almacena snapshots completos de entidades en versiones sucesivas.

- **audit_logs** — registro de cada acción crítica con datos antes/después y diff. `actor_role` captura el rol con el que actuó el usuario en ese momento.
- **entity_history** — snapshots versionados de entidades críticas. Permite reconstruir el estado exacto de un torneo o partido en cualquier punto del tiempo.

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ AUDIT_LOGS : "logged for"

  AUDIT_LOGS {
    uuid id PK
    uuid organization_id FK
    text actor_user_id
    text actor_role
    audit_action action
    text entity_type
    uuid entity_id
    jsonb before_data
    jsonb after_data
    jsonb diff
    inet ip_address
    text user_agent
    text request_id
    text notes
    timestamptz created_at
  }

  ENTITY_HISTORY {
    uuid id PK
    text entity_type
    uuid entity_id
    int version
    jsonb snapshot
    text changed_by
    timestamptz created_at
  }
```

---

## Resumen de tablas nuevas en v4

| Tabla | Módulo | Resuelve |
|---|---|---|
| `match_convocatorias` | Partidos | Respuestas de asistencia por jugador |
| `match_lineups` | Partidos | Alineaciones tácticas publicables |
| `match_disputes` | Partidos | Formulario formal de disputa |
| `player_suspensions` | Estadísticas | Suspensiones encapsuladas por organización |
| `payment_webhooks` | Pagos | Previene webhooks duplicados |
| `subscription_plan_history` | Suscripciones | Historial completo de cambios de plan |
| `notification_types` | Notificaciones | Catálogo con `is_mutable` para gobernanza |
