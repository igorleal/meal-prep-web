# Load Recipe Feature - Frontend Plan

## Overview
Add the ability for users to load/import recipes from text or URL in the Favorites page.

## Files to Create

### 1. `src/components/features/LoadRecipeModal.tsx`
Modal component with:
- Toggle between URL and TEXT input modes
- URL input field (disabled with "Coming soon" message)
- TextArea for pasting recipe text (8000 char limit)
- Character counter display
- "Load Recipe" button with loading state
- WeeklyLimitBanner when quota exceeded
- Error handling with inline messages

```tsx
interface LoadRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (recipe: Recipe) => void
  hasReachedWeeklyLimit: boolean
}
```

### 2. `src/types/api.types.ts` - Add types
```typescript
export type LoadRecipeRequestType = 'URL' | 'TEXT'

export interface LoadRecipeRequest {
  type: LoadRecipeRequestType
  content: string
}
```

**Response:** Returns `Recipe` directly. Errors return HTTP status codes (429, 501, 422).

## Files to Modify

### 1. `src/pages/FavoritesPage.tsx`
**Location:** Header section (line ~143-155)

Changes:
- Add state: `const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)`
- Fetch user for quota check: `const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: userService.getCurrentUser })`
- Add Button in header to open modal
- Render LoadRecipeModal
- On success: add to favorites, invalidate queries, close modal

```tsx
// In header div, add:
<Button
  variant="primary"
  icon="add"
  onClick={() => setIsLoadModalOpen(true)}
  disabled={user?.hasReachedWeeklyLimit}
>
  {t('page.addRecipe')}
</Button>

// After header, add:
<LoadRecipeModal
  isOpen={isLoadModalOpen}
  onClose={() => setIsLoadModalOpen(false)}
  onSuccess={async (recipe) => {
    await favoriteService.addFavorite(recipe.id)
    queryClient.invalidateQueries({ queryKey: ['favorites'] })
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    setIsLoadModalOpen(false)
  }}
  hasReachedWeeklyLimit={user?.hasReachedWeeklyLimit ?? false}
/>
```

### 2. `src/api/services/recipe.service.ts`
Add new method:
```typescript
loadRecipe: async (request: LoadRecipeRequest): Promise<Recipe> => {
  const response = await api.post<Recipe>('/recipe/load', request)
  return response.data
}
```

### 3. Translation files (`src/i18n/locales/{en,pt,sv}/favorites.json`)
Add keys:
```json
{
  "page": {
    "addRecipe": "Add Recipe"
  },
  "loadRecipe": {
    "title": "Load Recipe",
    "urlTab": "From URL",
    "textTab": "Paste Text",
    "urlPlaceholder": "https://example.com/recipe",
    "urlComingSoon": "URL import coming soon",
    "textPlaceholder": "Paste your recipe here...",
    "characterCount": "{count} / {max} characters",
    "loadButton": "Load Recipe",
    "loading": "Processing recipe...",
    "success": "Recipe loaded successfully!",
    "error": "Failed to load recipe",
    "quotaExceeded": "Weekly recipe limit reached"
  }
}
```

## Component Structure (LoadRecipeModal)

```
LoadRecipeModal
├── Overlay backdrop
├── Modal container
│   ├── Header (title + close button)
│   ├── Input mode toggle (URL / TEXT tabs)
│   ├── URL section (disabled, coming soon)
│   ├── TEXT section
│   │   ├── TextArea (maxLength: 8000)
│   │   └── Character counter
│   ├── WeeklyLimitBanner (conditional)
│   ├── Error message (conditional)
│   └── Footer
│       └── Load Recipe Button (disabled when quota exceeded or loading)
```

## UI Behavior

1. **Opening Modal:** Click "Add Recipe" button in Favorites header
2. **Input Modes:** Toggle between URL (disabled) and TEXT
3. **Character Limit:** 8000 chars, show live counter
4. **Quota Check:**
   - If `hasReachedWeeklyLimit`, show WeeklyLimitBanner
   - Disable "Load Recipe" button with tooltip
5. **Loading State:** Show spinner, disable button
6. **Success:** Close modal, recipe added to favorites
7. **Error:** Show inline error message, allow retry

## Verification

1. Open `/favorites` page
2. Click "Add Recipe" button
3. Toggle to "Paste Text" tab
4. Paste a recipe text
5. Verify character counter updates
6. Click "Load Recipe"
7. Verify recipe appears in favorites list
8. Verify quota is consumed (button disabled after reaching limit)
