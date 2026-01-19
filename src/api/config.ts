export type ApiMode = 'mock' | 'local'

export const getApiMode = (): ApiMode => {
  const mode = import.meta.env.VITE_API_MODE
  return mode === 'local' ? 'local' : 'mock'
}

export const API_CONFIG = {
  mode: getApiMode(),
  baseUrl: {
    mock: '/api',
    local: 'http://localhost:8080',
  },
} as const

export const getBaseUrl = (): string => {
  return API_CONFIG.mode === 'local' ? API_CONFIG.baseUrl.local : API_CONFIG.baseUrl.mock
}
