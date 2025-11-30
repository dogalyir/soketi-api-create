/**
 * Removed raw SQL DDL. This module now re-exports the Drizzle-derived types
 * and exposes a no-op `createTables` to preserve backward compatibility with
 * code that calls it on startup (the DB is expected to be managed externally).
 *
 * If you want migrations, use a migration tool (e.g. drizzle-kit) and keep
 * schema creation out of the application runtime.
 */

import type { SoketiApp, NewSoketiApp } from './tables'

/**
 * Webhook shape used in the `webhooks` JSON column.
 * Kept here for backward compatibility with previous typings.
 */
export type Webhook = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | string
  headers?: Record<string, string>
  events?: string[] | null
  enabled?: boolean
  metadata?: Record<string, unknown> | null
}

/**
 * No-op table initializer.
 * Intentionally does not run DDL. The function exists only to preserve
 * compatibility with startup code that calls `createTables()`; if you
 * want to ensure the schema is present, use an explicit migration step.
 */
export const createTables = async (): Promise<void> => {
  // NO-OP: table creation is managed outside the app (migrations / manual DDL).
  return
}

/**
 * Re-export Drizzle-inferred types so other modules can continue to import
 * them from `db/schema`.
 */
export type { SoketiApp, NewSoketiApp }
