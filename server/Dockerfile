# ---- Base Stage ----
# Use a specific Node.js version on Alpine Linux for a small and secure base
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
# This stage is dedicated to installing ALL dependencies (dev and prod)
# It leverages Docker's layer caching effectively.
FROM base AS dependencies
COPY package.json package-lock.json* ./
# Install all dependencies needed for the build
RUN npm install

# ---- Build Stage ----
# This stage builds the application. It reuses the node_modules from the previous stage.
FROM base AS builder
# Copy the installed dependencies from the 'dependencies' stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .
# Build the NestJS application
RUN npm run build

# ---- Production Stage ----
# This is the final, lean image that will be deployed.
FROM base AS production
ENV NODE_ENV=production
# Copy only the production package.json and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
# Copy the built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist
# Command to run the application
CMD ["node", "dist/main"]