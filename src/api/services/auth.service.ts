import apiClient from '../client'
import type { LoginResponse, User } from '@/types'

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    // For dev environment, use the dev-auth endpoint
    const { data } = await apiClient.post<LoginResponse>('/dev-auth/login', { email, password })

    // After getting token, fetch user details
    const userResponse = await apiClient.get<User>('/user/me', {
      headers: { Authorization: `Bearer ${data.token}` },
    })

    return {
      token: data.token,
      user: userResponse.data,
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/user/me')
    return data
  },
}
