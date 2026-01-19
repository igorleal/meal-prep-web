import apiClient from '../client'
import type {
  GenerateFamilyPlanRequest,
  CreateFamilyPlanRequest,
  FamilyPlanResponse,
  Recipe,
} from '@/types'

export const familyPlanService = {
  generateRecipes: async (params: GenerateFamilyPlanRequest): Promise<Recipe[]> => {
    const { data } = await apiClient.post<Recipe[]>('/family-plan/generate-recipes', params)
    return data
  },

  createPlan: async (params: CreateFamilyPlanRequest): Promise<void> => {
    await apiClient.post('/family-plan', params)
  },

  getPlans: async (startDate: string, endDate: string): Promise<FamilyPlanResponse[]> => {
    const { data } = await apiClient.get<FamilyPlanResponse[]>('/family-plan', {
      params: { startDate, endDate },
    })
    return data
  },
}
