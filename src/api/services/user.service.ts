import apiClient from '../client'
import type { User } from '@/types'

export const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/user/me')
    return data
  },

  updateRestrictions: async (restrictions: string[]): Promise<void> => {
    await apiClient.put('/user/restrictions', restrictions)
  },
}
