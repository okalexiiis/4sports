import { write } from './transport'
import type { Logger, LogLevel, LogMeta } from './types'

export function createLogger(baseMeta: LogMeta = {}): Logger {
  function log(level: LogLevel, message: string, meta: LogMeta = {}): void {
    write(level, message, { ...baseMeta, ...meta })
  }

  return {
    trace: (msg, meta) => log('trace', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    fatal: (msg, meta) => log('fatal', msg, meta),
    child: (meta) => createLogger({ ...baseMeta, ...meta }),
  }
}
