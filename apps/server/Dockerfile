FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/server/package.json apps/server/package.json
COPY packages packages
RUN pnpm install --frozen-lockfile=false

FROM deps AS build
COPY apps/server apps/server
RUN pnpm --filter @collabflow/server build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY apps/server/package.json apps/server/package.json
EXPOSE 4000
CMD ["node", "apps/server/dist/index.js"]
