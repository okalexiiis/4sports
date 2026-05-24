import pino from 'pino'
import type { Logger, LogLevel, LogMeta } from './types'

const isDev = process.env.NODE_ENV !== 'production'

export function createLogger(
  opts: { scope?: string; meta?: LogMeta; level?: LogLevel } = {},
): Logger {
  const level = process.env.LOG_LEVEL ?? opts.level ?? 'info'
  const logFile = process.env.LOG_FILE

  let transport: pino.TransportMultiOptions | pino.TransportSingleOptions | undefined

  if (isDev) {
    if (logFile) {
      // dual transport: pretty to terminal + JSON to file for Promtail to scrape
      transport = {
        targets: [
          {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
            level,
          },
          {
            target: 'pino/file',
            options: { destination: logFile, mkdir: true },
            level,
          },
        ],
      }
    } else {
      transport = {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
      }
    }
  }

  const base = pino({
    level,
    base: opts.scope ? { scope: opts.scope, ...opts.meta } : (opts.meta ?? {}),
    transport,
  })
  return wrap(base)
}

function wrap(p: pino.Logger): Logger {
  return {
    trace: (msg, meta) => p.trace(meta ?? {}, msg),
    debug: (msg, meta) => p.debug(meta ?? {}, msg),
    info: (msg, meta) => p.info(meta ?? {}, msg),
    warn: (msg, meta) => p.warn(meta ?? {}, msg),
    error: (msg, meta) => p.error(meta ?? {}, msg),
    fatal: (msg, meta) => p.fatal(meta ?? {}, msg),
    child: (meta) => wrap(p.child(meta)),
  }
}
