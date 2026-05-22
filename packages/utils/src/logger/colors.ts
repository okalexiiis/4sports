import type { LogLevel } from './types'

const RESET = '\x1b[0m'
const GRAY = '\x1b[90m'
const BLUE = '\x1b[34m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const RED_BOLD = '\x1b[1;31m'

const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: GRAY,
  debug: GRAY,
  info: BLUE,
  warn: YELLOW,
  error: RED,
  fatal: RED_BOLD,
}

export function colorize(level: LogLevel, text: string): string {
  return `${LEVEL_COLORS[level]}${text}${RESET}`
}
