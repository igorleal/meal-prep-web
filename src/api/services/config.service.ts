import apiClient from '../client'

export const configService = {
  getFocusAreas: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/config/focus-areas')
    return data
  },
}
