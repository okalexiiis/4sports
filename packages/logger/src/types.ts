export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export type LogMeta = Record<string, unknown>

export interface Logger {
  trace(message: string, meta?: LogMeta): void
  debug(message: string, meta?: LogMeta): void
  info(message: string, meta?: LogMeta): void
  warn(message: string, meta?: LogMeta): void
  error(message: string, meta?: LogMeta): void
  fatal(message: string, meta?: LogMeta): void
  child(meta: LogMeta): Logger
}

// ── Typed log meta shapes ──────────────────────────────────────────────────
// Use `satisfies` at call sites to get type-safety without losing LogMeta compatibility.

export type LogType = 'request' | 'startup' | 'error' | 'infra' | 'domain_event'

export interface RequestLogMeta {
  type: 'request'
  request_id: string
  method: string
  path: string
  status: number
  duration_ms: number
}

export interface StartupLogMeta {
  type: 'startup'
  port: number
}

export interface ErrorLogMeta {
  type: 'error'
  request_id?: string
  error_code: string
  error_message: string
}

export interface InfraLogMeta {
  type: 'infra'
  component: string
  error_message?: string
}

export interface DomainEventLogMeta {
  type: 'domain_event'
  request_id?: string
  event: string
  entity_id?: string
}
