# Bug: Family Calendar Recipe Click Error

## Problem
When navigating to family calendar and clicking a recipe, the app crashes with:
```
TypeError: undefined is not an object (evaluating 'r.imageUrl')
```

## Root Cause Analysis
- [ ] Identify where `r.imageUrl` is being accessed
- [ ] Determine why `r` (recipe object) is undefined
- [ ] Check if recipe data is being fetched/passed correctly
- [ ] Verify API response structure matches expected format

## Potential Causes
- Recipe object not loaded before render
- Missing null/undefined check before accessing `imageUrl`
- Race condition between navigation and data fetch
- API returning different structure than expected

## Fix
- [ ] Add null/undefined guard before accessing recipe properties
- [ ] Ensure recipe data is loaded before rendering component
- [ ] Add optional chaining (`r?.imageUrl`) where appropriate
- [ ] Handle loading/error states properly

## Acceptance Criteria
- Clicking a recipe in family calendar opens recipe without errors
- Graceful handling when recipe data is unavailable
- No regression in other recipe display areas
