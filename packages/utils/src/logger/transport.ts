import { isBrowser, isDev } from './env'
import { formatJson, formatPlain, formatPretty } from './format'
import type { LogLevel, LogMeta } from './types'

// Maps to console methods — avoids console.trace which auto-appends a stack trace.
const CONSOLE_METHOD: Record<LogLevel, 'debug' | 'info' | 'warn' | 'error'> = {
  trace: 'debug',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
}

export function write(level: LogLevel, message: string, meta: LogMeta): void {
  const method = CONSOLE_METHOD[level]
  if (!isDev) {
    console[method](formatJson(level, message, meta))
  } else if (isBrowser) {
    console[method](formatPlain(level, message, meta))
  } else {
    console[method](formatPretty(level, message, meta))
  }
}
