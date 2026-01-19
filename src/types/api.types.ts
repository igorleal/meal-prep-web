// Common API types

export type Unit =
  | 'GRAMS'
  | 'MILLILITERS'
  | 'LITERS'
  | 'DECILITERS'
  | 'TABLESPOONS'
  | 'TEASPOONS'

export type FocusArea =
  | 'HIGH_PROTEIN'
  | 'LOW_CARB'
  | 'KETO'
  | 'BALANCED'
  | 'QUICK_MEALS'
  | 'BUDGET_FRIENDLY'
  | 'LONG_LASTING'
  | 'ECO_FRIENDLY'

export interface Macros {
  calories?: number | null
  protein?: number | null
  carbs?: number | null
  fats?: number | null
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: Unit
}

export interface Recipe {
  id: string
  requestId: string
  name: string
  description: string
  servings: number
  ingredients: RecipeIngredient[]
  instructions: string
  macros: Macros
  createdAt: string
  tags?: string[]
  cookTime?: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

// User types
export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  restrictions?: string[]
  preferences?: Record<string, unknown>
}

export interface UpdateUserRequest {
  name?: string
  restrictions?: string[]
  preferences?: Record<string, unknown>
}
