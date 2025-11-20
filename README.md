# Soketi API Create Service

A production-ready API service built with Bun.sh and Hono for creating Soketi apps with PostgreSQL storage. This service implements Soketi's official database schema for seamless integration.

## Features

- Complete Soketi app creation with official database schema
- Basic authentication for protected endpoints
- PostgreSQL database integration using Bun's native SQL support
- Zod validation for request data with comprehensive field validation
- Automatic database table initialization on startup
- Duplicate app ID prevention
- Two Docker variants: Alpine-based and ultra-minimal Distroless
- GitHub CI/CD for automated builds and deployment to GitHub Container Registry
- Rate limiting configuration with sensible defaults
- Webhooks support for event notifications

## Technology Stack

- **Runtime**: Bun.sh 1.0+ with TypeScript
- **Web Framework**: Hono 4.x
- **Database**: PostgreSQL with Bun's native SQL support
- **Validation**: Zod with Hono integration
- **Authentication**: Basic Auth
- **Containerization**: Docker with Alpine and Distroless variants
- **CI/CD**: GitHub Actions

## Prerequisites

- Bun.sh 1.0+
- PostgreSQL database

## Project Structure

```
src/
├── index.ts          # Main application entry point
├── db/
│   ├── schema.ts     # Database schema definition
│   └── repository.ts # Database operations
└── validation/
    └── schemas.ts    # Zod validation schemas
```

## Installation

1. Install dependencies:
```sh
bun install
```

2. Copy environment variables:
```sh
cp .env.example .env
```

3. Update `.env` with your database and authentication settings.

## Development

To run in development mode:
```sh
bun run dev
```

Open http://localhost:3000

## API Endpoints

### Health Check (Public)

```http
GET /
```

**Response:**
```json
{
  "message": "Soketi API Create Service",
  "version": "1.0.0",
  "status": "healthy"
}
```

### Create Soketi App (Protected)

```http
POST /apps
Authorization: Basic <base64-encoded-username:password>
Content-Type: application/json

{
  "id": "my-app",
  "key": "your-app-key",
  "secret": "your-app-secret",
  "max_connections": 100,
  "enable_client_messages": 1
}
```

**Success Response (201):**
```json
{
  "success": true,
  "app": {
    "id": "my-app",
    "key": "your-app-key",
    "secret": "your-app-secret",
    "max_connections": 100,
    "enable_client_messages": 1,
    "enabled": 1,
    "max_backend_events_per_sec": -1,
    "max_client_events_per_sec": -1,
    "max_read_req_per_sec": -1,
    "max_presence_members_per_channel": null,
    "max_presence_member_size_in_kb": null,
    "max_channel_name_length": null,
    "max_event_channels_at_once": null,
    "max_event_name_length": null,
    "max_event_payload_in_kb": null,
    "max_event_batch_size": null,
    "webhooks": null,
    "enable_user_authentication": 1
  }
}
```

**Error Responses:**
- `409 Conflict` - App ID already exists
- `500 Internal Server Error` - Database or server error

## Production Deployment

### Docker

Two Docker variants are available:

**Alpine-based (recommended for most use cases):**
```sh
# Build the image
docker build -t soketi-api-create .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e API_USERNAME=admin \
  -e API_PASSWORD=secure_password \
  soketi-api-create
```

**Distroless-based (ultra-minimal, security-focused):**
```sh
# Build the image
docker build -f Dockerfile.distroless -t soketi-api-create-distroless .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e API_USERNAME=admin \
  -e API_PASSWORD=secure_password \
  soketi-api-create-distroless
```

### GitHub Container Registry

The CI/CD workflow automatically builds and publishes both Docker variants to GitHub Container Registry on pushes to main/master branch:

- `ghcr.io/your-org/soketi-api-create:alpine-latest`
- `ghcr.io/your-org/soketi-api-create:distroless-latest`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `API_USERNAME`: Basic authentication username
- `API_PASSWORD`: Basic authentication password
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Database Schema

The service automatically creates an `apps` table matching Soketi's official database schema on startup:

```sql
CREATE TABLE apps (
  id VARCHAR(255) PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  secret VARCHAR(255) NOT NULL,
  max_connections INTEGER NOT NULL,
  enable_client_messages SMALLINT NOT NULL,
  enabled SMALLINT NOT NULL,
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
```

**Default Configuration:**
- Apps are enabled by default (`enabled: 1`)
- Rate limits are unlimited by default (`-1` values)
- User authentication is enabled by default
- All optional limits are set to `NULL` (unlimited)
- Webhooks are disabled by default (`NULL`)
