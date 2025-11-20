import { z } from 'zod'

// Schema for creating a Soketi app matching official schema
export const CreateSoketiAppSchema = z.object({
  id: z.string()
    .min(1, 'App ID is required')
    .max(255, 'App ID must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'App ID can only contain letters, numbers, underscores and hyphens'),
  key: z.string()
    .min(1, 'App key is required')
    .max(255, 'App key must be less than 255 characters'),
  secret: z.string()
    .min(1, 'App secret is required')
    .max(255, 'App secret must be less than 255 characters'),
  max_connections: z.number()
    .int('Max connections must be an integer')
    .min(1, 'Max connections must be at least 1')
    .max(100000, 'Max connections cannot exceed 100,000')
    .optional()
    .default(100),
  enable_client_messages: z.number()
    .int('Enable client messages must be 0 or 1')
    .min(0, 'Enable client messages must be 0 or 1')
    .max(1, 'Enable client messages must be 0 or 1')
    .optional()
    .default(1)
})

export type CreateSoketiAppInput = z.infer<typeof CreateSoketiAppSchema>