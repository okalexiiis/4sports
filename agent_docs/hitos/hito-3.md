# 4Sports — Documento Técnico del Equipo
## Hito 3 ★ MVP — Partidos y Resultados

> **Para:** Alexis, Josue, Garib, Ivan
> **Complementa:** PRD v1.1 · Schema v4 · TechDoc Hitos 1-2
> **Clasificación:** Confidencial — Solo uso interno

---

## 0. Propósito de este Documento

Este documento es el equivalente al TechDoc de Hitos 1-2, pero para el Hito 3. Cubre cómo se construye el MVP de partidos y resultados: endpoints, reglas de backend, contratos del frontend y tablas activas en la base de datos.

El PRD v1.1 define **qué** se construye y por qué. Este documento define el **cómo** — con suficiente detalle para que cada integrante del equipo pueda trabajar en paralelo sin bloquearse.

> ⚠️ **Prerequisito:** Los Hitos 1 y 2 deben estar completados antes de iniciar cualquier tarea de este hito. El módulo de partidos depende de organizaciones, torneos, equipos y jugadores ya existentes en la BD.

---

## 1. Objetivo del Hito 3

El Hito 3 es el MVP del producto. Al completarlo, 4Sports puede ser usado en un torneo real de principio a fin: crear partidos, registrar eventos en vivo, publicar resultados, actualizar standings automáticamente y aplicar sanciones.

| Módulo | Descripción | Responsable |
|---|---|---|
| Matches & Fixtures | Ciclo de vida del partido: scheduled → live → finished | Alexis / Josue |
| Eventos en vivo | Registro de goles, tarjetas, cambios con WebSocket | Alexis |
| Resultados y standings | Cálculo automático post-partido, tabla de posiciones | Josue |
| Motor de sanciones | `forces_game_ejection` + Panel de Disciplina | Alexis / Josue |
| Convocatorias y alineaciones | `match_convocatorias` + `match_lineups` | Josue |
| Disputas de resultado | Flujo de disputa con ventana configurable | Alexis |
| BullMQ (notificaciones) | Cola asíncrona para push notifications post-partido | Alexis |
| UI Organizador | Panel de captura, Panel de Disciplina, Fixture view | Garib |
| UI Mobile | Captura en vivo, convocatoria, marcador público | Ivan |

---

## 2. Tablas Activas en Hito 3

Además de todas las tablas de Hitos 1 y 2, el Hito 3 activa los siguientes módulos del schema.

### 2.1 Módulo de Partidos

| Tabla | Propósito |
|---|---|
| `matches` | Entidad central del partido. Contiene estado, marcador, árbitro y tokens de acceso. |
| `match_results` | Marcador por período (1er Tiempo, Set 1, OT, Penales). Permite granularidad completa. |
| `match_assignments` | Árbitros y staff asignados con su rol (`referee`, `assistant_referee`, `scorekeeper`). |
| `match_convocatorias` | Respuestas de asistencia por jugador: convocado → `va` / `no_va` / `duda`. |
| `match_lineups` | Alineación táctica publicable. Distingue titular, suplente y no jugó. |
| `match_disputes` | Formulario de disputa formal con evidencias adjuntas. |

### 2.2 Módulo de Estadísticas y Sanciones

| Tabla | Propósito |
|---|---|
| `player_stat_values` | Evento individual por partido (gol, tarjeta, cambio). `is_draft` controla borrador post-partido. |
| `team_stat_values` | Estadística de equipo por partido. Misma mecánica de borrador. |
| `player_suspensions` | Suspensiones por organización y torneo. Nunca son globales entre organizaciones. |
| `sport_event_types` | Catálogo de eventos por deporte (gol, falta, expulsión). `forces_game_ejection` configurable. |

### 2.3 Módulo de Standings

| Tabla | Propósito |
|---|---|
| `standings` | Tabla de posiciones calculada. Se recalcula automáticamente al confirmar resultados. |
| `standing_entries` | Fila de posición por equipo. PJ, PG, PE, PP, GF, GC, DG, PTS. |

### 2.4 Infraestructura adicional

