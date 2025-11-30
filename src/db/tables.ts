/**
 * Definición de la tabla `apps` para Drizzle ORM (MySQL/MariaDB).
 *
 * Ajustes:
 * - Usar `int` en lugar de `integer` (exportado por `drizzle-orm/mysql-core`).
 * - Tipos TypeScript inferidos con `InferModel` para evitar `any`.
 *
 * Nota:
 * - Si tu versión de MariaDB no soporta `JSON`, sustituye `json('webhooks')` por `text('webhooks')`
 *   y maneja parse/stringify en el repositorio.
 */

import { mysqlTable, varchar, int, smallint, json, text } from 'drizzle-orm/mysql-core'
import { InferModel } from 'drizzle-orm'

// Tabla `apps` adaptada del schema SQL original
export const apps = mysqlTable('apps', {
  id: varchar('id', { length: 255 }).primaryKey(),
  // `key` es una palabra reservada en algunos contextos SQL; aquí se mapea como nombre de columna 'key'
  key: varchar('key', { length: 255 }).notNull(),
  secret: varchar('secret', { length: 255 }).notNull(),
  max_connections: int('max_connections').notNull(),
  enable_client_messages: smallint('enable_client_messages').notNull(),
  enabled: smallint('enabled').notNull(),
  max_backend_events_per_sec: int('max_backend_events_per_sec').notNull(),
  max_client_events_per_sec: int('max_client_events_per_sec').notNull(),
  max_read_req_per_sec: int('max_read_req_per_sec').notNull(),
  max_presence_members_per_channel: int('max_presence_members_per_channel'),
  max_presence_member_size_in_kb: int('max_presence_member_size_in_kb'),
  max_channel_name_length: int('max_channel_name_length'),
  max_event_channels_at_once: int('max_event_channels_at_once'),
  max_event_name_length: int('max_event_name_length'),
  max_event_payload_in_kb: int('max_event_payload_in_kb'),
  max_event_batch_size: int('max_event_batch_size'),
  // Asumimos JSON nativo disponible; si no, usar `text('webhooks')`.
  webhooks: json('webhooks'),
  enable_user_authentication: smallint('enable_user_authentication').notNull(),
})

// Tipos TypeScript inferidos desde la tabla Drizzle
export type SoketiApp = InferModel<typeof apps>
export type NewSoketiApp = InferModel<typeof apps, 'insert'>
