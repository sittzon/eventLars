FROM node:22-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY src/ ./src
COPY static/ ./static
COPY svelte.config.js tsconfig.json vite.config.ts ./
RUN npm run build

# --- Runtime stage ---
FROM node:22-slim AS runner
WORKDIR /app
# Only copy production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy built files and static assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static
COPY --from=builder /app/svelte.config.js ./svelte.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

EXPOSE 3000
ENTRYPOINT [ "node", "build/index.js" ]