# ──────────────────────────────────────────────────────────────
# 🐳 DOCKERFILE - Condo Manager (Railway Deployment)
# Two-stage build: Frontend + Backend compiled together
# ──────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy monorepo structure
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json tsconfig.base.json ./

# Copy all workspace packages
COPY artifacts ./artifacts
COPY lib ./lib
COPY scripts ./scripts

# Install dependencies (deterministic)
RUN pnpm install --frozen-lockfile

# Provide sane defaults for build-time environment variables so Vite configs
# that require `PORT` or `BASE_PATH` do not throw during image build.
# Also set NODE_ENV=production to keep build optimized.
ENV NODE_ENV=production
ENV PORT=5000
ENV BASE_PATH=/

# Build only the necessary workspaces (backend + frontend). This avoids
# failing the production build when optional dev-only packages (like
# `mockup-sandbox`) require extra runtime envs during their Vite build.
# Using workspace filters reduces build time and fixes the reported error.
RUN pnpm -r --filter "./artifacts/api-server" --filter "./artifacts/conserje" --if-present run build

# ──────────────────────────────────────────────────────────────
# Production Stage
# ──────────────────────────────────────────────────────────────

FROM node:22-alpine

RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Install only production dependencies
RUN pnpm install --no-frozen-lockfile --prod

# Copy built backend from builder
COPY --from=builder /app/artifacts/api-server/dist ./dist

# Copy built frontend static files to be served by backend
COPY --from=builder /app/artifacts/conserje/dist/public ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/healthz', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend server
CMD ["node", "dist/index.mjs"]
