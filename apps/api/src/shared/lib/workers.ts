import { Worker } from 'bullmq'
import { and, eq, inArray, isNotNull } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { db } from '@/shared/db/client'
import {
  auditLogs,
  matchConvocatorias,
  matches,
  notifications,
  organizationMembers,
  organizations,
  playerSuspensions,
  players,
  tournaments,
} from '@/shared/db/schemas'
import { logger } from '@/shared/logger'
import type { AuditJobData, NotificationJobData } from './bullmq'
import { resendClient } from './resend'

// Minimal read-only reference to BetterAuth's user table for name lookups
const betterAuthUsers = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})

// Reuses the same connection options as the queues in bullmq.ts
function redisConnectionFromUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
    db: parsed.pathname ? Number(parsed.pathname.slice(1)) || 0 : 0,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
  }
}

const connection = redisConnectionFromUrl(process.env.REDIS_URL ?? 'redis://localhost:6379')

async function insertNotifications(
  userIds: string[],
  payload: {
    title: string
    body: string
    type: string
    entity_type?: string
    entity_id?: string
  },
) {
  if (userIds.length === 0) return
  await db.insert(notifications).values(
    userIds.map((user_id) => ({
      user_id,
      title: payload.title,
      body: payload.body,
      type: payload.type,
      entity_type: payload.entity_type ?? null,
      // biome-ignore lint/suspicious/noExplicitAny: entity_id is a UUID string but schema expects uuid column
      entity_id: (payload.entity_id as any) ?? null,
      channel: 'in_app' as const,
      status: 'sent' as const,
      sent_at: new Date(),
    })),
  )
}

async function getMatchPlayerUserIds(matchId: string): Promise<string[]> {
  const convocatorias = await db
    .select({ player_id: matchConvocatorias.player_id })
    .from(matchConvocatorias)
    .where(eq(matchConvocatorias.match_id, matchId))

  if (convocatorias.length === 0) return []

  const playerIds = convocatorias.map((c) => c.player_id)
  const playerRows = await db
    .select({ user_id: players.user_id })
    .from(players)
    .where(and(inArray(players.id, playerIds), isNotNull(players.user_id)))

  return playerRows.map((p) => p.user_id as string)
}

async function getOrgAdminUserIds(organizationId: string): Promise<string[]> {
  const members = await db
    .select({ user_id: organizationMembers.user_id })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organization_id, organizationId),
        isNotNull(organizationMembers.user_id),
        inArray(organizationMembers.role, ['admin', 'organizer']),
      ),
    )
  return members.map((m) => m.user_id as string)
}

// ── Notification handlers ────────────────────────────────────────────────────

async function handleMatchFinished(payload: { matchId: string }) {
  const userIds = await getMatchPlayerUserIds(payload.matchId)
  await insertNotifications(userIds, {
    title: 'Partido finalizado',
    body: 'El partido ha concluido. Revisa el marcador final.',
    type: 'match.finished',
    entity_type: 'match',
    entity_id: payload.matchId,
  })
}

async function handleMatchRescheduled(payload: { matchId: string }) {
  const userIds = await getMatchPlayerUserIds(payload.matchId)
  await insertNotifications(userIds, {
    title: 'Partido reprogramado',
    body: 'La fecha o el lugar de tu partido ha cambiado.',
    type: 'match.rescheduled',
    entity_type: 'match',
    entity_id: payload.matchId,
  })
}

async function handleSuspensionConfirmed(payload: { suspensionId: string }) {
  const [suspension] = await db
    .select({
      player_id: playerSuspensions.player_id,
      suspension_matches: playerSuspensions.suspension_matches,
    })
    .from(playerSuspensions)
    .where(eq(playerSuspensions.id, payload.suspensionId))
    .limit(1)

  if (!suspension) return

  const [player] = await db
    .select({ user_id: players.user_id })
    .from(players)
    .where(and(eq(players.id, suspension.player_id), isNotNull(players.user_id)))
    .limit(1)

  if (!player?.user_id) return

  await insertNotifications([player.user_id], {
    title: 'Sanción confirmada',
    body: `Tu suspensión ha sido confirmada: ${suspension.suspension_matches} partido(s).`,
    type: 'suspension.confirmed',
    entity_type: 'suspension',
    entity_id: payload.suspensionId,
  })
}

async function handleDisputeOpened(payload: {
  disputeId: string
  matchId: string
  openedBy: string
}) {
  const [match] = await db
    .select({ tournament_id: matches.tournament_id })
    .from(matches)
    .where(eq(matches.id, payload.matchId))
    .limit(1)

  if (!match) return

  const [tournament] = await db
    .select({ organization_id: tournaments.organization_id })
    .from(tournaments)
    .where(eq(tournaments.id, match.tournament_id))
    .limit(1)

  if (!tournament) return

  const adminIds = await getOrgAdminUserIds(tournament.organization_id)

  // Also notify the opener as confirmation
  const allIds = [...new Set([...adminIds, payload.openedBy])]

  await insertNotifications(allIds, {
    title: 'Nueva disputa abierta',
    body: 'Se ha abierto una disputa para un partido. Revisa el panel.',
    type: 'dispute.opened',
    entity_type: 'dispute',
    entity_id: payload.disputeId,
  })
}

