import apiClient from '../client'
import type { Recipe, LoadRecipeRequest } from '@/types'

export const recipeService = {
  getRecipe: async (recipeId: string): Promise<Recipe> => {
    const { data } = await apiClient.get<Recipe>(`/recipe/${recipeId}`)
    return data
  },

  loadRecipe: async (request: LoadRecipeRequest): Promise<Recipe> => {
    const { data } = await apiClient.post<Recipe>('/recipe/load', request)
    return data
  },
}
