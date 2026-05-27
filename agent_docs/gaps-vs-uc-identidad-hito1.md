# Gaps: Casos de Uso de Identidad vs Implementación Actual

> Compara los casos de uso del Bloque 1 (Identidad, Organizaciones y Roles)
> contra lo implementado en `apps/api/src/modules/`. Fecha: 2026-05-26.

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Implementado |
| ⚠️ | Parcial — falta lógica o detalles |
| ❌ | No implementado |
| 🔵 | Manejado por BetterAuth — no requiere endpoint custom |

---

## Resumen

| Estado | Cantidad |
|---|---|
| ✅ Implementados | 11 use-cases |
| ⚠️ Parciales | 1 (UC-009) |
| ❌ No implementados | 3 (UC-004, UC-007, UC-010) |
| 🔵 Cubiertos por BetterAuth | 2 (UC-001C, UC-001D) |

---

## UC-001 — Registro de usuario (✅ BetterAuth)

Manejado completamente por BetterAuth. No requiere endpoints custom.
El flujo de intención ("¿Jugar u organizar?") se maneja desde el frontend después del registro.

---

## UC-001B — Login (✅ BetterAuth)

Manejado completamente por BetterAuth. No requiere endpoints custom.
La lógica post-login (detectar onboarding pendiente, contar orga's activas, cargar contexto)
se ejecuta via `GET /v1/me`.

---

## UC-001C — Recuperación de contraseña (🔵 BetterAuth)

Manejado por BetterAuth. El frontend usa los endpoints de BetterAuth directamente.
No requiere implementación en nuestros módulos.

---

## UC-001D — Verificación de email (🔵 BetterAuth)

Manejado por BetterAuth. El frontend usa los endpoints de BetterAuth directamente.
No requiere implementación en nuestros módulos.
La restricción de acceso para emails no verificados debe implementarse como check
en los guards correspondientes (`if (!user.emailVerified) throw 403`).

---

## UC-002 — Onboarding Jugador (✅)

**Endpoints:**
- `POST /v1/onboarding/player` → `completePlayerOnboarding` ✅
- `GET /v1/check-username?username=` → `checkUsername` ✅

**Lo que falta:**

- ❌ **Subida de foto de perfil a R2**: El UC menciona que la foto es opcional y se sube
  a Cloudflare R2. No hay flujo de upload implementado en este módulo. Depende del
  flujo general de R2 (`POST /v1/upload/presigned`) que tampoco está implementado.
- ❌ **Deporte(s) de interés**: El UC-002 paso 2 lista "Deporte(s) de interés" y
  "Posición preferida (opcional)" como campos del onboarding. El schema actual
  de `profiles` no tiene estos campos.
- ❌ **is_looking_for_team**: El schema de `profiles` tiene el campo, pero el body
  del endpoint actual no lo incluye (revisar `PlayerOnboardingBodySchema`).

---

## UC-003 — Onboarding Organizador (✅)

**Endpoints:**
- `POST /v1/onboarding/organizer` → `completeOrganizerOnboarding` ✅
- `GET /v1/check-slug?slug=` → `checkSlug` ✅

**Lo que falta:**

- ❌ **Logo de organización (R2)**: El UC-003 paso 2 menciona logo opcional subido
  a Cloudflare R2. Misma dependencia del flujo de upload.
- ❌ **Descripción breve**: El UC-003 paso 2 incluye "Descripción breve (opcional)"
  como campo de la organización. Revisar si el schema y use-case lo contemplan.
- ❌ **Planes de pago (Stripe/MercadoPago)**: El UC-003 paso 3 describe el flujo
  de pago para planes Starter/Pro/Elite. Actualmente solo se crea la suscripción
  con el plan elegido sin integración de pasarela de pago.

---

## UC-004 — Crear organización adicional (❌)

**Actor:** Usuario registrado con perfil completo que quiere gestionar una segunda
liga o complejo.

**Trigger:** El usuario hace clic en "Nueva organización" desde su dashboard.

**Endpoints faltantes:**

| Endpoint | Descripción |
|---|---|
| `POST /v1/organizations` | Crear organización + membership owner + subscription |

**Flujo esperado:**
1. Usuario completa formulario de organización (mismos campos que UC-003 paso 2)
2. Elige plan (Free o pago)
3. Sistema crea: `organizations` + `organization_members` (owner) + `organizer_subscriptions`
4. Agrega la nueva org al selector de contexto del usuario

**Nota:** El endpoint `POST /v1/onboarding/organizer` no sirve para este caso porque
está diseñado para el flujo de onboarding inicial (crea profile + org + subscription
en una transacción). Para un usuario que ya tiene perfil, se necesita un endpoint
separado que solo cree la organización.

---

## UC-005 — Cambio de contexto (✅)

**Endpoints:**
- `GET /v1/me` devuelve `organizations[]` y `active_context` ✅
- `PUT /v1/context` cambia `active_context` en Redis ✅

**Lógica post-login** (detectar 0, 1 o 2+ orgs, cargar contexto automático):
Se maneja en `getMe` use-case. ✅

---

## UC-006 — Invitar miembro a la organización (⚠️)

**Endpoint:**
- `POST /v1/organizations/:orgId/members` → `inviteMember` ✅

**Lo que falta:**

- ⚠️ **invitation_expires_at**: Las reglas en `hitos-1-y-2.md` linea 303 dicen
  `invitation_expires_at = NOW() + 7 days`, pero el use-case no setea este campo.
  El schema de `organization_members` ya tiene `invitation_expires_at`.
- ❌ **Notificación al invitado**: El UC-006 paso 6 dice que se debe enviar
  notificación in-app + push (si tiene cuenta) o email con link de registro (si no).
  No hay sistema de notificaciones implementado aún.
- ⚠️ **Resend invitation**: El use-case retorna error si ya hay invitación pendiente
  (con `can_resend: true`), pero no hay endpoint para reenviar.

---

## UC-007 — Aceptar invitación a organización (❌)

**Actor:** Usuario registrado (invitado)

**Endpoints faltantes:**

| Endpoint | Descripción |
|---|---|
| `POST /v1/invitations/:memberId/accept` | Aceptar invitación → status = active |
| `POST /v1/invitations/:memberId/reject` | Rechazar invitación → status = left |

**Flujo esperado:**
1. El usuario registrado recibe notificación de invitación
2. Accede al detalle de la invitación (org, rol, torneos asignados)
3. Acepta → `organization_members.status = active`, `joined_at = NOW()`
4. La organización aparece en el selector de contexto

**Flujo alternativo (usuario sin cuenta):**
- El link de invitación redirige al registro (UC-001)
- Al completar el registro, el sistema debe vincular automáticamente
  la invitación pendiente usando el email

**Nota:** El campo `user_id` en `organization_members` ya se setea al invitar
(si el email tiene cuenta) o debería quedar null hasta que el usuario sin cuenta
se registre y se vincule por email.

---

## UC-008 — Modificar rol de un miembro (✅)

**Endpoint:**
- `PUT /v1/organizations/:orgId/members/:memberId` → `updateMemberRole` ✅

Incluye:
- Protección contra degradar al único owner ✅
- Protección: admin no puede promover a otro admin ✅
- Auditoría en `audit_logs` ✅

---

## UC-009 — Suspender o remover miembro (⚠️)

**Endpoint existente:**
- `DELETE /v1/organizations/:orgId/members/:memberId` → `removeMember` ✅
  (transición a `status = left`, solo para remover)

**Endpoints faltantes:**

| Endpoint | Descripción |
|---|---|
| `POST /v1/organizations/:orgId/members/:memberId/suspend` | Suspender → status = suspended |
| `POST /v1/organizations/:orgId/members/:memberId/reactivate` | Reactivar → status = active |

**Flujo de suspensión (UC-009):**
1. Owner/Admin elige "Suspender"
2. Sistema solicita confirmación y motivo (opcional)
3. `organization_members.status = suspended`
4. Si el miembro tiene sesión activa → 403 en próximo request
5. Registrar en `audit_logs`

**Flujo de reactivación (diagrama de estados UC-009):**
- `suspended → active`: Owner/Admin reactiva

---

## UC-010 — Transferir ownership (❌)

**Actor:** Owner actual

**Endpoints faltantes:**

| Endpoint | Descripción |
|---|---|
| `POST /v1/organizations/:orgId/transfer-ownership` | Transferir propiedad a otro miembro |

**Flujo esperado:**
1. Owner accede a Configuración → Transferir propiedad
2. Sistema muestra miembros activos disponibles
3. Owner selecciona nuevo owner y confirma con su contraseña
4. Sistema actualiza:
   - Nuevo owner: `role = owner`
   - Owner anterior: `role = admin`
5. Notificar al nuevo owner
6. Registrar en `audit_logs`

---

## Gaps adicionales (sin UC directo)

### Invitación a usuario sin cuenta

El `inviteMember` use-case actualmente retorna error si el email no está asociado
a ningún `user_id`:

```
"No user found with that email address"
```

Pero el UC-006 describe que si el email no tiene cuenta, se debe enviar un email
con link de registro. Esto requiere:
1. Cambiar el comportamiento: si el email no existe en `user`, crear la invitación
   con `user_id = null` y enviar email de registro
2. Al completar el registro (UC-001), buscar invitaciones pendientes por email
   y auto-vincularlas

### Subida de archivos a R2

El flujo completo de upload presignado (`POST /v1/upload/presigned`) no está
implementado. Es un prerequisito para:
- Foto de perfil en onboarding (UC-002, UC-003)
- Logo de organización (UC-003)
- Banners y PDFs de torneos (Hito 2)

---

## Checklist resumen

| UC | Estado | Prioridad | Dependencias |
|---|---|---|---|
| UC-001 Registro | 🔵 BetterAuth | — | — |
| UC-001B Login | 🔵 BetterAuth | — | — |
| UC-001C Recuperación | 🔵 BetterAuth | — | — |
| UC-001D Verificación | 🔵 BetterAuth | — | Guards de email check |
| UC-002 Onboarding Player | ✅ | — | R2 upload |
| UC-003 Onboarding Organizer | ✅ | — | R2 upload, pasarela pago |
| UC-004 Crear org adicional | ❌ | **Alta** | — |
| UC-005 Cambio contexto | ✅ | — | — |
| UC-006 Invitar miembro | ⚠️ | **Alta** | Notificaciones |
| UC-007 Aceptar invitación | ❌ | **Alta** | UC-006 |
| UC-008 Modificar rol | ✅ | — | — |
| UC-009 Suspender/Remover | ⚠️ | Media | — |
| UC-010 Transferir ownership | ❌ | Media | — |
| Upload R2 | ❌ | **Alta** | — |
