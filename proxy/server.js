const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  console.error('[Proxy] ERROR: BACKEND_URL environment variable is not set');
  process.exit(1);
}

console.log(`[Proxy] Starting with BACKEND_URL: ${BACKEND_URL}`);

// Google Auth client for fetching ID tokens
const auth = new GoogleAuth();

// Token cache
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetches an ID token for the target audience (backend URL)
 * Caches the token to avoid fetching on every request
 */
async function getIdToken() {
  const now = Date.now();

  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && now < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  try {
    console.log('[Proxy] Fetching new IAM ID token...');
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();

    // Extract token from Authorization header
    const authHeader = headers.Authorization || headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      cachedToken = authHeader.substring(7);
      // Tokens are valid for ~1 hour, cache for 50 minutes
      tokenExpiry = now + 50 * 60 * 1000;
      console.log('[Proxy] Successfully fetched IAM ID token');
      return cachedToken;
    }

    throw new Error('No Authorization header in response');
  } catch (error) {
    console.error('[Proxy] Failed to fetch IAM ID token:', error.message);
    // In development/local environment, IAM tokens won't work
    // Return null and let the request proceed without IAM token
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', proxy: true });
});

// Proxy middleware for all /api/* requests
app.use('/api', async (req, res, next) => {
  try {
    // Get IAM token
    const iamToken = await getIdToken();

    // Add IAM token to request headers if available
    if (iamToken) {
      // Use X-Serverless-Authorization for Cloud Run service-to-service auth
      req.headers['x-serverless-authorization'] = `Bearer ${iamToken}`;
    }

    // Log the request (without sensitive data)
    console.log(`[Proxy] ${req.method} ${req.path} -> ${BACKEND_URL}${req.path}`);

    next();
  } catch (error) {
    console.error('[Proxy] Error preparing request:', error.message);
    res.status(500).json({ error: 'Proxy error' });
  }
}, createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to backend
  },
  onProxyReq: (proxyReq, req) => {
    // Ensure headers are properly forwarded
    if (req.headers['x-serverless-authorization']) {
      proxyReq.setHeader('X-Serverless-Authorization', req.headers['x-serverless-authorization']);
    }
  },
  onProxyRes: (proxyRes, req) => {
    console.log(`[Proxy] Response: ${proxyRes.statusCode} for ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Proxy error:', err.message);
    res.status(502).json({ error: 'Bad gateway', message: err.message });
  },
}));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Proxy] Server listening on 127.0.0.1:${PORT}`);
});
