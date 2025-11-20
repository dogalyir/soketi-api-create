# Multi-stage build for production with Alpine
FROM oven/bun:alpine AS builder

WORKDIR /app

# Copy package files and source code in single layer
COPY package.json bun.lock tsconfig.json ./
COPY src ./src

# Install dependencies and build in single RUN to reduce layers
RUN bun install --production --frozen-lockfile && \
    bun build \
        --compile \
        --minify-whitespace \
        --minify-syntax \
        --target bun-linux-x64-musl \
        --outfile server \
        src/index.ts

# Production stage - Alpine minimal
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache ca-certificates libc6-compat wget libstdc++ libgcc && \
    update-ca-certificates && \
    addgroup -g 1001 -S app && \
    adduser -u 1001 -S app -G app

WORKDIR /app

# Copy the compiled binary from builder
COPY --from=builder --chown=app:app /app/server ./

# Switch to non-root user
USER app

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check using wget (lightweight alternative to curl)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["./server"]