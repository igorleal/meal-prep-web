import apiClient from '../client'

export interface IngredientConversionRequest {
  ingredient: string
  currentAmount: string
}

export interface IngredientConversionResponse {
  ingredient: string
  originalAmount: string
  grams: string
  milliliters: string
  tablespoons: string
  cups: string
  explanation: string
}

export const ingredientService = {
  convertUnit: async (
    request: IngredientConversionRequest
  ): Promise<IngredientConversionResponse> => {
    const { data } = await apiClient.post<IngredientConversionResponse>(
      '/ingredients/convert-unit',
      request
    )
    return data
  },
}
