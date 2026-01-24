# Bug Fix: Show Loading Spinners on Refresh Suggestions

## Problem

When clicking "Refresh suggestions" in the recipe selector pages, the recipe cards continue displaying the old recipes instead of showing loading spinners. The loading spinner only appears on the button itself.

## Root Cause

The recipe grid conditionally renders `LoadingCard` components based only on the `isGenerating` state:

```tsx
{isGenerating ? (
  <>
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
  </>
) : (
  pendingPlan?.recipes.map((recipe) => (
    <RecipeCard ... />
  ))
)}
```

- `isGenerating` is only `true` during **initial** recipe generation
- When "Refresh suggestions" is clicked, `regenerateMutation.isPending` becomes `true`, but this is not checked for showing the loading cards

## Solution

Update the condition to also show loading cards when `regenerateMutation.isPending` is true:

```tsx
{isGenerating || regenerateMutation.isPending ? (
```

## Files to Modify

1. **`src/pages/RecipeSelectionPage.tsx`** (line 292)
2. **`src/pages/FamilyCalendarRecipeSelectionPage.tsx`** (line 314)
3. **`src/pages/SpecialMealRecipeSelectionPage.tsx`** (line 305)

## Implementation Steps

1. In `RecipeSelectionPage.tsx`, change line 292:
   - From: `{isGenerating ? (`
   - To: `{isGenerating || regenerateMutation.isPending ? (`

2. In `FamilyCalendarRecipeSelectionPage.tsx`, change line 314:
   - From: `{isGenerating ? (`
   - To: `{isGenerating || regenerateMutation.isPending ? (`

3. In `SpecialMealRecipeSelectionPage.tsx`, change line 305:
   - From: `{isGenerating ? (`
   - To: `{isGenerating || regenerateMutation.isPending ? (`

## Verification

1. Navigate to any recipe selection page (e.g., create a new meal plan)
2. Wait for initial recipes to load
3. Click "Refresh suggestions" button
4. Verify that the recipe cards immediately turn into loading spinners
5. Verify that when new recipes arrive, they replace the loading spinners
6. Repeat for all three recipe selection pages:
   - `/meal-plans/create` → Recipe Selection
   - Family Calendar recipe selection
   - Special Meals recipe selection
