import apiClient from '../client'
import type {
  GenerateReceitAIPlanRequest,
  CreateReceitAIPlanRequest,
  ReceitAIPlanResponse,
  Recipe,
} from '@/types'

export const receitaiPlanService = {
  generateRecipes: async (params: GenerateReceitAIPlanRequest): Promise<Recipe[]> => {
    const { data } = await apiClient.post<Recipe[]>('/meal-prep-plan/generate-recipes', params)
    return data
  },

  createPlan: async (params: CreateReceitAIPlanRequest): Promise<void> => {
    await apiClient.post('/meal-prep-plan', params)
  },

  getPlans: async (): Promise<ReceitAIPlanResponse[]> => {
    const { data } = await apiClient.get<ReceitAIPlanResponse[]>('/meal-prep-plan')
    return data
  },

  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`/meal-prep-plan/${planId}`)
  },

  regenerateRecipes: async (requestId: string): Promise<Recipe[]> => {
    const { data } = await apiClient.post<Recipe[]>(`/meal-prep-plan/regenerate-recipes/${requestId}`)
    return data
  },

  createPlanFromRecipe: async (params: { name: string; recipeId: string }): Promise<void> => {
    await apiClient.post('/meal-prep-plan/from-recipe', params)
  },
}
