import { sql } from 'bun'
import { SoketiApp } from './schema'

// Database repository for Soketi apps
export class SoketiAppRepository {

  // Create a new Soketi app with proper Soketi schema
  static async createApp(appData: {
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
    webhooks: string | null
    enable_user_authentication: number
  }): Promise<SoketiApp> {
    const result = await sql`
      INSERT INTO apps (
        id, "key", secret, max_connections, enable_client_messages, "enabled",
        max_backend_events_per_sec, max_client_events_per_sec, max_read_req_per_sec,
        max_presence_members_per_channel, max_presence_member_size_in_kb,
        max_channel_name_length, max_event_channels_at_once, max_event_name_length,
        max_event_payload_in_kb, max_event_batch_size, webhooks, enable_user_authentication
      ) VALUES (
        ${appData.id}, ${appData.key}, ${appData.secret}, ${appData.max_connections},
        ${appData.enable_client_messages}, ${appData.enabled},
        ${appData.max_backend_events_per_sec}, ${appData.max_client_events_per_sec},
        ${appData.max_read_req_per_sec}, ${appData.max_presence_members_per_channel},
        ${appData.max_presence_member_size_in_kb}, ${appData.max_channel_name_length},
        ${appData.max_event_channels_at_once}, ${appData.max_event_name_length},
        ${appData.max_event_payload_in_kb}, ${appData.max_event_batch_size},
        ${appData.webhooks}, ${appData.enable_user_authentication}
      ) RETURNING *
    `

    if (result.length === 0) {
      throw new Error('Failed to create Soketi app')
    }

    const app: SoketiApp = {
      id: result[0].id,
      key: result[0].key,
      secret: result[0].secret,
      max_connections: result[0].max_connections,
      enable_client_messages: result[0].enable_client_messages,
      enabled: result[0].enabled,
      max_backend_events_per_sec: result[0].max_backend_events_per_sec,
      max_client_events_per_sec: result[0].max_client_events_per_sec,
      max_read_req_per_sec: result[0].max_read_req_per_sec,
      max_presence_members_per_channel: result[0].max_presence_members_per_channel,
      max_presence_member_size_in_kb: result[0].max_presence_member_size_in_kb,
      max_channel_name_length: result[0].max_channel_name_length,
      max_event_channels_at_once: result[0].max_event_channels_at_once,
      max_event_name_length: result[0].max_event_name_length,
      max_event_payload_in_kb: result[0].max_event_payload_in_kb,
      max_event_batch_size: result[0].max_event_batch_size,
      webhooks: result[0].webhooks,
      enable_user_authentication: result[0].enable_user_authentication
    }

    return app
  }

  // Find app by id
  static async findById(id: string): Promise<SoketiApp | null> {
    const result = await sql`
      SELECT * FROM apps WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    const app: SoketiApp = {
      id: result[0].id,
      key: result[0].key,
      secret: result[0].secret,
      max_connections: result[0].max_connections,
      enable_client_messages: result[0].enable_client_messages,
      enabled: result[0].enabled,
      max_backend_events_per_sec: result[0].max_backend_events_per_sec,
      max_client_events_per_sec: result[0].max_client_events_per_sec,
      max_read_req_per_sec: result[0].max_read_req_per_sec,
      max_presence_members_per_channel: result[0].max_presence_members_per_channel,
      max_presence_member_size_in_kb: result[0].max_presence_member_size_in_kb,
      max_channel_name_length: result[0].max_channel_name_length,
      max_event_channels_at_once: result[0].max_event_channels_at_once,
      max_event_name_length: result[0].max_event_name_length,
      max_event_payload_in_kb: result[0].max_event_payload_in_kb,
      max_event_batch_size: result[0].max_event_batch_size,
      webhooks: result[0].webhooks,
      enable_user_authentication: result[0].enable_user_authentication
    }

    return app
  }

  // Check if app id already exists
  static async idExists(id: string): Promise<boolean> {
    const result = await sql`
      SELECT 1 FROM apps WHERE id = ${id}
    `

    return result.length > 0
  }
}