import apiClient from '../client'
import type { Recipe } from '@/types'

export const recipeService = {
  getRecipe: async (recipeId: string): Promise<Recipe> => {
    const { data } = await apiClient.get<Recipe>(`/recipe/${recipeId}`)
    return data
  },
}
