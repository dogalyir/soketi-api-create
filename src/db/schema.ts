import { sql } from 'bun'

// Database schema for Soketi apps (matching official Soketi schema)
export const createTables = async () => {
  // Create the apps table matching Soketi's official schema
  await sql`
    CREATE TABLE IF NOT EXISTS apps (
      id VARCHAR(255) PRIMARY KEY,
      "key" VARCHAR(255) NOT NULL,
      secret VARCHAR(255) NOT NULL,
      max_connections INTEGER NOT NULL,
      enable_client_messages SMALLINT NOT NULL,
      "enabled" SMALLINT NOT NULL,
      max_backend_events_per_sec INTEGER NOT NULL,
      max_client_events_per_sec INTEGER NOT NULL,
      max_read_req_per_sec INTEGER NOT NULL,
      max_presence_members_per_channel INTEGER DEFAULT NULL,
      max_presence_member_size_in_kb INTEGER DEFAULT NULL,
      max_channel_name_length INTEGER DEFAULT NULL,
      max_event_channels_at_once INTEGER DEFAULT NULL,
      max_event_name_length INTEGER DEFAULT NULL,
      max_event_payload_in_kb INTEGER DEFAULT NULL,
      max_event_batch_size INTEGER DEFAULT NULL,
      webhooks JSON,
      enable_user_authentication SMALLINT NOT NULL
    )
  `
}

// App interface for TypeScript matching Soketi schema
export interface SoketiApp {
  id: string
  key: string
  secret: string
  max_connections: number
  enable_client_messages: number
  enabled: number
  max_backend_events_per_sec: number
  max_client_events_per_sec: number
  max_read_req_per_sec: number
  max_presence_members_per_channel: number | null
  max_presence_member_size_in_kb: number | null
  max_channel_name_length: number | null
  max_event_channels_at_once: number | null
  max_event_name_length: number | null
  max_event_payload_in_kb: number | null
  max_event_batch_size: number | null
  webhooks: any | null
  enable_user_authentication: number
}
