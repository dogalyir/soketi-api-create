# Soketi API Create Service

A simple API service built with Bun.sh and Hono for creating Soketi apps with PostgreSQL storage.

## Features

- Single protected endpoint for creating Soketi apps
- Basic authentication
- PostgreSQL database integration using Bun's native SQL support
- Zod validation for request data
- Docker containerization
- GitHub CI/CD for automated builds and deployment

## Prerequisites

- Bun.sh
- PostgreSQL database

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

## Production Deployment

### Docker

Build and run with Docker:

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

### GitHub Container Registry

The CI/CD workflow automatically builds and publishes Docker images to GitHub Container Registry on pushes to main/master branch.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `API_USERNAME`: Basic authentication username
- `API_PASSWORD`: Basic authentication password
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Database Schema

The service creates a `soketi_apps` table with the following structure:

- `id`: Primary key
- `app_id`: Unique app identifier
- `app_key`: Generated app key
- `app_secret`: Generated app secret
- `max_connections`: Maximum allowed connections
- `enable_client_messages`: Enable client messages
- `enable_statistics`: Enable statistics
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
