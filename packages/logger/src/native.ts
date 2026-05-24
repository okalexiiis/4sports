import type { Logger, LogLevel, LogMeta } from './types'

export type { Logger, LogLevel, LogMeta }

export function createLogger(opts: { scope?: string } = {}): Logger {
  const prefix = opts.scope ? `[${opts.scope}]` : ''

  function make(baseMeta: LogMeta = {}): Logger {
    function log(level: LogLevel, msg: string, meta?: LogMeta) {
      const merged = { ...baseMeta, ...meta }
      const hasMeta = Object.keys(merged).length > 0
      const fn =
        level === 'error' || level === 'fatal'
          ? console.error
          : level === 'warn'
            ? console.warn
            : console.log
      fn(`${prefix} [${level}] ${msg}`, hasMeta ? merged : '')
    }
    return {
      trace: (msg, meta) => log('trace', msg, meta),
      debug: (msg, meta) => log('debug', msg, meta),
      info: (msg, meta) => log('info', msg, meta),
      warn: (msg, meta) => log('warn', msg, meta),
      error: (msg, meta) => log('error', msg, meta),
      fatal: (msg, meta) => log('fatal', msg, meta),
      child: (meta) => make({ ...baseMeta, ...meta }),
    }
  }

  return make()
}

export const logger = createLogger()
