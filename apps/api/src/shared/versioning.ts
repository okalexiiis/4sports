import { Elysia } from 'elysia'

export const createVersion = (version: number) => new Elysia({ prefix: `/v${version}` })
