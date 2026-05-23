/// <reference types="bun" />
export const isBrowser: boolean = typeof window !== 'undefined'

// process.env['NODE_ENV'] is injected by Bun/Node natively, by babel-preset-expo
// in Hermes, and by Turbopack/webpack in Next.js — safe in all four runtimes.
export const isDev: boolean = process.env.NODE_ENV !== 'production'
