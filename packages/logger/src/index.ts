export { createLogger } from './create'
export type {
  DomainEventLogMeta,
  ErrorLogMeta,
  InfraLogMeta,
  Logger,
  LogLevel,
  LogMeta,
  LogType,
  RequestLogMeta,
  StartupLogMeta,
} from './types'

import { createLogger } from './create'
export const logger = createLogger()
