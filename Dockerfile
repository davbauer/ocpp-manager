# Stage 1: Builder
FROM node:20-alpine3.21 AS builder

# Enable Corepack (needed for Yarn 4.x)
RUN corepack enable

# Set the working directory
WORKDIR /workspace

# Copy all necessary files
COPY app ./app
COPY api ./api
COPY ./entrypoint.sh ./api/entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./api/entrypoint.sh

# Ensure .env files exist
RUN [ -f ./app/.env ] || ([ -f ./app/.env.example ] && cp ./app/.env.example ./app/.env)
RUN [ -f ./api/.env ] || ([ -f ./api/.env.example ] && cp ./api/.env.example ./api/.env)

# --- Frontend Build ---
WORKDIR /workspace/app
RUN yarn install --frozen-lockfile
RUN yarn build
RUN rm -rf /workspace/app

# --- Backend Build ---
WORKDIR /workspace/api
RUN yarn install --frozen-lockfile
RUN yarn build:main && yarn build:run_migrations

# Remove dev dependencies
RUN rm -rf node_modules
RUN yarn workspaces focus --production || yarn install --frozen-lockfile --production

# Stage 2: Production
FROM node:20-alpine3.21 AS production

WORKDIR /workspace/api

# Copy only the built API from builder
COPY --from=builder /workspace/api /workspace/api

EXPOSE 3000

ENTRYPOINT ["sh", "./entrypoint.sh"]

CMD ["sh", "-c", "sleep 10 && node dist/run_migrations.cjs && node dist/main.cjs"]