- **BullMQ** entra en producción para procesar notificaciones y registros de auditoría de forma asíncrona.
- **WebSockets** (ya disponibles en ElysiaJS) se conectan al módulo de partidos para broadcast de eventos en vivo.
- **Redis** almacena el estado activo del partido como caché — la BD es la fuente de verdad.

---

## 3. Ciclo de Vida del Partido

El campo `status` en `matches` sigue una máquina de estados estricta. No se pueden saltar estados.

| Estado | Descripción | Transiciones permitidas |
|---|---|---|
| `scheduled` | Partido programado. Fecha, cancha y árbitro asignados. | → `live`, → `postponed`, → `walkover` |
| `postponed` | Reprogramado. Genera notificación automática a equipos. | → `scheduled` |
| `live` | En curso. Eventos activos vía WebSocket. | → `finished`, → `suspended` |
| `suspended` | Interrumpido por causas externas (clima, incidente). | → `live`, → `walkover` |
| `finished` | Completado. Ventana de disputas abierta. | → `disputed` (si hay disputa) |
| `disputed` | Resultado bajo revisión formal. | → `finished` (con resolución) |
| `walkover` | Resultado administrativo. Marcador de `settings.walkover_score`. | Estado terminal |
| `cancelled` | Cancelado sin reemplazo. | Estado terminal |

> **Regla crítica:** La transición a `walkover` puede originarse desde `scheduled` (equipo no inscrito a tiempo) o desde `suspended`. El marcador siempre viene de `settings.walkover_score` del torneo — nunca hardcodeado en código.

---

## 4. Endpoints — Módulo de Partidos

### 4.1 CRUD de Partidos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/tournaments/:id/matches` | `org_member` | Lista partidos del torneo. Filtros: `round_id`, `status`, `team_id`. |
| `GET` | `/matches/:id` | público (si torneo público) | Detalle del partido con marcador, eventos y alineaciones. |
| `POST` | `/tournaments/:id/matches` | `organizer+` | Crear partido. Requiere `home_team_id`, `away_team_id`, `scheduled_at`, `venue_id`. |
| `PATCH` | `/matches/:id` | `organizer+` | Editar partido (fecha, cancha, árbitro). Solo si `status = scheduled`. |
| `DELETE` | `/matches/:id` | `org_admin` | Cancelar partido. Solo si `status = scheduled` o `postponed`. |
| `PATCH` | `/matches/:id/status` | `organizer+` | Transición de estado. Body: `{ status, reason? }`. |

### 4.2 Registro de Eventos en Vivo

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/matches/:id/events` | `referee_token` \| `organizer+` | Registrar evento. Body: `{ event_type_id, player_id, team_id, minute?, period_index }`. |
| `DELETE` | `/matches/:id/events/:event_id` | `organizer+` | Borrar evento registrado por error. Solo si `status = live`. |
| `GET` | `/matches/:id/events` | público (si torneo público) | Lista cronológica de eventos del partido. |

> El `referee_token` es el `referee_session_token` del campo en `matches`. Se pasa como Bearer token. Acceso estrictamente limitado a ese partido. **Árbitro y organizador registran eventos — el capitán y el coach no.**

### 4.3 Resultados y Cierre de Partido

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/matches/:id/finish` | `organizer+` | Cerrar partido. Calcula marcador final, recalcula standings, genera sanciones borrador. |
| `POST` | `/matches/:id/results/periods` | `organizer+` | Registrar marcador por período. Body: `[{ period_label, period_index, home_score, away_score }]`. |
| `GET` | `/matches/:id/results` | público | Marcador final y desglose por período. |

### 4.4 Convocatorias y Alineaciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/matches/:id/convocatoria` | `captain` \| `organizer+` | Enviar convocatoria a jugadores del equipo. |
| `PATCH` | `/matches/:id/convocatoria/:player_id` | `player` \| `captain` | Responder: `{ response: 'va' \| 'no_va' \| 'duda' }`. |
| `POST` | `/matches/:id/lineup` | `captain` \| `organizer+` | Publicar alineación: `[{ player_id, lineup_role, field_position, jersey_number }]`. |
| `GET` | `/matches/:id/lineup` | público | Consultar alineación publicada. |

