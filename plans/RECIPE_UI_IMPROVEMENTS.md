# Recipe Page UI Improvements

## Overview
Improve the UI/UX of the recipe page with a refreshed layout and better data formatting.

## Tasks

### 1. Get New Layout from Stitch
- [ ] Design new layout addressing:
  - Radio buttons for ingredients selection
  - "Per service" text breaking to new line issue
  - "Servings" area feels empty and needs better visual treatment
- [ ] Export design assets/specifications

### 2. Implement New Layout
- [ ] Use Stitch design as input for Claude to generate new component files
- [ ] Update recipe page components with new layout
- [ ] Ensure responsive design works correctly

### 3. Format Units from Backend
- [ ] Backend returns units in ALL CAPS (e.g., "GRAMS", "CUPS")
- [ ] Transform to user-friendly format:
  - "GRAMS" → "g" or "grams"
  - "CUPS" → "cups"
  - "TABLESPOONS" → "tbsp"
  - etc.
- [ ] Create a utility function for unit formatting

### 4. Handle Enumerated Instructions
- [ ] Backend recipe instructions may come with numbering (e.g., "1. Preheat oven...")
- [ ] Strip leading numbers from instructions to avoid duplication with UI numbering
- [ ] Implement regex or parser to detect and remove instruction prefixes

## Acceptance Criteria
- New layout matches Stitch design
- Units display in human-readable format
- Instructions don't show duplicate numbering
- All changes are responsive and accessible
