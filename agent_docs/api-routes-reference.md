# 4Sports API — Routes & Use-Cases Reference

> Para developers: lista completa de rutas, guards, schemas de request/response y casos de uso implementados.
> Base URL: `http://localhost:4000`

---

## BetterAuth Routes (proxy automático)

Todas las rutas `/auth/*` se delegan a BetterAuth vía `auth.handler()`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/sign-up` | Registro email/contraseña |
| POST | `/auth/sign-in` | Login email/contraseña |
| POST | `/auth/sign-out` | Cerrar sesión |
| POST | `/auth/forgot-password` | Solicitar reset de contraseña |
| POST | `/auth/reset-password` | Cambiar contraseña con token |
| POST | `/auth/verify-email` | Verificar email con token |
| GET | `/auth/session` | Obtener sesión actual |
| GET | `/auth/oauth2/authorize` | Iniciar OAuth (Google/Facebook) |
| GET | `/auth/callback/:provider` | Callback OAuth |

> Documentación completa: https://better-auth.com/docs

**Configuración actual:**
- Email/password: `enabled: true`, `requireEmailVerification: false`
- OAuth: Google + Facebook (requiere env vars)
- Sesiones en Redis, expiran en 30 días, cookie cache 5 min
- `trustedOrigins`: `WEB_URL`, `MOBILE_URL`

---

## Custom Routes

Todas bajo el prefijo `/v1`. Requieren cookie de sesión de BetterAuth.

### Auth — `/v1`

#### `GET /v1/me`
Retorna usuario autenticado, perfil, membresías y contexto activo.

**Guards:** `authGuard`

**Response** `200`:
```json
{
  "data": {
    "user": { "id": "uuid", "email": "a@b.com", "name": "Alexis" },
    "profile": {
      "username": "alexis_mx",
      "avatar_url": null,
      "city": "Hermosillo",
      "initial_intent": "organizer",
      "onboarding_completed_at": "2025-06-01T..."
    } | null,
    "organizations": [
      { "id": "uuid", "name": "Liga Verano", "slug": "liga-verano", "role": "owner" }
    ],
    "active_context": { "organization_id": "uuid", "role": "owner" } | null,
    "onboarding_pending": false
  }
}
```

**Reglas de `active_context`:**
- Si el usuario tiene 1 org → se selecciona automáticamente
- Si tiene 0 orgs → `null` (contexto jugador)
- Si tiene 2+ orgs y no hay contexto en Redis → `null` (frontend must show selector)

---

#### `PUT /v1/context`
Cambia la organización activa del usuario.

**Guards:** `authGuard`

**Body:**
```json
{ "organization_id": "uuid" | null }
```

**Response** `200`:
```json
{ "data": { "organization_id": "uuid", "role": "owner" } }
```

---

### Onboarding — `/v1`

#### `POST /v1/onboarding/player`
Completa onboarding de jugador. Crea `profiles` con `initial_intent = 'player'`.

**Guards:** `authGuard`

**Body:**
```json
{
  "username": "carlos_delantero",
  "city": "Hermosillo",
  "country_code": "MX",
  "phone": "+526621234567",
  "is_looking_for_team": true
}
```

**Errores:** `409` si username ya existe (incluye sugerencias)

---

#### `POST /v1/onboarding/organizer`
Completa onboarding de organizador. Crea `profiles` + `organizations` + `organization_members` (owner) + `organizer_subscriptions` en una transacción atómica.

**Guards:** `authGuard`

**Body:**
```json
{
  "profile": {
    "username": "alexis_liga",
    "city": "Hermosillo",
    "country_code": "MX"
  },
  "organization": {
    "name": "Liga Verano",
    "slug": "liga-verano-hermosillo",
    "city": "Hermosillo",
    "country_code": "MX"
  },
  "plan": "free"
}
```

**`plan` acepta:** `free`, `starter`, `pro`, `elite`

**Errores:** `409` si username o slug ya existen

---

#### `GET /v1/check-username?username=`
Verifica disponibilidad de username en tiempo real.

**Guards:** `authGuard`

**Response:**
```json
{ "data": { "available": true, "suggestions": [] } }
```

---

#### `GET /v1/check-slug?slug=`
Verifica disponibilidad de slug de organización en tiempo real.

**Guards:** `authGuard`

**Response:**
```json
{ "data": { "available": true, "suggestions": [] } }
```

---

### Organizations — `/v1`

#### `GET /v1/organizations/:orgId`
Retorna datos de la organización + rol del usuario.

**Guards:** `authGuard`, `orgGuard('viewer')`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Liga Verano",
    "slug": "liga-verano",
    "description": null,
    "logo_url": null,
    "website_url": null,
    "country_code": "MX",
    "city": "Hermosillo",
    "is_verified": false,
    "created_at": "2025-06-01T...",
    "role": "owner"
  }
}
```

---

#### `GET /v1/organizations/:orgId/members?page=1&limit=20`
Lista paginada de miembros.

**Guards:** `authGuard`, `orgGuard('viewer')`

**Response:**
```json
{
  "data": {
    "members": [
      {
        "id": "uuid",
        "user": { "name": "Josue", "email": "josue@...", "avatar_url": null },
        "role": "admin",
        "status": "active",
        "tournament_ids": [],
        "joined_at": "2025-06-01T..."
      }
    ],
    "meta": {
      "page": 1, "limit": 20, "total": 5,
      "total_pages": 1, "has_next": false, "has_prev": false
    }
  }
}
```

