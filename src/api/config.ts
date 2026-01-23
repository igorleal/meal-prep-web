export type ApiMode = 'mock' | 'local' | 'production'

// Type declaration for runtime environment config (injected at container startup)
declare global {
  interface Window {
    __ENV__?: {
      BACKEND_URL?: string
      API_MODE?: string
    }
  }
}

/**
 * Get API mode from runtime config (production) or build-time env (development)
 */
export const getApiMode = (): ApiMode => {
  // Check runtime config first (for production/Cloud Run)
  const runtimeMode = window.__ENV__?.API_MODE
  if (runtimeMode === 'production' || runtimeMode === 'local' || runtimeMode === 'mock') {
    return runtimeMode
  }

  // Fall back to Vite build-time environment variable (for development)
  const buildTimeMode = import.meta.env.VITE_API_MODE
  if (buildTimeMode === 'local') return 'local'
  if (buildTimeMode === 'production') return 'production'

  return 'mock'
}

/**
 * Get the API base URL based on current mode
 */
export const getBaseUrl = (): string => {
  const mode = getApiMode()

  switch (mode) {
    case 'production':
      // In production, API calls go through the nginx proxy at /api
      // The proxy handles forwarding to BACKEND_URL with IAM authentication
      return '/api'

    case 'local':
      return 'http://localhost:8080'

    case 'mock':
    default:
      return '/api'
  }
}

export const API_CONFIG = {
  get mode() {
    return getApiMode()
  },
  get baseUrl() {
    return getBaseUrl()
  },
} as const
