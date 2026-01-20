import api from '../client'
import type { Recipe } from '@/types'

export const favoriteService = {
  getFavorites: async (): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>('/recipe/favorite')
    return response.data
  },

  addFavorite: async (recipeId: string): Promise<void> => {
    await api.post(`/recipe/${recipeId}/favorite`)
  },

  removeFavorite: async (recipeId: string): Promise<void> => {
    await api.delete(`/recipe/${recipeId}/favorite`)
  },
}
