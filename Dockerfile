# ==========================================
# STAGE 1: deps — install all dependencies (including dev) once.
# Reused by both the production builder and the dev compose target.
# ==========================================

FROM node:25-slim AS deps

WORKDIR /app

# pnpm + libc deps so sharp / native modules can compile if needed.
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ==========================================
# STAGE 2: dev — deps + source, but no `next build`.
#   docker-compose.dev.yml targets this stage and runs `next dev`. Compose
#   Watch syncs subsequent file edits on top of this initial snapshot.
# ==========================================

FROM node:25-slim AS dev

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@9

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# ==========================================
# STAGE 3: builder — produce the standalone output.
#   NEXT_PUBLIC_* vars are inlined at build time, so they MUST be passed
#   as --build-arg (docker-compose `build.args` handles this).
# ==========================================

FROM node:25-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@9

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# ==========================================
# STAGE 4: production — minimal runtime image.
#   Copies only the standalone server + static + public. No node_modules
#   install needed — everything traced is in .next/standalone.
# ==========================================

FROM node:25-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run the server as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