---

#### `POST /v1/organizations/:orgId/members`
Invita un nuevo miembro por email.

**Guards:** `authGuard`, `orgGuard('admin')`

**Body:**
```json
{
  "email": "josue@ejemplo.com",
  "role": "organizer",
  "tournament_ids": ["uuid-torneo-1"]
}
```

**`role` acepta:** `organizer`, `coach`, `viewer` (admin no puede invitar owners/admins)

**Errores:** `409` si el email ya es miembro activo o ya tiene invitación pendiente

---

#### `PUT /v1/organizations/:orgId/members/:memberId`
Cambia el rol de un miembro.

**Guards:** `authGuard`, `orgGuard('admin')`

**Body:**
```json
{ "role": "coach", "tournament_ids": [] }
```

**Protecciones:**
- No se puede degradar al único `owner`
- Admin no puede promover a otro admin/owner
- Registra en `audit_logs`

---

#### `DELETE /v1/organizations/:orgId/members/:memberId`
Remueve un miembro (soft delete: `status = 'left'`).

**Guards:** `authGuard`, `orgGuard('admin')`

**Protecciones:**
- No se puede remover al único `owner`
- Admin no puede remover a otro admin
- Registra en `audit_logs`

---

## Guards

### `authGuard`
- Lee cookie de sesión de BetterAuth
- Retorna `401` sin sesión
- Adjunta `user` + `session` a `ctx.store`
- **Usar en:** toda ruta protegida

### `orgGuard(minRole)`
- Requiere `authGuard` previo
- Lee contexto activo de Redis (`context:{userId}`)
- Verifica que `organization_id` coincida con `:orgId` del path
- Verifica `organization_members.status = 'active'`
- Verifica rol ≥ `minRole`
- Jerarquía: `viewer(0) < organizer(1) < admin(2) < owner(3)`
- Adjunta `membership` a `ctx.store`
- **Usar en:** rutas que operan sobre una organización específica

### `featureGuard(feature)`
- Requiere `authGuard` + `orgGuard` previos
- Consulta `organizer_subscriptions` activas/trialing
- Verifica `subscription_plans.features[feature]` existe y es truthy
- Retorna `403` si el plan no cubre la feature
- **Usar en:** rutas que requieren una feature específica del plan

### `requestLogger` (plugin global)
- Deriva `requestId` (UUID) y `requestStartedAt`
- Log en `onAfterResponse`: method, path, status, duración
- Nivel: `error` (500+), `warn` (400+), `info` (else)
- No requiere uso explícito — se aplica globalmente

---

## Error Codes

| HTTP | Code | Cuándo |
|---|---|---|
| 400 | `PARSE_ERROR` | Body inválido (JSON mal formado) |
| 401 | `UNAUTHORIZED` | Sin sesión activa |
| 403 | `NO_ACTIVE_CONTEXT` | Sin contexto de organización en Redis |
| 403 | `CONTEXT_MISMATCH` | Contexto activo no coincide con `:orgId` |
| 403 | `ORG_NOT_MEMBER` | No es miembro activo de la organización |
| 403 | `INSUFFICIENT_ROLE` | Rol insuficiente para la operación |
| 403 | `SUBSCRIPTION_REQUIRED` | Sin suscripción activa |
| 403 | `FEATURE_NOT_AVAILABLE` | Feature no disponible en el plan |
| 404 | `NOT_FOUND` | Ruta no encontrada |
| 409 | `ORG_CONFLICT_ALREADY_MEMBER` | Email ya es miembro activo |
| 409 | `ORG_CONFLICT_INVITE_PENDING` | Ya hay invitación pendiente |
| 422 | `VALIDATION` | Body no pasa validación de TypeBox |
| 500 | `INTERNAL_ERROR` | Error no manejado |

---

## Response Format

**Éxito:**
```json
{
  "data": { ... }
}
```

**Error:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Se requiere sesión activa.",
    "details": { ... }
  }
}
```

**Listas paginadas:**
```json
{
  "data": { "...": [] },
  "meta": {
    "page": 1, "limit": 20, "total": 87,
    "total_pages": 5, "has_next": true, "has_prev": false
  }
}
```

---

## Sandbox (development only)

Rutas de ejemplo sin autenticación, almacenamiento en memoria.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/sandbox/v1/notes` | Crear nota |
| GET | `/sandbox/v1/notes` | Listar notas |
| GET | `/sandbox/v1/notes/:id` | Obtener nota |
| DELETE | `/sandbox/v1/notes/:id` | Eliminar nota |

---

## How to test

```bash
# 1. Register
curl -X POST http://localhost:4000/auth/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}' \
  -c cookies.txt

# 2. Login
curl -X POST http://localhost:4000/auth/sign-in \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookies.txt

# 3. Get current user
curl http://localhost:4000/v1/me -b cookies.txt

# 4. Complete player onboarding
curl -X POST http://localhost:4000/v1/onboarding/player \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{"username":"testuser","city":"Hermosillo"}'
```

---

## Total

| Tipo | Cantidad |
|---|---|
| Custom routes (v1) | 12 |
| Sandbox routes | 4 |
| Guards | 3 (auth, org, feature) |
| Plugins globales | 1 (request-logger) |
| Use-cases implementados | 11 |
