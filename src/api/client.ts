import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getBaseUrl, getApiMode } from './config'
import { storage } from '@/utils/storage'

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('[API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      headers: error.config?.headers,
      data: error.response?.data,
    })

    // Temporarily disabled auto-redirect to debug
    // if (error.response?.status === 401) {
    //   storage.clear()
    //   window.location.href = '/login'
    // }
    return Promise.reject(error)
  }
)

// Log API mode on startup
if (import.meta.env.DEV) {
  console.log(`[API] Mode: ${getApiMode()}, Base URL: ${getBaseUrl()}`)
}

export default apiClient
