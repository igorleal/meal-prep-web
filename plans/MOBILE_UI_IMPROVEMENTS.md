# Mobile UI Improvements

## Overview

Improve the mobile user experience by converting card grids to carousels, optimizing spacing, and fixing layout issues on small screens.

## Current Issues

1. **Card grids stack vertically** - Users must scroll through many full-width cards
2. **Large image heights** - `h-64` (256px) takes too much screen space
3. **Generous spacing** - `gap-6`/`gap-8` and `p-8` padding too large for mobile
4. **Calendar grid cramped** - 7-column grid too tight on mobile
5. **Macro grid overflow** - 4-column grid too narrow on small screens
6. **No carousel/swipe** - No horizontal swiping for card collections
7. **Sidebar too wide** - 256px takes ~70% of mobile screen

## Implementation Plan

### 1. Install Carousel Library

**Add dependency**:
```bash
npm install embla-carousel-react
```

Embla is lightweight (~3KB gzipped), accessible, and works well with React.

### 2. Create Mobile Carousel Component

**New file**: `src/components/common/MobileCarousel.tsx`

```typescript
interface MobileCarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}
```

Features:
- Only renders as carousel on mobile (< md breakpoint)
- Shows grid on tablet/desktop
- Touch swipe support
- Dot indicators for position
- Peek next card (show partial next card to indicate swipeable)

### 3. Convert Card Grids to Carousels

**Pages to update**:

| Page | Line | Current Grid |
|------|------|--------------|
| `RecipeSelectionPage.tsx` | 291 | `grid gap-8 md:grid-cols-2 lg:grid-cols-3` |
| `FamilyCalendarRecipeSelectionPage.tsx` | 313 | `grid gap-8 md:grid-cols-2 lg:grid-cols-3` |
| `SpecialMealRecipeSelectionPage.tsx` | 304 | `grid gap-8 md:grid-cols-2 lg:grid-cols-3` |
| `MealPlansPage.tsx` | 126 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| `SpecialMealsPage.tsx` | 131 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| `FavoritesPage.tsx` | 156 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` |

**Pattern**:
```tsx
{/* Mobile: Carousel */}
<div className="md:hidden">
  <MobileCarousel items={recipes} renderItem={(recipe) => (
    <RecipeCard recipe={recipe} ... />
  )} />
</div>

{/* Tablet/Desktop: Grid */}
<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {recipes.map((recipe) => (
    <RecipeCard key={recipe.id} recipe={recipe} ... />
  ))}
</div>
```

### 4. Reduce Mobile Image Heights

**File**: `src/components/features/RecipeCard.tsx`

Change image container from:
```tsx
<div className="h-64 w-full ...">
```
To:
```tsx
<div className="h-48 md:h-64 w-full ...">
```

Apply similar changes to other card components with fixed image heights.

### 5. Optimize Mobile Spacing

**Pattern to apply across pages**:

| Current | Mobile-Optimized |
|---------|------------------|
| `gap-6` | `gap-4 md:gap-6` |
| `gap-8` | `gap-4 md:gap-8` |
| `p-8` | `p-4 md:p-8` |
| `py-12` | `py-6 md:py-12` |
| `mb-12` | `mb-6 md:mb-12` |

**Files to update**:
- All page files in `src/pages/`
- `RecipeCard.tsx` - reduce internal padding
- `RecipeDetailModal.tsx` - reduce padding

### 6. Fix Macro Grid on Mobile

**File**: `src/components/features/RecipeCard.tsx`

Change from:
```tsx
<div className="grid grid-cols-4 divide-x ...">
```
To:
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 md:divide-x ...">
```

This gives 2x2 grid on mobile, 1x4 on tablet+.

### 7. Improve Family Calendar Mobile View

**File**: `src/pages/FamilyCalendarPage.tsx`

Options:
1. **Day Picker + Swipeable Days**: Show one day at a time with left/right swipe
2. **Horizontal Scroll**: Allow horizontal scroll on the 7-column grid
3. **Week Carousel**: Swipe between weeks

Recommended: **Day Picker approach**
- Add date selector at top
- Show single day's meals in a list
- Swipe left/right to change days

### 8. Reduce Sidebar Width on Mobile

**File**: `src/components/layout/Sidebar.tsx`

Change from:
```tsx
className="... w-64 ..."
```
To:
```tsx
className="... w-56 md:w-64 ..."
```

224px is more comfortable on mobile (60% vs 70% of screen).

### 9. Responsive Font Sizes

Apply to headings that are too large on mobile:

| Current | Mobile-Optimized |
|---------|------------------|
| `text-4xl` | `text-2xl md:text-4xl` |
| `text-5xl` | `text-3xl md:text-5xl` |
| `text-3xl` | `text-xl md:text-3xl` |

## Files to Create

1. `src/components/common/MobileCarousel.tsx`

## Files to Modify

1. `src/pages/RecipeSelectionPage.tsx` - Carousel + spacing
2. `src/pages/FamilyCalendarRecipeSelectionPage.tsx` - Carousel + spacing
3. `src/pages/SpecialMealRecipeSelectionPage.tsx` - Carousel + spacing
4. `src/pages/MealPlansPage.tsx` - Carousel + spacing
5. `src/pages/SpecialMealsPage.tsx` - Carousel + spacing
6. `src/pages/FavoritesPage.tsx` - Carousel + spacing
7. `src/pages/FamilyCalendarPage.tsx` - Mobile day view
8. `src/pages/HomePage.tsx` - Spacing + font sizes
9. `src/components/features/RecipeCard.tsx` - Image height + macro grid + padding
10. `src/components/features/RecipeDetailModal.tsx` - Spacing
11. `src/components/layout/Sidebar.tsx` - Width
12. `package.json` - Add embla-carousel-react

## Verification

1. Test on mobile viewport (375px width - iPhone SE)
2. Test on small mobile (320px width)
3. Test on large mobile (428px width - iPhone 14 Pro Max)
4. Verify carousel swipe works with touch
5. Verify dot indicators update on swipe
6. Verify grid displays correctly on tablet (768px+)
7. Verify no horizontal overflow on any page
8. Test Family Calendar day navigation on mobile
9. Test sidebar open/close on mobile
10. Verify dark mode styling on all new components
