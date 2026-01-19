import type { ReceitAIPlanResponse, FamilyPlanResponse, FoodFriendsResponse } from '@/types'
import { mockRecipes } from './recipes'

export const mockMealPlans: ReceitAIPlanResponse[] = [
  {
    request: {
      id: 'plan-001',
      userId: 'user-001',
      name: 'High Protein Week 4',
      focusAreas: { HIGH_PROTEIN: 5, BALANCED: 3 },
      goal: { calories: 2200, protein: 180, carbs: 200, fats: 75 },
      mustHaves: ['chicken', 'eggs'],
      exclusions: ['shellfish'],
      restrictions: ['dairy-free'],
      mealsPerDay: 3,
      days: 7,
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[0],
  },
  {
    request: {
      id: 'plan-002',
      userId: 'user-001',
      name: 'Summer Keto Reset',
      focusAreas: { KETO: 5, LOW_CARB: 4 },
      goal: { calories: 1800, protein: 120, carbs: 30, fats: 140 },
      mustHaves: ['avocado', 'salmon'],
      exclusions: ['grains'],
      restrictions: ['keto'],
      mealsPerDay: 3,
      days: 7,
      createdAt: '2026-01-08T14:30:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[2],
  },
  {
    request: {
      id: 'plan-003',
      userId: 'user-001',
      name: 'Vegetarian Delight',
      focusAreas: { BALANCED: 5, ECO_FRIENDLY: 4 },
      goal: { calories: 2000, protein: 80, carbs: 250, fats: 70 },
      mustHaves: ['tofu', 'lentils'],
      exclusions: ['meat', 'fish'],
      restrictions: ['vegetarian'],
      mealsPerDay: 3,
      days: 5,
      createdAt: '2026-01-05T09:15:00Z',
      updatedAt: '2026-01-06T11:00:00Z',
    },
    recipe: mockRecipes[5],
  },
  {
    request: {
      id: 'plan-004',
      userId: 'user-001',
      name: 'Quick & Easy Meals',
      focusAreas: { QUICK_MEALS: 5, BUDGET_FRIENDLY: 4 },
      goal: { calories: 2000, protein: 100, carbs: 220, fats: 80 },
      mustHaves: ['pasta', 'chicken'],
      exclusions: [],
      restrictions: [],
      mealsPerDay: 3,
      days: 7,
      createdAt: '2026-01-02T16:45:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[3],
  },
]

export const mockFamilyPlans: FamilyPlanResponse[] = [
  {
    request: {
      id: 'family-001',
      userId: 'user-001',
      date: '2026-01-19',
      mustHaves: ['chicken', 'vegetables'],
      restrictions: ['gluten-free'],
      exclusions: ['mushrooms'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[0],
  },
  {
    request: {
      id: 'family-002',
      userId: 'user-001',
      date: '2026-01-20',
      mustHaves: ['salmon'],
      restrictions: [],
      exclusions: [],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[2],
  },
  {
    request: {
      id: 'family-003',
      userId: 'user-001',
      date: '2026-01-21',
      mustHaves: ['pasta'],
      restrictions: [],
      exclusions: ['seafood'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[3],
  },
]

export const mockFoodFriends: FoodFriendsResponse[] = [
  {
    request: {
      id: 'friends-001',
      userId: 'user-001',
      name: 'Friday Game Night',
      mustHaves: ['finger foods'],
      restrictions: ['vegetarian options'],
      exclusions: ['nuts'],
      createdAt: '2026-01-10T14:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[4],
  },
  {
    request: {
      id: 'friends-002',
      userId: 'user-001',
      name: "Mom's Birthday Brunch",
      mustHaves: ['eggs', 'avocado'],
      restrictions: [],
      exclusions: [],
      createdAt: '2026-01-08T09:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[4],
  },
  {
    request: {
      id: 'friends-003',
      userId: 'user-001',
      name: 'Thanksgiving Potluck',
      mustHaves: ['turkey'],
      restrictions: ['gluten-free options'],
      exclusions: [],
      createdAt: '2026-01-05T11:00:00Z',
      updatedAt: null,
    },
    recipe: mockRecipes[3],
  },
]
