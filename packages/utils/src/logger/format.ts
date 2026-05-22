import { colorize } from './colors'
import type { LogLevel, LogMeta } from './types'

export function formatPretty(level: LogLevel, message: string, meta: LogMeta): string {
  const tag = colorize(level, `[${level.toUpperCase()}]`)
  const scope = typeof meta['scope'] === 'string' ? ` ${meta['scope']} →` : ''
  const { scope: _scope, ...rest } = meta
  const metaStr = Object.keys(rest).length > 0 ? `  ${JSON.stringify(rest)}` : ''
  return `${tag}${scope} ${message}${metaStr}`
}

export function formatPlain(level: LogLevel, message: string, meta: LogMeta): string {
  const scope = typeof meta['scope'] === 'string' ? ` ${meta['scope']} →` : ''
  const { scope: _scope, ...rest } = meta
  const metaStr = Object.keys(rest).length > 0 ? `  ${JSON.stringify(rest)}` : ''
  return `[${level.toUpperCase()}]${scope} ${message}${metaStr}`
}

export function formatJson(level: LogLevel, message: string, meta: LogMeta): string {
  return JSON.stringify({ level, message, ...meta, timestamp: new Date().toISOString() })
}
