# Stage 1: Builder
FROM node:alpine3.21 AS builder

# Set the working directory
WORKDIR /workspace

# Copy all the necessary files for building
COPY app ./app
COPY api ./api
COPY ./entrypoint.sh ./api/entrypoint.sh

# Add necessary permissions to entrypoint.sh
RUN chmod +x ./api/entrypoint.sh

# Install frontend dependencies and build the frontend in /app directory
WORKDIR /workspace/app
RUN yarn install --frozen-lockfile
RUN yarn build

# Remove the /app directory after build to reduce size
RUN rm -rf /workspace/app

# Move to the API directory and install backend dependencies
WORKDIR /workspace/api
RUN yarn install --frozen-lockfile

# Build the main application and migration runner
RUN yarn build:main && yarn build:run_migrations

# Remove node_modules to reduce image size
RUN rm -rf node_modules

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Stage 2: Production Image
FROM node:alpine3.21 AS production

# Set the working directory
WORKDIR /workspace

# Copy only necessary files from the builder stage
COPY --from=builder /workspace/api /workspace/api

# Expose the application port
EXPOSE 3000

# Set the entrypoint script for the container
ENTRYPOINT ["sh", "/workspace/api/entrypoint.sh"]

# Run migrations and start the application
CMD ["sh", "-c", "sleep 10 && node /workspace/api/dist/run_migrations.cjs && node /workspace/api/dist/main.cjs"]