#!/bin/bash
set -e

bun install --frozen-lockfile
bun x tsc --noEmit

bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun-linux-x64-musl \
  --outfile server \
  src/index.ts