### 4.5 Disputas de Resultado

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/matches/:id/disputes` | `captain` \| `organizer+` | Abrir disputa. Body: `{ reason, description, evidence_urls[] }`. Solo dentro de la ventana configurable. |
| `GET` | `/matches/:id/disputes` | `org_member` | Ver disputas del partido. |
| `PATCH` | `/matches/:id/disputes/:did` | `organizer+` | Resolver disputa: `{ resolution_notes, final_score? }`. |

### 4.6 Standings

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/tournaments/:id/standings` | público | Tabla de posiciones completa. Si hay grupos, devuelve por grupo. |
| `GET` | `/tournaments/:id/standings/groups/:gid` | público | Standings de un grupo específico (Modo Mundial). |
| `POST` | `/tournaments/:id/standings/recalculate` | `org_admin` | Recalcular manualmente (emergencia). Normalmente automático al cerrar partido. |

---

## 5. WebSockets — Partidos en Vivo

ElysiaJS ya soporta WebSockets nativamente. El canal de partidos en vivo sigue este protocolo.

### 5.1 Canal

```
ws://api/ws/matches/:match_id
```

### 5.2 Mensajes servidor → cliente

| Evento | Payload | Cuándo |
|---|---|---|
| `match:event` | `{ type, player, team, minute, score }` | Cada vez que se registra un evento en vivo. |
| `match:score` | `{ home_score, away_score }` | Al actualizar el marcador parcial. |
| `match:status` | `{ status, reason? }` | Al cambiar estado (live → finished, etc.). |
| `match:lineup` | `{ team_id, lineup[] }` | Al publicar alineación. |

### 5.3 Latencia objetivo

Las actualizaciones de marcadores deben reflejarse en el cliente en **menos de 5 segundos**. Redis actúa como caché del estado activo del partido para reducir carga a PostgreSQL durante picos de escritura simultánea.

---

## 6. Reglas de Backend Críticas

### 6.1 Registro de Eventos

- Validar que el partido esté en `status = live` antes de aceptar cualquier evento.
- Si `forces_game_ejection = true` en el `event_type`: bloquear inmediatamente al jugador para el partido en curso. Guardar la suspensión en `player_suspensions` con `is_draft = true`.
- Cada evento debe asociarse a un `player_id` y `team_id` válidos — ambos deben ser participantes del partido.
- El `minute` es opcional para eventos sin minuto exacto (ej. fin de set en voleibol). En ese caso usar `period_index`.
- Un jugador expulsado no puede recibir más eventos post-expulsión. El backend rechaza nuevos eventos para ese jugador en ese partido.

### 6.2 Cierre de Partido (`POST /matches/:id/finish`)

Al recibir esta llamada, el backend ejecuta la siguiente secuencia **en una sola transacción**:

1. Calcular `home_score` y `away_score` sumando eventos de gol según el deporte.
2. Determinar `winner_team_id`. En empate en eliminatoria, aplicar reglas del torneo (penales, tiempo extra).
3. Actualizar `matches.status = finished` y grabar `started_at` / `ended_at`.
4. Recalcular standings para el grupo o fase correspondiente.
5. Confirmar todas las suspensiones en borrador (`is_draft = false`).
6. Encolar en BullMQ la tarea de envío de push notifications a los equipos participantes.
7. Si el formato tiene avance automático (bracket), actualizar `next_match_id` con los equipos clasificados.

> **Todo esto en una sola transacción PostgreSQL.** Si cualquier paso falla, rollback completo. Nunca un partido queda en estado inconsistente.

### 6.3 Cálculo de Standings

La función de recálculo lee **todos** los partidos `finished` del torneo/grupo y reconstruye la tabla desde cero. No usa deltas incrementales para evitar inconsistencias.

| Campo | Cálculo |
|---|---|
| PJ (Jugados) | Partidos con `status = finished` o `walkover` donde el equipo participó. |
| PG (Ganados) | Partidos donde `winner_team_id = team_id`. |
| PE (Empatados) | Partidos `finished` donde `winner_team_id IS NULL` (solo fase de grupos). |
| PP (Perdidos) | `PJ - PG - PE` |
| GF / GC | Suma de `home_score` / `away_score` según si el equipo era local o visitante. |
| DG | `GF - GC` |
| PTS | Configurable en `settings.points_win` / `points_draw` / `points_loss` del torneo. |

