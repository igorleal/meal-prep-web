import { http, HttpResponse, delay } from 'msw'
import {
  mockUser,
  mockToken,
  mockMealPlans,
  mockFamilyPlans,
  mockFoodFriends,
  generateMockRecipes,
} from './data'

export const handlers = [
  // Config handlers
  http.get('/api/config/focus-areas', async () => {
    await delay(200)
    return HttpResponse.json([
      'HIGH_PROTEIN',
      'LOW_CARB',
      'KETO',
      'BALANCED',
      'QUICK_MEALS',
      'BUDGET_FRIENDLY',
      'LONG_LASTING',
      'ECO_FRIENDLY',
    ])
  }),

  // Auth handlers
  http.post('/api/dev-auth/login', async () => {
    await delay(500)
    return HttpResponse.json({ token: mockToken })
  }),

  // User handlers
  http.get('/api/user/me', async () => {
    await delay(300)
    return HttpResponse.json(mockUser)
  }),

  http.put('/api/user/me', async ({ request }) => {
    await delay(300)
    const updates = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...mockUser, ...updates })
  }),

  http.put('/api/user/restrictions', async ({ request }) => {
    await delay(300)
    const restrictions = (await request.json()) as string[]
    mockUser.restrictions = restrictions
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('/api/user/language', async ({ request }) => {
    await delay(300)
    const { language } = (await request.json()) as { language: string }
    mockUser.language = language as 'en' | 'pt' | 'sv'
    return new HttpResponse(null, { status: 204 })
  }),

  // ReceitAI Plan handlers
  http.post('/api/meal-prep-plan/generate-recipes', async () => {
    // Simulate AI generation time
    await delay(2000)
    const recipes = generateMockRecipes(6)
    return HttpResponse.json(recipes)
  }),

  http.post('/api/meal-prep-plan', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/meal-prep-plan', async () => {
    await delay(500)
    return HttpResponse.json(mockMealPlans)
  }),

  http.delete('/api/meal-prep-plan/:planId', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  // Family Plan handlers
  http.post('/api/family-plan/generate-recipes', async () => {
    await delay(1500)
    const recipes = generateMockRecipes(4)
    return HttpResponse.json(recipes)
  }),

  http.post('/api/family-plan', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/family-plan', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    // Filter family plans by date range
    const filteredPlans = mockFamilyPlans.filter((plan) => {
      const planDate = plan.request.date
      return (!startDate || planDate >= startDate) && (!endDate || planDate <= endDate)
    })

    return HttpResponse.json(filteredPlans)
  }),

  http.delete('/api/family-plan/:planId', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  // Food Friends handlers
  http.post('/api/food-friends/generate-recipes', async () => {
    await delay(1500)
    const recipes = generateMockRecipes(4)
    return HttpResponse.json(recipes)
  }),

  http.post('/api/food-friends', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/food-friends', async () => {
    await delay(500)
    return HttpResponse.json(mockFoodFriends)
  }),

  http.delete('/api/food-friends/:planId', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),
]
