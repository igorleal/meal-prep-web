# ============================================
# Stage 1: Build the React application
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production server with nginx + proxy
# ============================================
FROM node:20-alpine AS production

# Install nginx and gettext (for envsubst)
RUN apk add --no-cache nginx gettext

# Create nginx directories
RUN mkdir -p /run/nginx /var/log/nginx

# Remove default nginx config
RUN rm -f /etc/nginx/http.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the runtime config template
COPY env-config.template.js /usr/share/nginx/html/env-config.template.js

# Set up proxy server
WORKDIR /proxy
COPY proxy/package*.json ./
RUN npm ci --only=production
COPY proxy/server.js ./

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Cloud Run sets PORT environment variable (default 8080)
ENV PORT=8080
ENV PROXY_PORT=3001

EXPOSE 8080

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