Los criterios de desempate se leen de `sports.metadata.default_tiebreakers` y se pueden sobrescribir en `tournaments.settings`. El orden más común: **PTS → DG → GF → H2H**.

### 6.4 Motor de Sanciones

- Al registrar `forces_game_ejection = true`: crear en `player_suspensions` con `is_draft = true` y `suspension_matches` tomado de `sport_event_types.suspension_matches`.
- El organizador accede al Panel de Disciplina y ve todas las sanciones en borrador del partido recién cerrado.
- Puede confirmar con un clic (valor default) o modificar `suspension_matches` con justificación escrita.
- Al confirmar: `is_draft = false`, se registra en `audit_logs` con actor y timestamp.
- **Las suspensiones son por torneo.** Una sanción en un torneo no afecta la elegibilidad en otros torneos, ni dentro de la misma organización.

### 6.5 Walkovers

- El marcador siempre viene de `tournaments.settings.walkover_score` (ej. `"3-0"`).
- El equipo que se presenta recibe los puntos como ganador.
- Si ningún equipo se presenta, el organizador decide en el Panel.
- Un walkover genera `audit_log` + notificación automática a ambos equipos.

### 6.6 Ventana de Disputas

- Configurable en `tournaments.settings.dispute_window_hours` (default: 24 horas post-partido).
- Solo capitán u organizador pueden abrir una disputa.
- Durante la disputa, standings se mantienen con el resultado original hasta resolución.
- Al resolver: el organizador puede mantener el resultado o modificarlo. Cualquier cambio recalcula standings y genera notificaciones.

---

## 7. Contratos del Frontend

### 7.1 Panel de Captura (Organizador / Árbitro)

Esta es la pantalla central del Hito 3. Debe funcionar perfectamente en móvil.

| Dato necesario | Fuente |
|---|---|
| Información del partido (equipos, cancha, hora) | `GET /matches/:id` |
| Lista de jugadores convocados por equipo | `GET /matches/:id/convocatoria` |
| Alineación publicada | `GET /matches/:id/lineup` |
| Eventos registrados (cronológico) | `GET /matches/:id/events` |
| Catálogo de tipos de evento del deporte | `GET /sports/:id/event_types` |
| Marcador en tiempo real | WebSocket `match:score` |

El flujo de captura en Modo Express debe completarse en **menos de 30 segundos**:
- Tap en jugador → tap en tipo de evento → confirmar. Tres pasos máximo.
- El marcador se actualiza optimísticamente en UI antes de confirmación del servidor.
- Si el servidor rechaza (jugador expulsado, partido no live), mostrar error y revertir.

### 7.2 Fixture / Calendario

| Dato necesario | Fuente |
|---|---|
| Lista de partidos filtrable por jornada/fase | `GET /tournaments/:id/matches?round_id=X` |
| Estado de cada partido (badge) | `matches.status` |
| Cancha asignada | `matches.venue_id → venues.name` |

### 7.3 Tabla de Posiciones

| Dato necesario | Fuente |
|---|---|
| Standings completos del torneo | `GET /tournaments/:id/standings` |
| Standings por grupo (Modo Mundial) | `GET /tournaments/:id/standings/groups/:gid` |
| Nombre y escudo de cada equipo | Incluido en el response de standings |

### 7.4 Panel de Disciplina (Organizador)

| Dato necesario | Fuente |
|---|---|
| Sanciones en borrador | `GET /organizations/:oid/suspensions?is_draft=true` |
| Historial de sanciones confirmadas | `GET /organizations/:oid/suspensions?is_draft=false` |
| Partido de origen de cada sanción | Incluido en response con `match_id` |

### 7.5 Marcador Público (Mobile)

Vista de solo lectura, accesible sin cuenta si el torneo es público.

- Conectar al WebSocket para actualizaciones en tiempo real.
- Mostrar marcador, eventos cronológicos y alineaciones publicadas.
- Sin capacidad de acción (solo lectura).

---

## 8. BullMQ — Cola de Notificaciones

BullMQ se introduce en este hito para procesar de forma asíncrona las notificaciones post-partido y los registros de auditoría pesados.

