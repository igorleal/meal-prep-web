import apiClient from '../client'

export interface IngredientConversionRequest {
  ingredient: string
  currentAmount: string
}

export type IngredientState = 'RAW' | 'COOKED' | 'DRIED'

export interface StateConversion {
  driedWeight: string | null
  cookedWeight: string | null
  conversionRatio: number
  explanation: string
}

export interface IngredientConversionResponse {
  ingredient: string
  originalAmount: string
  detectedState: IngredientState
  grams: string | null
  milliliters: string | null
  deciliters: string | null
  tablespoons: string | null
  cups: string | null
  stateConversion: StateConversion | null
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
