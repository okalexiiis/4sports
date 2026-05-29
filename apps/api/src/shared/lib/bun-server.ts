// biome-ignore lint/suspicious/noExplicitAny: Server generic parameter varies by Elysia WS data type
type AnyServer = import('bun').Server<any>

let _server: AnyServer | null = null

export function setBunServer(s: AnyServer): void {
  _server = s
}

export function getBunServer(): AnyServer | null {
  return _server
}
