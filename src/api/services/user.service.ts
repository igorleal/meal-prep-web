import apiClient from '../client'
import type { User, SupportedLanguage } from '@/types'

export const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/user/me')
    return data
  },

  updateRestrictions: async (restrictions: string[]): Promise<void> => {
    await apiClient.put('/user/restrictions', restrictions)
  },

  updateLanguage: async (language: SupportedLanguage): Promise<void> => {
    await apiClient.put('/user/language', { language })
  },
}