### 8.1 Queues activos en Hito 3

| Queue | Job | Cuándo se encola |
|---|---|---|
| `notifications` | `match.finished` | Al cerrar partido — notifica a ambos equipos con resultado. |
| `notifications` | `match.rescheduled` | Al cambiar `scheduled_at` o `venue_id` de un partido. |
| `notifications` | `suspension.confirmed` | Al confirmar sanción en Panel de Disciplina. |
| `notifications` | `dispute.opened` | Al abrir disputa de resultado. |
| `notifications` | `dispute.resolved` | Al resolver disputa. |
| `audit` | `standings.recalculated` | Al completar recálculo de tabla de posiciones. |

### 8.2 Configuración básica

```typescript
// apps/api/src/shared/lib/bullmq.ts
import { Queue } from 'bullmq';
import { redis } from './redis';

export const notificationsQueue = new Queue('notifications', { connection: redis });
export const auditQueue = new Queue('audit', { connection: redis });
```

---

## 9. Seeds Requeridos para Hito 3

Antes de probar cualquier funcionalidad del hito, verificar que estos seeds existan.

### 9.1 `sport_event_types` — Ejemplo mínimo para fútbol

```sql
INSERT INTO sport_event_types (tournament_id, name, slug, forces_game_ejection, suspension_matches) VALUES
  (:tid, 'Gol',              'goal',          false, 0),
  (:tid, 'Autogol',          'own_goal',      false, 0),
  (:tid, 'Tarjeta Amarilla', 'yellow_card',   false, 0),
  (:tid, 'Tarjeta Roja',     'red_card',      true,  1),
  (:tid, 'Segunda Amarilla', 'second_yellow', true,  1),
  (:tid, 'Cambio',           'substitution',  false, 0);
```

### 9.2 `notification_types` (adicionales al Hito 1)

| slug | is_mutable |
|---|---|
| `match_finished` | true |
| `match_rescheduled` | false |
| `suspension_confirmed` | false |
| `dispute_opened` | false |
| `dispute_resolved` | false |

---

## 10. Decisiones de Producto — Resueltas para Hito 3

Del PRD v1.1, los temas relevantes al Hito 3 ya tienen decisión formal:

| # | Tema | Decisión |
|---|---|---|
| 3 | ¿Suspensiones por torneo o por plataforma? | **Solo por torneo.** Una sanción no afecta la elegibilidad en otros torneos, ni dentro de la misma organización. |
| 5 | ¿Quién puede registrar eventos en partido? | **Árbitro u organizador únicamente.** El capitán y el coach no tienen acceso. El acceso se otorga mediante link con `referee_session_token` (sin necesidad de cuenta registrada). |

---

## 11. Checklist de Entrega — Hito 3 MVP

Un partido debe poder completarse de principio a fin antes de considerar el hito terminado.

| # | Criterio de aceptación | Módulo |
|---|---|---|
| 1 | Organizador crea partido con equipos, fecha y cancha. | Matches |
| 2 | Árbitro accede por `referee_session_token` sin cuenta. | Auth |
| 3 | Árbitro inicia partido (`live`) y registra eventos en vivo. | Events |
| 4 | WebSocket transmite eventos a clientes conectados en < 5 seg. | WebSocket |
| 5 | Registro de tarjeta roja bloquea al jugador en tiempo real. | Sanciones |
| 6 | Organizador cierra partido y standings se actualizan automáticamente. | Standings |
| 7 | Sanciones en borrador aparecen en Panel de Disciplina. | Disciplina |
| 8 | Organizador confirma sanción con un clic. | Disciplina |
| 9 | Capitán abre disputa dentro de la ventana configurada. | Disputas |
| 10 | Walkover se asigna con marcador de `settings.walkover_score`. | Matches |
| 11 | Push notification llega a equipos al cerrar partido. | BullMQ |
| 12 | Tabla de posiciones pública visible sin cuenta (si torneo público). | Standings |
| 13 | Modo Express: captura de resultado en < 30 segundos en móvil. | UI Mobile |

---

*4Sports © 2025 · Hito 3 MVP — Partidos y Resultados · Confidencial — Solo uso interno*
