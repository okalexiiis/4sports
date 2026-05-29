# Josue — Dev Guide

Guía de referencia rápida para trabajar en la API de 4Sports.

---

## 1. Levantar el entorno

```bash
# Infra (Postgres + Redis) — necesario siempre
pnpm run docker:up

# API en modo dev (hot-reload)
bun dev --filter @4sports/api
```

La API queda en `http://localhost:4000`.

---

## 2. Documentación interactiva (OpenAPI)

### 2.1 Rutas propias de la API

```
http://localhost:4000/openapi
```

Documentación Swagger de todos los endpoints bajo `/v1` definidos por el equipo. Aquí puedes ver schemas de request/response, guards aplicados y probar llamadas directamente.

> Para que una ruta aparezca en OpenAPI, su archivo `docs.ts` debe estar correctamente referenciado desde `routes.ts`. Mira cualquier módulo existente (p. ej. `src/modules/organizations/http/v1/`) como plantilla.

### 2.2 Rutas de BetterAuth

```
http://localhost:4000/auth/reference
```

BetterAuth genera su propia documentación OpenAPI para todas las rutas `/auth/*` — sign-up, sign-in, sign-out, OAuth, sesión, reset de contraseña, etc. Usa esta URL cuando necesites ver exactamente qué body o headers espera una ruta de auth.

> Esta ruta la expone el plugin `openAPI()` en `src/shared/lib/auth.ts:3`.

---

## 3. Dónde vive cada cosa

```
apps/api/src/
├── index.ts                  ← entry point; monta v1, auth y sandbox
├── v1/index.ts               ← registra todos los módulos producción
├── shared/
│   ├── db/schemas/           ← tablas Drizzle (fuente de verdad del schema)
│   ├── middleware/
│   │   ├── auth.guard.ts     ← authGuard — toda ruta protegida lo usa
│   │   ├── org.guard.ts      ← orgGuard(minRole) — rutas de organización
│   │   └── feature.guard.ts  ← featureGuard(feature) — rutas por plan
│   └── lib/auth.ts           ← instancia BetterAuth con openAPI() plugin
└── modules/
    └── <domain>/
        ├── <domain>.entity.ts
        ├── <domain>.repository.ts
        ├── drizzle-<domain>.repository.ts
        ├── errors/
        ├── use-cases/
        └── http/v1/
            ├── routes.ts     ← handlers (thin — solo llaman use case + toApiResponse)
            ├── schemas.ts    ← TypeBox body/params
            └── docs.ts       ← objetos OpenAPI
```

El módulo `_sandbox/note/` es la implementación de referencia completa — úsalo como plantilla al crear un módulo nuevo.

---

## 4. Cómo hacer una request autenticada (curl)

```bash
# 1. Crear cuenta
curl -s -X POST http://localhost:4000/auth/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"josue@test.com","password":"123456","name":"Josue"}' \
  -c cookies.txt

# 2. Login (si ya tienes cuenta)
curl -s -X POST http://localhost:4000/auth/sign-in/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"josue@test.com","password":"123456"}' \
  -c cookies.txt

# 3. Usar ruta protegida
curl http://localhost:4000/v1/me -b cookies.txt
```

La cookie `better-auth.session_token` se guarda automáticamente en `cookies.txt` con `-c`. Pásala con `-b` en cada request posterior.

---

## 5. Reglas del patrón que debes seguir

1. **Route handler = thin.** Solo llama el use case y pasa el resultado a `toApiResponse`. Nada de lógica de negocio en `routes.ts`.
2. **Lógica de negocio = use case.** Firma: `(repo, input) → Promise<Result<T>>`. Nunca lanza excepciones — devuelve `ok(data)` o `err(domainError)`.
3. **Sin `any`, sin `!`.** TypeScript strict mode activo.
4. **Guards** — aplícalos como plugins de Elysia antes del handler:
   - `authGuard` → toda ruta privada
   - `orgGuard('organizer')` → ruta que opera sobre una org
   - `featureGuard('feature_key')` → ruta detrás de un plan de suscripción

---

## 6. Antes de hacer push

```bash
git fetch origin
git rebase origin/development
pnpm install
git add pnpm-lock.yaml
bun check          # lint + format + imports (Biome)
```

Si `bun check` falla, corre `bun format` para auto-corregir y vuelve a revisar.
