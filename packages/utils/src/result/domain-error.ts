export class DomainError {
  constructor(
    readonly code: string,
    readonly message: string,
    readonly details?: Record<string, unknown>,
  ) {}
}
