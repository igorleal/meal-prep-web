import type { FocusArea, Macros, Recipe } from './api.types'

// ReceitAI Plan types
export interface GenerateReceitAIPlanRequest {
  name: string
  focusAreas: Partial<Record<FocusArea, number>>
  goal?: Macros
  mustHaves: string[]
  exclusions: string[]
  restrictions: string[]
  mealsPerDay: number
  days: number
}

export interface CreateReceitAIPlanRequest {
  mealPrepPlanRequestId: string
  recipeId: string
}

export interface ReceitAIPlanGenerationRequest {
  id: string
  userId: string
  name: string
  focusAreas: Partial<Record<FocusArea, number>>
  goal?: Macros
  mustHaves: string[]
  exclusions: string[]
  restrictions: string[]
  mealsPerDay: number
  days: number
  createdAt: string
  updatedAt?: string | null
}

export interface ReceitAIPlan {
  id: string
  requestId: string
  recipeId: string
  createdAt: string
}

export interface ReceitAIPlanResponse {
  plan: ReceitAIPlan
  request: ReceitAIPlanGenerationRequest
  recipe: Recipe
}

// Family Plan types
export interface GenerateFamilyPlanRequest {
  date: string
  mustHaves: string[]
  restrictions: string[]
  exclusions: string[]
}

export interface CreateFamilyPlanRequest {
  requestId: string
  recipeId: string
  date: string
}

export interface FamilyPlanGenerationRequest {
  id: string
  userId: string
  date: string
  mustHaves: string[]
  restrictions: string[]
  exclusions: string[]
  createdAt: string
  updatedAt?: string | null
}

export interface FamilyPlan {
  id: string
  requestId: string
  recipeId: string
  createdAt: string
}

export interface FamilyPlanResponse {
  plan: FamilyPlan
  request: FamilyPlanGenerationRequest
  recipe: Recipe
}

// Food Friends types
export interface GenerateFoodFriendsRequest {
  name: string
  eventDate: string
  mustHaves: string[]
  restrictions: string[]
  exclusions: string[]
}

export interface CreateFoodFriendsRequest {
  requestId: string
  recipeId: string
}

export interface FoodFriendsGenerationRequest {
  id: string
  userId: string
  name: string
  mustHaves: string[]
  restrictions: string[]
  exclusions: string[]
  createdAt: string
  updatedAt?: string | null
}

export interface FoodFriendsPlan {
  id: string
  requestId: string
  recipeId: string
  createdAt: string
}

export interface FoodFriendsResponse {
  plan: FoodFriendsPlan
  request: FoodFriendsGenerationRequest
  recipe: Recipe
}

// UI-specific types
export type PlanStatus = 'ai_generated' | 'edited' | 'completed'

export interface MealPlanCard {
  id: string
  name: string
  description?: string
  imageUrl?: string
  status: PlanStatus
  mealsCount: number
  daysCount: number
  createdAt: string
}