async function handleDisputeResolved(payload: { disputeId: string; openedBy: string }) {
  await insertNotifications([payload.openedBy], {
    title: 'Disputa resuelta',
    body: 'Tu disputa ha sido revisada y resuelta por un administrador.',
    type: 'dispute.resolved',
    entity_type: 'dispute',
    entity_id: payload.disputeId,
  })
}

async function handleInvitationSent(payload: {
  memberId: string
  orgId: string
  invitedByUserId: string
}) {
  const [memberRow] = await db
    .select({
      user_id: organizationMembers.user_id,
      invited_email: organizationMembers.invited_email,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .where(eq(organizationMembers.id, payload.memberId))
    .limit(1)

  if (!memberRow) return

  const [orgRow] = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, payload.orgId))
    .limit(1)

  const [inviterRow] = await db
    .select({ name: betterAuthUsers.name })
    .from(betterAuthUsers)
    .where(eq(betterAuthUsers.id, payload.invitedByUserId))
    .limit(1)

  const orgName = orgRow?.name ?? 'una organización'
  const inviterName = inviterRow?.name ?? 'Un administrador'

  // Resolve recipient email
  let emailTo = memberRow.invited_email
  if (!emailTo && memberRow.user_id) {
    const [userRow] = await db
      .select({ email: betterAuthUsers.email })
      .from(betterAuthUsers)
      .where(eq(betterAuthUsers.id, memberRow.user_id))
      .limit(1)
    emailTo = userRow?.email ?? null
  }

  // In-app notification first — so retries don't duplicate email sends
  if (memberRow.user_id) {
    await insertNotifications([memberRow.user_id], {
      title: `Invitación a ${orgName}`,
      body: `${inviterName} te invitó como ${memberRow.role}.`,
      type: 'invitation.sent',
      entity_type: 'organization',
      entity_id: payload.orgId,
    })
  }

  if (emailTo) {
    const safe = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    const from = process.env.RESEND_FROM_EMAIL ?? 'invitaciones@4sports.app'
    const { error } = await resendClient.emails.send({
      from,
      to: emailTo,
      subject: `${safe(inviterName)} te invitó a ${safe(orgName)}`,
      html: `<p>Hola,</p><p><strong>${safe(inviterName)}</strong> te ha invitado a unirte a <strong>${safe(orgName)}</strong> como <strong>${memberRow.role}</strong>.</p><p>Ingresa a 4Sports para aceptar o rechazar la invitación.</p>`,
    })
    if (error) {
      logger.error('resend email send failed', {
        type: 'error',
        error_code: 'RESEND_ERROR',
        error_message: error.message,
        // biome-ignore lint/suspicious/noExplicitAny: logger meta is typed loosely
      } as any)
    }
  }
}

// ── Audit handler ────────────────────────────────────────────────────────────

async function handleAudit(data: AuditJobData) {
  await db.insert(auditLogs).values({
    actor_user_id: data.user_id,
    action: data.action as (typeof auditLogs.$inferInsert)['action'],
    entity_type: data.entity_type,
    // biome-ignore lint/suspicious/noExplicitAny: entity_id is a UUID string but schema expects uuid column
    entity_id: data.entity_id as any,
    after_data: data.meta ?? null,
  })
}

// ── Worker bootstrap ─────────────────────────────────────────────────────────

export function startWorkers() {
  const notificationsWorker = new Worker<NotificationJobData>(
    'notifications',
    async (job) => {
      const p = job.data.payload
      switch (job.data.type) {
        case 'match.finished':
          await handleMatchFinished(p as { matchId: string })
          break
        case 'match.rescheduled':
          await handleMatchRescheduled(p as { matchId: string })
          break
        case 'suspension.confirmed':
          await handleSuspensionConfirmed(p as { suspensionId: string })
          break
        case 'dispute.opened':
          await handleDisputeOpened(p as { disputeId: string; matchId: string; openedBy: string })
          break
        case 'dispute.resolved':
          await handleDisputeResolved(p as { disputeId: string; openedBy: string })
          break
        case 'invitation.sent':
          await handleInvitationSent(job.data.payload)
          break
      }
    },
    { connection },
  )

  const auditWorker = new Worker<AuditJobData>('audit', async (job) => handleAudit(job.data), {
    connection,
  })

  notificationsWorker.on('failed', (_job, err) => {
    logger.error('notification job failed', {
      type: 'error',
      error_code: 'WORKER_ERROR',
      error_message: err.message,
      // biome-ignore lint/suspicious/noExplicitAny: logger meta is typed loosely
    } as any)
  })

  auditWorker.on('failed', (_job, err) => {
    logger.error('audit job failed', {
      type: 'error',
      error_code: 'WORKER_ERROR',
      error_message: err.message,
      // biome-ignore lint/suspicious/noExplicitAny: logger meta is typed loosely
    } as any)
  })

  // biome-ignore lint/suspicious/noExplicitAny: logger meta is typed loosely
  logger.info('bullmq workers started', { type: 'startup' } as any)

  return { notificationsWorker, auditWorker }
}
