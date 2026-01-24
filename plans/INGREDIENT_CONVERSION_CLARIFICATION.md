# Feature: Ingredient Click for Conversion/Clarification

## Overview

Allow users to click on any ingredient in a recipe to get clarification and unit conversions (e.g., tablespoons to grams/milliliters) from the backend.

## Current State

- Ingredients are displayed as plain text with no interactivity
- Rendered in 5 locations:
  - `RecipeDetailModal.tsx` (lines 162-188)
  - `MealPlanRecipeDetailPage.tsx` (lines 244-270)
  - `FavoriteRecipeDetailPage.tsx` (lines 204-230)
  - `SpecialMealRecipeDetailPage.tsx`
  - `FamilyCalendarRecipeDetailPage.tsx`
- Units available: `GRAMS`, `MILLILITERS`, `LITERS`, `DECILITERS`, `TABLESPOONS`, `TEASPOONS`

## Implementation Plan

### 1. Define Types

**File**: `src/types/api.types.ts`

Add new interface for the conversion response:

```typescript
export interface IngredientClarification {
  ingredientName: string
  originalQuantity: number
  originalUnit: Unit
  conversions: {
    unit: Unit
    quantity: number
  }[]
  tip?: string // Optional cooking tip or clarification
}
```

### 2. Create Ingredient Service

**New file**: `src/api/services/ingredient.service.ts`

```typescript
export const ingredientService = {
  getClarification: async (
    ingredientName: string,
    quantity: number,
    unit: Unit
  ): Promise<IngredientClarification> => {
    const { data } = await apiClient.post<IngredientClarification>(
      '/ingredients/clarify',
      { ingredientName, quantity, unit }
    )
    return data
  },
}
```

Export from `src/api/services/index.ts`.

### 3. Create IngredientClarificationModal Component

**New file**: `src/components/common/IngredientClarificationModal.tsx`

Features:
- Modal overlay following existing patterns (see `WeeklyLimitModal.tsx`)
- Display original ingredient with quantity and unit
- Table/list of conversions to other units
- Optional tip/clarification text from backend
- Loading state while fetching
- Error handling
- Close on backdrop click or X button
- Dark mode support

### 4. Create Clickable Ingredient Component

**New file**: `src/components/features/ClickableIngredient.tsx`

```typescript
interface ClickableIngredientProps {
  ingredient: RecipeIngredient
  onClarify: (ingredient: RecipeIngredient) => void
}
```

Features:
- Renders ingredient with hover state (cursor pointer, slight opacity change)
- Visual indicator that it's clickable (subtle underline or icon)
- Accessible (keyboard navigation, role="button")
- Triggers onClarify callback on click

### 5. Update Ingredient Rendering

Modify ingredient lists in all 5 locations to use `ClickableIngredient`:

**Pattern**:
```tsx
const [clarifyingIngredient, setClarifyingIngredient] = useState<RecipeIngredient | null>(null)

// In render:
{recipe.ingredients.map((ing, i) => (
  <ClickableIngredient
    key={i}
    ingredient={ing}
    onClarify={setClarifyingIngredient}
  />
))}

{clarifyingIngredient && (
  <IngredientClarificationModal
    ingredient={clarifyingIngredient}
    onClose={() => setClarifyingIngredient(null)}
  />
)}
```

### 6. Add React Query Hook

**In modal component or custom hook**:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['ingredient-clarification', ingredient.name, ingredient.quantity, ingredient.unit],
  queryFn: () => ingredientService.getClarification(
    ingredient.name,
    ingredient.quantity,
    ingredient.unit
  ),
})
```

## Files to Create

1. `src/components/common/IngredientClarificationModal.tsx`
2. `src/components/features/ClickableIngredient.tsx`
3. `src/api/services/ingredient.service.ts`

## Files to Modify

1. `src/types/api.types.ts` - Add `IngredientClarification` interface
2. `src/api/services/index.ts` - Export new service
3. `src/components/common/index.ts` - Export modal
4. `src/components/features/index.ts` - Export clickable ingredient
5. `src/components/features/RecipeDetailModal.tsx` - Use clickable ingredients
6. `src/pages/MealPlanRecipeDetailPage.tsx` - Use clickable ingredients
7. `src/pages/FavoriteRecipeDetailPage.tsx` - Use clickable ingredients
8. `src/pages/SpecialMealRecipeDetailPage.tsx` - Use clickable ingredients
9. `src/pages/FamilyCalendarRecipeDetailPage.tsx` - Use clickable ingredients

## Backend API Contract

**Endpoint**: `POST /ingredients/clarify`

**Request**:
```json
{
  "ingredientName": "Olive Oil",
  "quantity": 2,
  "unit": "TABLESPOONS"
}
```

**Response**:
```json
{
  "ingredientName": "Olive Oil",
  "originalQuantity": 2,
  "originalUnit": "TABLESPOONS",
  "conversions": [
    { "unit": "MILLILITERS", "quantity": 30 },
    { "unit": "GRAMS", "quantity": 27 }
  ],
  "tip": "Olive oil is slightly lighter than water, so 1 tbsp weighs about 13.5g"
}
```

## Verification

1. Navigate to any recipe detail page or modal
2. Hover over an ingredient - should show clickable cursor
3. Click on an ingredient (e.g., "2 TABLESPOONS Olive Oil")
4. Modal should appear with loading state
5. After loading, modal shows conversions (e.g., 30ml, 27g)
6. Click outside modal or X to close
7. Test on mobile (tap instead of click)
8. Test dark mode
9. Test error handling (disconnect network, verify error state)
