# ---- deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY .npmrc package.json package-lock.json ./
RUN npm install --ignore-scripts

# ---- builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Dummy values so SDK constructors don't throw at build time.
# These are never used at runtime — real values come from env_file.
ENV DATABASE_URL=postgresql://build:build@localhost/build
ENV CLERK_SECRET_KEY=sk_build_placeholder
ENV CLERK_WEBHOOK_SECRET=whsec_build_placeholder
ENV UPLOADTHING_TOKEN=build_placeholder
ENV ANTHROPIC_API_KEY=sk-ant-build-placeholder
ENV GEMINI_API_KEY=build_placeholder
ENV RESEND_API_KEY=re_build_placeholder
ENV SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Real Clerk public key required — Clerk validates its format during static generation.
# NEXT_PUBLIC_* keys are safe to use as build args (they are embedded in the client bundle).
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN npm run build

# ---- runner stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
