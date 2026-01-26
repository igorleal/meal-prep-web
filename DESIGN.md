# ReceitAI - Design Documentation

Comprehensive design documentation for the ReceitAI meal planning web application.

---

## Table of Contents

1. [Application Overview](#application-overview)
2. [Application Layout](#application-layout)
3. [Pages Documentation](#pages-documentation)
4. [Components Documentation](#components-documentation)
5. [User Flows](#user-flows)
6. [State Management](#state-management)
7. [API Services](#api-services)
8. [Internationalization](#internationalization)
9. [Theme System](#theme-system)

---

## Application Overview

**ReceitAI** is an AI-powered meal planning web application that helps users:
- Create personalized weekly meal plans based on dietary preferences and nutritional goals
- Manage family meal calendars with scheduled meals on specific dates
- Plan special meals for events and gatherings
- Save and manage favorite recipes
- Convert ingredient units for cooking convenience

### Key Features

| Feature | Description |
|---------|-------------|
| AI Recipe Generation | Generate recipes based on dietary restrictions, macros, and preferences |
| Meal Plan Management | Create, view, and delete weekly meal plans |
| Family Calendar | Calendar-based meal scheduling for families |
| Special Meals | Event-based meal planning for special occasions |
| Favorites | Save and manage favorite recipes |
| Unit Conversion | Convert ingredient measurements between units |
| Multi-language Support | English, Portuguese, and Swedish |
| Dark/Light Theme | System preference detection with manual toggle |

---

## Application Layout

### Overall Structure

```
App
├── ThemeProvider (light/dark theme)
├── AuthProvider (authentication state)
├── LanguageProvider (i18n)
├── BrowserRouter (React Router)
│   └── Routes
│       ├── Public Routes (AuthLayout)
│       │   ├── /login → LoginPage
│       │   ├── /terms → TermsOfService
│       │   ├── /privacy → PrivacyPolicy
│       │   └── /auth/callback → AuthCallbackPage
│       ├── Protected Routes (ProtectedRoute + AppLayout)
│       │   ├── Sidebar (navigation)
│       │   ├── Header (mobile only)
│       │   └── <Outlet /> (page content)
│       └── Catch-all (*) → Redirect to /
└── QueryClientProvider (React Query)
```

### Desktop Layout
- **Sidebar**: Fixed on left (256px width)
- **Header**: Hidden on desktop (md+ screens)
- **Content Area**: Takes remaining space

### Mobile Layout
- **Header**: Sticky at top with menu toggle button
- **Sidebar**: Modal overlay (hidden by default, toggles via menu button)
- **Content Area**: {open for suggestion}

### Layout Components

#### AppLayout (`/components/layout/AppLayout.tsx`)
Main layout wrapper for all protected routes.

**Structure:**
```
┌─────────────────────────────────────────────┐
│  Sidebar  │        Content Area             │
│  (nav)    │        <Outlet />               │
│           │                                 │
│  - Logo   │                                 │
│  - Nav    │                                 │
│  - Theme  │                                 │
│  - Logout │                                 │
└─────────────────────────────────────────────┘
```

**Features:**
- Responsive sidebar (fixed on desktop, modal on mobile)
- Theme toggle support
- Session expired modal integration
- Smooth transitions

#### AuthLayout (`/components/layout/AuthLayout.tsx`)
Layout wrapper for public/authentication pages.

**Features:**
- Redirects authenticated users to home
- Shows loading overlay while checking auth
- Used for Login, Terms, and Privacy pages

#### Header (`/components/layout/Header.tsx`)
Mobile-only sticky header.

**Elements:**
| Element | Description |
|---------|-------------|
| Logo | ReceitAI branding with icon |
| Menu Button | Toggles sidebar visibility |

**Visibility:** Hidden on md+ screens (desktop)

#### Sidebar (`/components/layout/Sidebar.tsx`)
Navigation sidebar with all main app routes.

**Elements:**
| Element | Description |
|---------|-------------|
| Logo Section | ReceitAI icon + brand name + tagline |
| Navigation Links | 6 main nav items with icons |
| Theme Toggle | Light/dark mode switch |
| Logout Button | Signs out user |

**Navigation Items:**
| Item | Path | Icon |
|------|------|------|
| Dashboard | `/` | dashboard |
| Meal Planner | `/meal-plans` | calendar_month |
| Family Calendar | `/calendar` | event |
| Special Meals | `/special-meals` | local_dining |
| Favorites | `/favorites` | favorite |
| Profile | `/settings` | person |

---

## Pages Documentation

### Route Overview

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/login` | LoginPage | Public | Google OAuth login |
| `/auth/callback` | AuthCallbackPage | Public | OAuth callback handler |
| `/terms` | TermsOfService | Public | Terms of service document |
| `/privacy` | PrivacyPolicy | Public | Privacy policy document |
| `/` | HomePage | Protected | Dashboard with 3 feature panels |
| `/meal-plans` | MealPlansPage | Protected | List of created meal plans |
| `/meal-plans/create` | CreateMealPlanPage | Protected | Meal plan configuration form |
| `/meal-plans/recipes` | RecipeSelectionPage | Protected | AI-generated recipe selection |
| `/meal-plans/recipe` | MealPlanRecipeDetailPage | Protected | Recipe detail view |
| `/calendar` | FamilyCalendarPage | Protected | Monthly calendar view |
| `/calendar/create` | CreateFamilyMealPage | Protected | Add meal to calendar |
| `/calendar/recipes` | FamilyCalendarRecipeSelectionPage | Protected | Recipe selection for family meal |
| `/calendar/recipe` | FamilyCalendarRecipeDetailPage | Protected | Family meal recipe detail |
| `/special-meals` | SpecialMealsPage | Protected | List of special meals |
| `/special-meals/create` | CreateSpecialMealPage | Protected | Create special meal event |
| `/special-meals/recipes` | SpecialMealRecipeSelectionPage | Protected | Recipe selection for special meal |
| `/special-meals/recipe` | SpecialMealRecipeDetailPage | Protected | Special meal recipe detail |
| `/favorites` | FavoritesPage | Protected | Grid of favorited recipes |
| `/favorites/recipe` | FavoriteRecipeDetailPage | Protected | Favorite recipe detail |
| `/settings` | SettingsPage | Protected | User profile and preferences |
| `/pantry` | ComingSoonPage | Protected | Coming soon placeholder |
| `/shopping-list` | ComingSoonPage | Protected | Coming soon placeholder |

---

### Page Details

### 1. Login Page (`/login`)

**File:** `/src/pages/LoginPage.tsx`

**Purpose:** User authentication via Google OAuth

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Hero Image     │      Login Form           │
│  (left panel)   │      (right panel)        │
│                 │                           │
│  - Logo         │  - Title                  │
│  - Headline     │  - Subtitle               │
│  - Tagline      │  - Google Sign-in Button  │
│  - Copyright    │  - Terms & Privacy links  │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Hero Image | Image | Left panel with food photography (desktop only) |
| Logo | Icon + Text | ReceitAI branding |
| Title | H2 | "Welcome back" |
| Subtitle | Text | Login instruction |
| Google Button | Button | Sign in with Google OAuth |
| Loading Spinner | Spinner | Shows during authentication |
| Error Message | Alert | Displays login errors |
| Terms Link | Link | Opens Terms of Service |
| Privacy Link | Link | Opens Privacy Policy |

**User Actions:**
1. Click "Continue with Google" → Redirects to Google OAuth or mock login
2. Click "Terms of Service" → Navigates to `/terms`
3. Click "Privacy Policy" → Navigates to `/privacy`

**State:**
- `isLoading` - Loading state during auth
- `error` - Error message string

**API Calls:**
- `authService.login()` (mock mode only)
- OAuth redirect to `/oauth2/authorization/google` (production)

---

### 2. Auth Callback Page (`/auth/callback`)

**File:** `/src/pages/AuthCallbackPage.tsx`

**Purpose:** Process OAuth callback and extract tokens

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Loading Overlay | Spinner | Full-screen loading state |
| Error Display | Alert | Shows if token extraction fails |

**User Actions:**
- Automatic processing - no user interaction required

**Flow:**
1. Receives OAuth callback with token in URL
2. Extracts token from query parameters
3. Fetches user data via API
4. Stores token and user in AuthContext
5. Redirects to home page

---

### 3. Terms of Service Page (`/terms`)

**File:** `/src/pages/TermsOfService.tsx`

**Purpose:** Display terms of service legal document

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Back Button | Button | Returns to login page |
| Title | H1 | "Terms of Service" |
| Last Updated | Text | Document revision date |
| Sections | Headings + Text | Legal terms organized by topic |

**Content Sections:**
1. Introduction
2. Acceptance of Terms
3. Use of Service
4. User Responsibilities
5. Privacy
6. Modifications
7. Contact Information

---

### 4. Privacy Policy Page (`/privacy`)

**File:** `/src/pages/PrivacyPolicy.tsx`

**Purpose:** Display privacy policy legal document

**Screen Elements:**
Similar structure to Terms of Service with privacy-specific content sections.

---

### 5. Home Page / Dashboard (`/`)

**File:** `/src/pages/HomePage.tsx`

**Purpose:** Main dashboard with navigation to three primary features

**Layout:**
```
Desktop:                       Mobile:
┌──────┬──────┬──────┐        ┌──────────────┐
│Panel1│Panel2│Panel3│        │   Panel 1    │
│      │      │      │        ├──────────────┤
│Meal  │Family│Special│       │   Panel 2    │
│Plans │Cal.  │Meals │        ├──────────────┤
└──────┴──────┴──────┘        │   Panel 3    │
                              └──────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Panel 1 - Meal Plans | Clickable Panel | Orange gradient, restaurant_menu icon |
| Panel 2 - Family Calendar | Clickable Panel | Coral gradient, calendar_month icon |
| Panel 3 - Special Meals | Clickable Panel | Green gradient, temp_preferences_custom icon |

**Each Panel Contains:**
- Background gradient
- Large icon
- Title (H2)
- Description text
- Action button with arrow

**User Actions:**
1. Click Panel 1 → Navigate to `/meal-plans`
2. Click Panel 2 → Navigate to `/calendar`
3. Click Panel 3 → Navigate to `/special-meals`
4. Click any action button → Same navigation

---

### 6. Meal Plans Page (`/meal-plans`)

**File:** `/src/pages/MealPlansPage.tsx`

**Purpose:** List all saved meal plans with management options

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Create Button              │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Plan 1  │  │ Plan 2  │  │ Plan 3  │     │
│  │ Card    │  │ Card    │  │ Card    │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Page Title | H1 | "My Meal Plans" |
| Subtitle | Text | Description text |
| Create Button | Button | "Create New Plan" |
| Plan Cards | Card Grid | Grid of saved meal plans |
| Empty State | Illustration | Shows when no plans exist |
| Delete Modal | Modal | Confirmation for plan deletion |

**Each Plan Card Contains:**
- Recipe image
- Plan name
- Recipe name
- Macro badges (calories, protein)
- View button
- Delete button

**User Actions:**
1. Click "Create New Plan" → Navigate to `/meal-plans/create`
2. Click plan card → Navigate to `/meal-plans/recipe`
3. Click delete button → Opens confirmation modal
4. Confirm delete → Removes plan

**API Calls:**
- `receitaiPlanService.getPlans()` - Fetch all plans
- `receitaiPlanService.deletePlan(id)` - Delete a plan

---

### 7. Create Meal Plan Page (`/meal-plans/create`)

**File:** `/src/pages/CreateMealPlanPage.tsx`

**Purpose:** Configure meal plan parameters before AI generation

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Weekly Limit Banner (if applicable)        │
├─────────────────────────────────────────────┤
│  Header: Title + Subtitle                   │
├─────────────────────────────────────────────┤
│  Accordion 1: Basic Info                    │
│  Accordion 2: Dietary Restrictions          │
│  Accordion 3: Focus Areas                   │
│  Accordion 4: Macros & Nutrition            │
│  Accordion 5: Preferences                   │
│  Accordion 6: Weekly Schedule               │
├─────────────────────────────────────────────┤
│  Action Bar: Next Button                    │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Section | Elements |
|---------|----------|
| Weekly Limit Banner | Warning banner when limit reached |
| Basic Info Accordion | Plan name text input |
| Restrictions Accordion | ChipInput for dietary restrictions |
| Focus Areas Accordion | 8 checkboxes with range sliders |
| Macros Accordion | 4 number inputs (calories, protein, carbs, fats) |
| Preferences Accordion | ChipInput for must-haves (green), excludes (red) |
| Schedule Accordion | 2 range sliders (meals per day, number of days) |
| Next Button | Primary button with arrow icon |

**Focus Area Options:**
| Key | Label |
|-----|-------|
| HIGH_PROTEIN | High Protein |
| LOW_CARB | Low Carb |
| KETO | Keto |
| BALANCED | Balanced |
| QUICK_MEALS | Quick Meals |
| BUDGET_FRIENDLY | Budget Friendly |
| LONG_LASTING | Long Lasting |
| ECO_FRIENDLY | Eco Friendly |

**User Actions:**
1. Enter plan name
2. Add dietary restrictions via chips
3. Toggle and adjust focus areas
4. Set macro targets (optional)
5. Add must-have and excluded ingredients
6. Set meals per day (1-6) and days (1-7)
7. Click "Next" → Navigate to recipe selection

**State:**
- `planName` - Plan name string
- `selectedRestrictions` - Array of restriction strings
- `focusAreas` - Object with enabled/value for each area
- `macros` - Object with calories, protein, carbs, fats
- `mustHaves` - Array of ingredient strings
- `excludes` - Array of excluded ingredient strings
- `mealsPerDay` - Number (1-6)
- `days` - Number (1-7)

**Data Flow:**
- Request saved to `sessionStorage.pendingMealPlanRequest`
- Navigates to `/meal-plans/recipes`

---

### 8. Recipe Selection Page (`/meal-plans/recipes`)

**File:** `/src/pages/RecipeSelectionPage.tsx`

**Purpose:** Display AI-generated recipes for selection

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Back Button                │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Recipe  │  │ Recipe  │  │ Recipe  │     │
│  │ Card 1  │  │ Card 2  │  │ Card 3  │     │
│  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────┤
│  Action Bar: Regenerate + Save Selected     │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Title | H1 | Plan name from request |
| Back Button | Button | Return to create page |
| Recipe Cards | Card Grid/Carousel | 3 generated recipe options |
| Loading State | Skeleton Cards | While generating recipes |
| Error State | Error Message | If generation fails |
| Regenerate Button | Button | Request new recipes |
| Save Selected Button | Button | Save chosen recipe |
| Weekly Limit Modal | Modal | Shows when limit exceeded |
| Content Validation Modal | Modal | Shows for harmful content errors |

**User Actions:**
1. Click recipe card → Select recipe (highlights with ring)
2. Click "View Details" → Opens RecipeDetailModal
3. Click favorite button → Toggle favorite status
4. Click "Regenerate" → Request new recipes
5. Click "Save Selected" → Create plan and navigate to list

**API Calls:**
- `receitaiPlanService.generateRecipes(request)` - Generate recipes
- `receitaiPlanService.regenerateRecipes(requestId)` - Get new options
- `receitaiPlanService.createPlan(request)` - Save selected recipe
- `favoriteService.addFavorite(id)` / `removeFavorite(id)` - Toggle favorites

---

### 9. Meal Plan Recipe Detail Page (`/meal-plans/recipe`)

**File:** `/src/pages/MealPlanRecipeDetailPage.tsx`

**Purpose:** Full recipe detail view for saved meal plan

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Hero Image with overlay                    │
│  - Close button                             │
│  - Recipe name                              │
│  - Cook time + Servings                     │
├─────────────────────────────────────────────┤
│  ┌──────────────┬────────────────────────┐  │
│  │ Nutrition    │ Ingredients            │  │
│  │ Facts Card   │ (with convert buttons) │  │
│  │              ├────────────────────────┤  │
│  │ Servings     │ Preparation Steps      │  │
│  │ Card         │ (numbered)             │  │
│  └──────────────┴────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Back Button | Button | Return to meal plans list |
| Hero Image | Image | Large recipe photo |
| Recipe Name | H1 | Recipe title overlay on image |
| Cook Time | Badge | Time with schedule icon |
| Servings | Badge | Number with restaurant icon |
| Nutrition Card | Card | 4 macro boxes (cal, pro, carb, fat) |
| Servings Card | Card | Servings info with group icon |
| Ingredients List | List | Quantity + unit + name, convert button |
| Preparation Steps | Numbered List | Step-by-step instructions |
| Conversion Modal | Modal | Unit conversion interface |

**User Actions:**
1. Click back → Return to meal plans
2. Click ingredient convert button → Open conversion modal
3. Scroll through instructions

---

### 10. Family Calendar Page (`/calendar`)

**File:** `/src/pages/FamilyCalendarPage.tsx`

**Purpose:** Monthly calendar view for family meal scheduling

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Subtitle                   │
├─────────────────────────────────────────────┤
│  Toolbar: < Month Year > | Jump to Today    │
├─────────────────────────────────────────────┤
│  Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun   │
├─────────────────────────────────────────────┤
│  ┌───┬───┬───┬───┬───┬───┬───┐             │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │             │
│  │   │   │Meal│   │   │   │   │             │
│  └───┴───┴───┴───┴───┴───┴───┘             │
│  ... (more weeks)                           │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Page Title | H1 | "Family Calendar" |
| Subtitle | Text | Description |
| Previous Month Button | Icon Button | Navigate to previous month |
| Month/Year Display | H2 | Current month and year |
| Next Month Button | Icon Button | Navigate to next month |
| Jump to Today | Button | Reset to current month |
| Weekday Headers | Grid | Mon-Sun column headers |
| Calendar Days | Grid | 6 weeks × 7 days grid |
| Day Cell | Cell | Date number + meal pills |
| Meal Pill | Button | Recipe name, clickable |
| Add Meal Button | Button | Shows on hover (empty days) |
| Remove Meal Button | Button | Shows on hover (days with meals) |
| Today Badge | Badge | Highlights current date |
| Delete Confirmation Modal | Modal | Confirm meal removal |

**User Actions:**
1. Click `<` → Previous month
2. Click `>` → Next month
3. Click "Jump to Today" → Reset to current month
4. Click empty day → Add meal (`/calendar/create?date=...`)
5. Click meal pill → View recipe detail
6. Hover + click remove → Opens delete confirmation
7. Confirm delete → Removes meal

**API Calls:**
- `familyPlanService.getPlans(startDate, endDate)` - Fetch month meals
- `familyPlanService.deletePlan(id)` - Remove meal

---

### 11. Create Family Meal Page (`/calendar/create`)

**File:** `/src/pages/CreateFamilyMealPage.tsx`

**Purpose:** Configure family meal for specific date

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Title | H1 | "Add Meal" |
| Date Display | Text | Selected date from query param |
| Meal Type | Select/Radio | Breakfast, Lunch, Dinner, Snack |
| Restrictions | ChipInput | Dietary restrictions |
| Preferences | ChipInput | Must-haves and excludes |
| Next Button | Button | Generate recipes |

**User Actions:**
1. Review pre-selected date
2. Select meal type
3. Add dietary restrictions
4. Add preferences
5. Click "Next" → Navigate to recipe selection

---

### 12. Family Calendar Recipe Selection Page (`/calendar/recipes`)

**File:** `/src/pages/FamilyCalendarRecipeSelectionPage.tsx`

**Purpose:** Select recipe for family calendar meal

Similar to meal plan recipe selection with family-specific context.

---

### 13. Family Calendar Recipe Detail Page (`/calendar/recipe`)

**File:** `/src/pages/FamilyCalendarRecipeDetailPage.tsx`

**Purpose:** View family meal recipe details

Similar to meal plan recipe detail with family-specific context.

---

### 14. Special Meals Page (`/special-meals`)

**File:** `/src/pages/SpecialMealsPage.tsx`

**Purpose:** List special event meals

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Create Button              │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Event 1 │  │ Event 2 │  │ Event 3 │     │
│  │ Card    │  │ Card    │  │ Card    │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Page Title | H1 | "Special Meals" |
| Subtitle | Text | Description |
| Create Button | Button | "Plan New Event" |
| Event Cards | Card Grid | Special meal events |
| Empty State | Illustration | Shows when no events |
| Delete Modal | Modal | Confirm event deletion |

**Each Event Card Contains:**
- Recipe image
- Event name
- Event date
- Recipe name
- View button
- Delete button

**User Actions:**
1. Click "Plan New Event" → Navigate to `/special-meals/create`
2. Click event card → View event recipe
3. Click delete → Confirm and remove

---

### 15. Create Special Meal Page (`/special-meals/create`)

**File:** `/src/pages/CreateSpecialMealPage.tsx`

**Purpose:** Configure special meal event

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Title | H1 | "Plan Special Meal" |
| Event Name | Input | Name for the event |
| Event Date | DatePicker | Select event date |
| Guest Count | Input/Slider | Number of guests |
| Restrictions | ChipInput | Dietary restrictions |
| Cuisine Preferences | ChipInput | Cuisine types |
| Next Button | Button | Generate recipes |

**User Actions:**
1. Enter event name
2. Select date
3. Set guest count
4. Add restrictions and preferences
5. Click "Next" → Generate recipes

---

### 16. Special Meal Recipe Selection Page (`/special-meals/recipes`)

**File:** `/src/pages/SpecialMealRecipeSelectionPage.tsx`

**Purpose:** Select recipe for special meal event

Similar to meal plan recipe selection with special meal context.

---

### 17. Special Meal Recipe Detail Page (`/special-meals/recipe`)

**File:** `/src/pages/SpecialMealRecipeDetailPage.tsx`

**Purpose:** View special meal recipe details

Similar to meal plan recipe detail with special meal context.

---

### 18. Favorites Page (`/favorites`)

**File:** `/src/pages/FavoritesPage.tsx`

**Purpose:** Display grid of favorited recipes

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Subtitle                   │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Recipe  │  │ Recipe  │  │ Recipe  │     │
│  │ Card    │  │ Card    │  │ Card    │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Page Title | H1 | "My Favorites" |
| Subtitle | Text | Description |
| Recipe Cards | Card Grid | Favorited recipes |
| Empty State | Illustration | Shows when no favorites |

**Each Card Contains:**
- Recipe image
- Recipe name
- Description
- Keywords
- Macros grid
- Favorite button (filled heart)
- View details button

**User Actions:**
1. Click recipe card → Navigate to `/favorites/recipe`
2. Click unfavorite button → Remove from favorites

---

### 19. Favorite Recipe Detail Page (`/favorites/recipe`)

**File:** `/src/pages/FavoriteRecipeDetailPage.tsx`

**Purpose:** View favorite recipe details

Full recipe detail view with ingredient conversion support.

---

### 20. Settings Page (`/settings`)

**File:** `/src/pages/SettingsPage.tsx`

**Purpose:** User profile and preference management

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header: Title + Subtitle                   │
├─────────────────────────────────────────────┤
│  Profile Card                               │
│  - Name                                     │
│  - Email                                    │
│  - Plan badge                               │
├─────────────────────────────────────────────┤
│  Preferences Card                           │
│  - Language selector                        │
│  - Dietary restrictions                     │
├─────────────────────────────────────────────┤
│  Legal Card                                 │
│  - Terms of Service link                    │
│  - Privacy Policy link                      │
├─────────────────────────────────────────────┤
│  Actions: Logout | Save Changes             │
└─────────────────────────────────────────────┘
```

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Page Title | H1 | "Settings" |
| Profile Card | Card | User name, email, plan badge |
| Language Selector | Select | Dropdown with 3 languages |
| Restrictions Input | ChipInput | Dietary restrictions |
| Suggested Restrictions | Buttons | Quick-add common restrictions |
| Terms Link | Link | Opens Terms of Service |
| Privacy Link | Link | Opens Privacy Policy |
| Logout Button | Button | Red ghost button with icon |
| Save Changes Button | Button | Primary button (disabled when no changes) |
| All Saved Indicator | Text | Green text when saved |

**Suggested Restrictions:**
- Vegan
- Gluten-Free
- Paleo
- Low-Sodium

**User Actions:**
1. Change language → Updates immediately
2. Add/remove dietary restrictions
3. Click suggested restriction → Add to list
4. Click Terms/Privacy links → Navigate to legal pages
5. Click "Save Changes" → Save restrictions to profile
6. Click "Log Out" → Sign out and redirect to login

**API Calls:**
- `userService.getMe()` - Fetch user data
- `userService.updateRestrictions(restrictions)` - Save restrictions
- `userService.updateLanguage(language)` - Save language preference

---

### 21. Coming Soon Page (`/pantry`, `/shopping-list`)

**File:** `/src/pages/ComingSoonPage.tsx`

**Purpose:** Placeholder for features in development

**Screen Elements:**

| Element | Type | Description |
|---------|------|-------------|
| Icon | Icon | Feature-specific icon (passed as prop) |
| Title | H1 | Feature name (passed as prop) |
| Coming Soon Badge | Badge | "Coming Soon" text |
| Description | Text | Feature description |
| Go Back Button | Button | Return to previous page |

**Props:**
- `title: string` - Feature name ("Pantry" or "Shopping List")
- `icon: string` - Material icon name

---

## Components Documentation

### Common Components (`/components/common`)

#### 1. Accordion

**File:** `/src/components/common/Accordion.tsx`

**Purpose:** Collapsible content section with header

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| number | number | Section number indicator |
| title | string | Accordion header title |
| subtitle | string | Optional subtitle under title |
| defaultOpen | boolean | Initial expanded state |
| children | ReactNode | Expandable content |

**Visual Elements:**
- Number badge (circle with number)
- Title text
- Subtitle text (muted)
- Chevron icon (rotates on expand)
- Collapsible content area

**User Interactions:**
- Click header → Toggle expand/collapse

---

#### 2. Badge

**File:** `/src/components/common/Badge.tsx`

**Purpose:** Small labeled indicator

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| variant | 'primary' \| 'warning' \| 'success' | Color variant |
| icon | string | Optional icon name |
| children | ReactNode | Badge text |
| className | string | Additional classes |

**Variants:**
- `primary` - Orange background
- `warning` - Yellow background
- `success` - Green background

---

#### 3. Button

**File:** `/src/components/common/Button.tsx`

**Purpose:** Versatile button component

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | Button style |
| size | 'sm' \| 'md' \| 'lg' | Button size |
| icon | string | Material icon name |
| iconPosition | 'left' \| 'right' | Icon placement |
| loading | boolean | Shows spinner, disables button |
| disabled | boolean | Disabled state |
| children | ReactNode | Button text |
| onClick | function | Click handler |
| className | string | Additional classes |

**Variants:**
| Variant | Style |
|---------|-------|
| primary | Solid orange background |
| secondary | Light background |
| outline | Border only, transparent background |
| ghost | No border, transparent background |

---

#### 4. Card

**File:** `/src/components/common/Card.tsx`

**Purpose:** Container component with consistent styling

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| padding | 'sm' \| 'md' \| 'lg' | Internal padding |
| hover | boolean | Enable hover effects |
| children | ReactNode | Card content |
| className | string | Additional classes |

---

#### 5. Chip

**File:** `/src/components/common/Chip.tsx`

**Purpose:** Small tag/pill for displaying values

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| label | string | Chip text |
| onRemove | function | Called when remove clicked |
| variant | 'default' \| 'success' \| 'danger' | Color variant |

**User Interactions:**
- Click X button → Calls onRemove

---

#### 6. ChipInput

**File:** `/src/components/common/ChipInput.tsx`

**Purpose:** Input field for managing arrays of tags

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| label | string | Input label |
| values | string[] | Current chip values |
| onChange | function | Called when values change |
| placeholder | string | Input placeholder |
| variant | 'default' \| 'success' \| 'danger' | Chip color variant |

**Visual Elements:**
- Label text
- Input field
- Chip list below input

**User Interactions:**
- Type and press Enter → Add chip
- Click chip X → Remove chip

---

#### 7. ContentValidationErrorModal

**File:** `/src/components/common/ContentValidationErrorModal.tsx`

**Purpose:** Display content safety error messages

**Visual Elements:**
- Warning icon
- Error title
- Error message
- "Go Back" button

**User Interactions:**
- Click "Go Back" → Navigate to previous page

---

#### 8. DatePicker

**File:** `/src/components/common/DatePicker.tsx`

**Purpose:** Calendar-based date selection

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| value | Date | Selected date |
| onChange | function | Called when date selected |
| minDate | Date | Earliest selectable date |
| maxDate | Date | Latest selectable date |

**Visual Elements:**
- Month/year header with navigation arrows
- Weekday labels
- Day grid (6 weeks)
- Today highlight
- Selected date highlight
- Disabled days (outside range)

**User Interactions:**
- Click arrows → Navigate months
- Click day → Select date

---

#### 9. Icon

**File:** `/src/components/common/Icon.tsx`

**Purpose:** Material Design icons wrapper

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| name | string | Material icon name |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | Icon size |
| className | string | Additional classes |

**Sizes:**
- `sm` - 16px
- `md` - 24px (default)
- `lg` - 32px
- `xl` - 48px

---

#### 10. IngredientConversionModal

**File:** `/src/components/common/IngredientConversionModal.tsx`

**Purpose:** Convert ingredient units

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| ingredient | RecipeIngredient | Ingredient to convert |
| onClose | function | Close modal handler |

**Visual Elements:**
- Modal overlay
- Ingredient name header
- Original quantity display
- Target unit selector
- Quantity shortcuts (1, 10, 100, 500)
- Converted result display
- "Dried to Cooked" toggle
- Close button

**Supported Units:**
- Grams (g)
- Kilograms (kg)
- Milliliters (ml)
- Liters (l)
- Tablespoons (tbsp)
- Teaspoons (tsp)
- Cups
- Ounces (oz)
- Pounds (lb)
- Pieces

**User Interactions:**
1. Select target unit
2. Click quantity shortcut or enter custom amount
3. Toggle "dried to cooked" for applicable ingredients
4. View converted result
5. Click close or backdrop to dismiss

---

#### 11. Input

**File:** `/src/components/common/Input.tsx`

**Purpose:** Text/number input field

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| label | string | Input label |
| type | 'text' \| 'number' | Input type |
| value | string \| number | Current value |
| onChange | function | Change handler |
| placeholder | string | Placeholder text |
| suffix | string | Text after input (e.g., "kcal") |
| prefix | string | Text before input |
| disabled | boolean | Disabled state |
| error | boolean | Error state styling |

---

#### 12. LoadingOverlay

**File:** `/src/components/common/LoadingOverlay.tsx`

**Purpose:** Full-screen loading state

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| message | string | Loading message text |

**Visual Elements:**
- Full-screen backdrop
- Centered spinner
- Loading message

---

#### 13. LoadingSpinner

**File:** `/src/components/common/LoadingSpinner.tsx`

**Purpose:** Animated loading indicator

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| size | 'sm' \| 'md' \| 'lg' | Spinner size |
| centered | boolean | Center in container |

---

#### 14. MarkdownText

**File:** `/src/components/common/MarkdownText.tsx`

**Purpose:** Render markdown-formatted text

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| children | string | Markdown content |
| className | string | Additional classes |

**Supported Formatting:**
- Bold text
- Italic text
- Lists
- Line breaks

---

#### 15. MobileCarousel

**File:** `/src/components/common/MobileCarousel.tsx`

**Purpose:** Touch-enabled carousel for mobile

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| items | T[] | Array of items to display |
| renderItem | function | Render function for each item |

**Behavior:**
- Mobile: Horizontal scrolling carousel with dots
- Desktop: Falls back to grid layout

---

#### 16. RangeSlider

**File:** `/src/components/common/RangeSlider.tsx`

**Purpose:** Slider input for numeric values

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| label | string | Slider label |
| value | number | Current value |
| onChange | function | Change handler |
| min | number | Minimum value |
| max | number | Maximum value |
| disabled | boolean | Disabled state |

**Visual Elements:**
- Label with current value display
- Slider track
- Slider thumb

---

#### 17. SessionExpiredModal

**File:** `/src/components/common/SessionExpiredModal.tsx`

**Purpose:** Notify user of session expiration

**Visual Elements:**
- Modal overlay
- Session icon
- "Session Expired" title
- Explanation text
- "Sign In Again" button

**User Interactions:**
- Click "Sign In Again" → Navigate to login

**Trigger:**
- API returns 401/403 status

---

#### 18. WeeklyLimitBanner

**File:** `/src/components/common/WeeklyLimitBanner.tsx`

**Purpose:** Warning banner for weekly AI generation limit

**Visual Elements:**
- Full-width banner
- Warning icon
- Limit message
- Primary color styling

---

#### 19. WeeklyLimitModal

**File:** `/src/components/common/WeeklyLimitModal.tsx`

**Purpose:** Modal with weekly limit details

**Visual Elements:**
- Modal overlay
- Limit icon
- "Weekly Limit Reached" title
- Explanation text
- Next reset time
- Close button

---

### Feature Components (`/components/features`)

#### 1. RecipeCard

**File:** `/src/components/features/RecipeCard.tsx`

**Purpose:** Recipe display card for grids

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| recipe | Recipe | Recipe data object |
| isSelected | boolean | Selection state |
| isFavorite | boolean | Favorite state |
| imageType | 'mealPlan' \| 'familyMeal' \| 'specialMeal' | Image category |
| onSelect | function | Selection handler |
| onViewDetails | function | View details handler |
| onFavorite | function | Favorite toggle handler |
| onImageLoaded | function | Called when image loads |

**Visual Elements:**
| Element | Description |
|---------|-------------|
| Left Accent Bar | Orange vertical bar |
| Recipe Image | Background image with zoom on hover |
| Gradient Overlay | Dark gradient over image |
| Favorite Button | Heart icon (top-right) |
| Loading Spinner | Shows while image generates |
| Recipe Name | Bold title |
| Description | 2-line truncated text |
| Keywords | Pill badges |
| Macros Grid | 4-column (Cal, Pro, Carb, Fat) |
| Select Button | Full-width action button |

**States:**
- Default: Orange select button
- Selected: Orange ring border, "Selected" text
- Favorite: Filled heart icon

**User Interactions:**
1. Click image/content → View details
2. Click heart → Toggle favorite
3. Click select button → Select recipe

---

#### 2. LoadingRecipeCard

**File:** `/src/components/features/LoadingRecipeCard.tsx`

**Purpose:** Skeleton loading placeholder for recipe cards

**Visual Elements:**
- Pulsing gray image placeholder
- Pulsing text line placeholders
- Pulsing button placeholder

---

#### 3. RecipeDetailModal

**File:** `/src/components/features/RecipeDetailModal.tsx`

**Purpose:** Full recipe detail overlay

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| recipe | Recipe | Recipe data object |
| imageType | 'mealPlan' \| 'familyMeal' \| 'specialMeal' | Image category |
| onClose | function | Close handler |
| onImageLoaded | function | Called when image loads |

**Visual Layout:**
```
┌─────────────────────────────────────────────┐
│  Hero Image (72-96px height)                │
│  - Close button (top-right)                 │
│  - Recipe name (bottom-left)                │
│  - Cook time + Servings badges              │
├──────────────┬──────────────────────────────┤
│  Nutrition   │  Ingredients Section         │
│  Facts Card  │  - Grid of ingredients       │
│  (4 boxes)   │  - Convert button per item   │
│              ├──────────────────────────────┤
│  Servings    │  Preparation Section         │
│  Card        │  - Numbered steps            │
│              │  - Connecting lines          │
└──────────────┴──────────────────────────────┘
```

**User Interactions:**
1. Click close button → Close modal
2. Click backdrop → Close modal
3. Click ingredient convert button → Open IngredientConversionModal
4. Scroll through content

---

#### 4. RecipeChooserModal

**File:** `/src/components/features/RecipeChooserModal.tsx`

**Purpose:** Modal to select recipe from favorites or history

**Visual Elements:**
- Modal overlay
- Search input
- Recipe list
- Select button

**User Interactions:**
1. Type to search
2. Click recipe to select
3. Confirm selection

---

### Navigation Components (`/components/navigation`)

#### ProtectedRoute

**File:** `/src/components/navigation/ProtectedRoute.tsx`

**Purpose:** Route protection wrapper

**Behavior:**
1. Check authentication status from AuthContext
2. If authenticated → Render `<Outlet />`
3. If not authenticated → Redirect to `/login`
4. While checking → Show loading state

**Preserves:** Intended destination for post-login redirect

---

## User Flows

### 1. Login and Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  /login     │ -> │  Google     │ -> │  /auth/     │ -> │  /          │
│  page       │    │  OAuth      │    │  callback   │    │  (home)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Steps:**
1. User visits `/login` page
2. Clicks "Continue with Google"
3. Redirected to Google OAuth
4. After approval, redirected to `/auth/callback`
5. Token extracted from URL
6. User data fetched via API
7. Token and user stored in AuthContext
8. Redirected to home page

---

### 2. Meal Plan Creation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /meal-plans │ -> │ /meal-plans │ -> │ /meal-plans │ -> │ /meal-plans │
│             │    │ /create     │    │ /recipes    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
    [List]           [Configure]       [Select]          [Saved]
```

**Steps:**
1. User navigates to `/meal-plans`
2. Clicks "Create New Plan"
3. Fills configuration form:
   - Plan name
   - Dietary restrictions
   - Focus areas with priorities
   - Macro targets
   - Must-haves and excludes
   - Meals per day and days
4. Clicks "Next"
5. Request stored in sessionStorage
6. Redirected to `/meal-plans/recipes`
7. API generates 3 recipe options
8. User views details, favorites, selects one
9. Clicks "Save Selected"
10. Plan created via API
11. Redirected to `/meal-plans` list

---

### 3. Family Calendar Management Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /calendar   │ -> │ /calendar   │ -> │ /calendar   │ -> │ /calendar   │
│             │    │ /create     │    │ /recipes    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
    [View]           [Configure]       [Select]          [Updated]
```

**Steps:**
1. User views `/calendar` with monthly view
2. Navigates to desired month
3. Clicks empty day or "Add Meal" button
4. Fills meal configuration:
   - Date (pre-filled)
   - Meal type
   - Restrictions
   - Preferences
5. Clicks "Next"
6. Selects from generated recipes
7. Saves selection
8. Returns to calendar with new meal

---

### 4. Special Meals Planning Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ /special-    │ -> │ /special-    │ -> │ /special-    │ -> │ /special-    │
│ meals        │    │ meals/create │    │ meals/recipes│    │ meals        │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
    [List]            [Configure]         [Select]           [Saved]
```

**Steps:**
1. User navigates to `/special-meals`
2. Clicks "Plan New Event"
3. Fills event configuration:
   - Event name
   - Event date
   - Guest count
   - Restrictions
   - Cuisine preferences
4. Clicks "Next"
5. Selects from generated recipes
6. Saves selection
7. Returns to special meals list

---

### 5. Favorites Management Flow

```
┌─────────────┐                        ┌─────────────┐
│  Any Recipe │ -- Click Heart ---->   │ /favorites  │
│  Card       │                        │             │
└─────────────┘                        └─────────────┘
```

**Add to Favorites:**
1. From any recipe card, click heart icon
2. API call to add favorite
3. Heart fills with solid color
4. Recipe appears in `/favorites`

**Remove from Favorites:**
1. From favorites page or recipe card
2. Click filled heart icon
3. API call to remove favorite
4. Heart becomes outline
5. Recipe removed from favorites list

---

### 6. Recipe Detail with Unit Conversion Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Recipe Card │ -> │ Recipe      │ -> │ Conversion  │
│             │    │ Detail      │    │ Modal       │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Steps:**
1. Click recipe card to open detail modal
2. View recipe with image, description, macros
3. Scroll to ingredients list
4. Hover over ingredient row
5. Click scale icon to convert
6. Conversion modal opens
7. Select target unit
8. Choose quantity (shortcuts or custom)
9. Toggle dried-to-cooked if applicable
10. View converted result
11. Close modal

---

### 7. Settings Management Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /settings   │ -> │ Make Changes│ -> │ Save        │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Steps:**
1. Navigate to `/settings` via sidebar
2. View profile card (name, email, plan)
3. Change preferences:
   - Language: Immediate effect
   - Dietary restrictions: Edit chips
4. Click "Save Changes"
5. API updates user profile
6. Success indicator shows

---

## State Management

### Global State (React Context)

#### AuthContext
**File:** `/src/context/AuthContext.tsx`

| State | Type | Description |
|-------|------|-------------|
| user | User \| null | Current user object |
| token | string \| null | JWT token |
| isAuthenticated | boolean | Auth status |
| isLoading | boolean | Auth check in progress |

| Method | Description |
|--------|-------------|
| login(token, user) | Store auth data |
| logout() | Clear auth data |
| updateUser(user) | Update user object |

**Persistence:** localStorage via `storage` utility

---

#### ThemeContext
**File:** `/src/context/ThemeContext.tsx`

| State | Type | Description |
|-------|------|-------------|
| theme | 'light' \| 'dark' | Current theme |

| Method | Description |
|--------|-------------|
| toggleTheme() | Switch between light/dark |
| setTheme(theme) | Set specific theme |

**Persistence:** localStorage with key `theme`
**Detection:** System preference via `prefers-color-scheme`

---

#### LanguageContext
**File:** `/src/context/LanguageContext.tsx`

| State | Type | Description |
|-------|------|-------------|
| currentLanguage | 'en' \| 'pt' \| 'sv' | Active language |
| supportedLanguages | string[] | Available languages |

| Method | Description |
|--------|-------------|
| changeLanguage(lang) | Change language |

**Persistence:** User profile + localStorage
**Detection:** Browser language via `navigator.language`

---

### Server State (React Query)

| Query Key | Service | Cache Time |
|-----------|---------|------------|
| `['currentUser']` | userService.getMe() | 5 min |
| `['user']` | userService.getMe() | 5 min |
| `['focusAreas']` | configService.getFocusAreas() | 5 min |
| `['mealPlans']` | receitaiPlanService.getPlans() | 5 min |
| `['familyPlans', start, end]` | familyPlanService.getPlans() | 5 min |
| `['foodFriends']` | foodFriendsService.getEvents() | 5 min |
| `['favorites']` | favoriteService.getFavorites() | 5 min |

---

### Session State

| Key | Purpose |
|-----|---------|
| `pendingMealPlanRequest` | Meal plan config before generation |
| `pendingMealPlan` | Generated recipes for selection |
| `viewingFamilyMeal` | Family meal for detail view |
| `viewingSpecialMeal` | Special meal for detail view |
| `viewingFavorite` | Favorite recipe for detail view |

## Internationalization

### Supported Languages

| Code | Language | Label |
|------|----------|-------|
| en | English | English |
| pt | Portuguese | Português |
| sv | Swedish | Svenska |

### Translation Namespaces

| Namespace | Content |
|-----------|---------|
| navigation | Sidebar, header, brand text |
| mealPlans | Meal plan pages, home page |
| familyCalendar | Calendar pages |
| specialMeals | Special meal pages |
| favorites | Favorites page |
| settings | Settings page |
| auth | Login page |
| common | Shared terms (buttons, time, units) |
| legal | Terms and privacy pages |

### Language Detection Order
1. User profile preference (if logged in)
2. localStorage saved preference
3. Browser language (`navigator.language`)
4. Default: English (en)

---

## Theme System

### Theme Toggle
- Location: Sidebar bottom section
- Icon: Sun (light mode) / Moon (dark mode)
- Persistence: localStorage
- Detection: `prefers-color-scheme` media query

---

*Document generated for ReceitAI v1.0*
