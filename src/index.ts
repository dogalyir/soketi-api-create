import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { zValidator } from '@hono/zod-validator'
import { CreateSoketiAppSchema } from './validation/schemas'
import { SoketiAppRepository } from './db/repository'
import { createTables } from './db/schema'

const app = new Hono()

// Initialize database tables on startup
createTables().catch(console.error)

// Basic authentication middleware using Hono's built-in basicAuth
const authMiddleware = basicAuth({
  username: process.env.API_USERNAME || 'admin',
  password: process.env.API_PASSWORD || 'password'
})

// Health check endpoint (public)
app.get('/', (c) => {
  return c.json({
    message: 'Soketi API Create Service',
    version: '1.0.0',
    status: 'healthy'
  })
})

// Protected endpoint for creating Soketi apps
app.post('/apps', authMiddleware, zValidator('json', CreateSoketiAppSchema), async (c) => {
  try {
    const data = c.req.valid('json')

    // Check if app id already exists
    const exists = await SoketiAppRepository.idExists(data.id)
    if (exists) {
      return c.json(
        { error: 'App ID already exists' },
        409
      )
    }

    // Create the app in database with Soketi's official schema using received credentials
    const app = await SoketiAppRepository.createApp({
      id: data.id,
      key: data.key,
      secret: data.secret,
      max_connections: data.max_connections,
      enable_client_messages: data.enable_client_messages,
      enabled: 1, // Default enabled
      max_backend_events_per_sec: -1, // Unlimited
      max_client_events_per_sec: -1, // Unlimited
      max_read_req_per_sec: -1, // Unlimited
      max_presence_members_per_channel: null,
      max_presence_member_size_in_kb: null,
      max_channel_name_length: null,
      max_event_channels_at_once: null,
      max_event_name_length: null,
      max_event_payload_in_kb: null,
      max_event_batch_size: null,
      webhooks: null,
      enable_user_authentication: 1 // Default enabled
    })

    // Return success response with credentials
    return c.json({
      success: true,
      app: {
        id: app.id,
        key: app.key,
        secret: app.secret,
        max_connections: app.max_connections,
        enable_client_messages: app.enable_client_messages,
        enabled: app.enabled,
        max_backend_events_per_sec: app.max_backend_events_per_sec,
        max_client_events_per_sec: app.max_client_events_per_sec,
        max_read_req_per_sec: app.max_read_req_per_sec,
        max_presence_members_per_channel: app.max_presence_members_per_channel,
        max_presence_member_size_in_kb: app.max_presence_member_size_in_kb,
        max_channel_name_length: app.max_channel_name_length,
        max_event_channels_at_once: app.max_event_channels_at_once,
        max_event_name_length: app.max_event_name_length,
        max_event_payload_in_kb: app.max_event_payload_in_kb,
        max_event_batch_size: app.max_event_batch_size,
        webhooks: app.webhooks,
        enable_user_authentication: app.enable_user_authentication
      }
    }, 201)

  } catch (error) {
    console.error('Error creating Soketi app:', error)
    return c.json(
      { error: 'Internal server error' },
      500
    )
  }
})


export default app
