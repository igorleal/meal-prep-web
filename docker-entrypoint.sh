#!/bin/sh
set -e

# Default values
export PORT="${PORT:-8080}"
export PROXY_PORT="${PROXY_PORT:-3001}"
export BACKEND_URL="${BACKEND_URL:-}"

echo "============================================"
echo "Starting meal-prep-web container"
echo "============================================"
echo "PORT: ${PORT}"
echo "PROXY_PORT: ${PROXY_PORT}"
echo "BACKEND_URL: ${BACKEND_URL}"
echo "============================================"

# Generate runtime environment config from template
if [ -f /usr/share/nginx/html/env-config.template.js ]; then
  envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js
  echo "Generated env-config.js"
fi

# Start the proxy server in the background
echo "Starting proxy server..."
cd /proxy
node server.js &
PROXY_PID=$!

# Wait a moment for proxy to start
sleep 1

# Check if proxy started successfully
if ! kill -0 $PROXY_PID 2>/dev/null; then
  echo "ERROR: Proxy server failed to start"
  exit 1
fi

echo "Proxy server started with PID: $PROXY_PID"

# Start nginx in the foreground
echo "Starting nginx..."
exec nginx -g "daemon off;"
