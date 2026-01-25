# UI Improvements

## Overview

This document consolidates remaining UI improvements that require design input or further investigation.

---

## 1. Family Calendar Mobile View

**Context**: The 7-column calendar grid is cramped on mobile devices.

**Options to consider**:
1. **Day Picker + Swipeable Days**: Show one day at a time with left/right swipe
2. **Horizontal Scroll**: Allow horizontal scroll on the 7-column grid
3. **Week Carousel**: Swipe between weeks

**Recommendation**: Day Picker approach
- Add date selector at top
- Show single day's meals in a list
- Swipe left/right to change days

**Status**: Needs design decision

---

## 2. Recipe Page Layout Redesign

**Context**: Recipe page needs a refreshed layout from Stitch design.

**Issues to address**:
- Radio buttons for ingredients selection (current UX unclear)
- "Per serving" text breaking to new line issue
- "Servings" area feels empty and needs better visual treatment

**Next Steps**:
1. Get new layout design from Stitch
2. Export design assets/specifications
3. Implement new layout based on design

**Status**: Waiting for Stitch design

---

## 3. Special Meals UI Alignment

**Context**: Align Special Meals input UI/UX with Meal Prep for consistency.

**Areas to align**:
1. **Dietary Restrictions Input**
   - Match Meal Prep dietary restrictions UI/UX
   - Load user preferences as default
   - Allow free text input for custom restrictions
   - Support multiple custom entries

2. **Must Haves Input**
   - Match Meal Prep must haves UI/UX
   - Same input patterns and interactions
   - Consistent chip/tag display

3. **Excludes Input**
   - Match Meal Prep excludes UI/UX
   - Same input patterns and interactions
   - Consistent chip/tag display

**Next Steps**:
1. Audit Meal Prep input components
2. Identify shared components to extract
3. Apply consistent patterns to Special Meals

**Status**: Needs investigation and implementation

---

## Completed Improvements

The following improvements have been implemented:

### Mobile UI Improvements
- Installed embla-carousel-react for mobile carousels
- Created MobileCarousel component with touch swipe and dot indicators
- Converted card grids to carousels on 6 pages:
  - RecipeSelectionPage
  - FamilyCalendarRecipeSelectionPage
  - SpecialMealRecipeSelectionPage
  - MealPlansPage
  - SpecialMealsPage
  - FavoritesPage
- Reduced mobile image heights (h-48 on mobile, h-64 on desktop)
- Fixed macro grid layout (2x2 on mobile, 1x4 on desktop)
- Optimized spacing across pages (responsive gap, padding, margins)
- Reduced sidebar width on mobile (w-56 on mobile, w-64 on desktop)
- Added responsive font sizes to headings

### Recipe Data Formatting
- Created unit formatting utility (GRAMS -> g, TABLESPOONS -> tbsp, etc.)
- Created instruction prefix stripper (removes "1. ", "Step 1:", etc.)
- Applied formatting to RecipeDetailModal and all recipe detail pages
