# Multi-stage build for React + Express app

# Stage 1: Build the React frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Production image with Express server
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built React app from builder stage
COPY --from=builder /app/dist ./dist

# Copy the Express server
COPY server.js ./

# Create context directory (will be mounted as volume in production)
RUN mkdir -p /app/context

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV CONTEXT_DIR=/app/context

# Start the Express server
CMD ["node", "server.js"]
