import apiClient from '../client'
import type {
  GenerateFoodFriendsRequest,
  CreateFoodFriendsRequest,
  FoodFriendsResponse,
  Recipe,
} from '@/types'

export const foodFriendsService = {
  generateRecipes: async (params: GenerateFoodFriendsRequest): Promise<Recipe[]> => {
    const { data } = await apiClient.post<Recipe[]>('/food-friends/generate-recipes', params)
    return data
  },

  createEvent: async (params: CreateFoodFriendsRequest): Promise<void> => {
    await apiClient.post('/food-friends', params)
  },

  getEvents: async (): Promise<FoodFriendsResponse[]> => {
    const { data } = await apiClient.get<FoodFriendsResponse[]>('/food-friends')
    return data
  },

  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/food-friends/${planId}`)
  },
}
