import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import ProtectedRoute from '@/components/navigation/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Pages
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import MealPlansPage from '@/pages/MealPlansPage'
import CreateMealPlanPage from '@/pages/CreateMealPlanPage'
import RecipeSelectionPage from '@/pages/RecipeSelectionPage'
import MealPlanRecipeDetailPage from '@/pages/MealPlanRecipeDetailPage'
import FamilyCalendarPage from '@/pages/FamilyCalendarPage'
import CreateFamilyMealPage from '@/pages/CreateFamilyMealPage'
import FamilyCalendarRecipeSelectionPage from '@/pages/FamilyCalendarRecipeSelectionPage'
import FamilyCalendarRecipeDetailPage from '@/pages/FamilyCalendarRecipeDetailPage'
import SpecialMealsPage from '@/pages/SpecialMealsPage'
import CreateSpecialMealPage from '@/pages/CreateSpecialMealPage'
import SpecialMealRecipeSelectionPage from '@/pages/SpecialMealRecipeSelectionPage'
import SpecialMealRecipeDetailPage from '@/pages/SpecialMealRecipeDetailPage'
import SettingsPage from '@/pages/SettingsPage'
import ComingSoonPage from '@/pages/ComingSoonPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />

                {/* Meal Plans */}
                <Route path="/meal-plans" element={<MealPlansPage />} />
                <Route path="/meal-plans/create" element={<CreateMealPlanPage />} />
                <Route path="/meal-plans/recipes" element={<RecipeSelectionPage />} />
                <Route path="/meal-plans/recipe" element={<MealPlanRecipeDetailPage />} />

                {/* Family Calendar */}
                <Route path="/calendar" element={<FamilyCalendarPage />} />
                <Route path="/calendar/create" element={<CreateFamilyMealPage />} />
                <Route path="/calendar/recipes" element={<FamilyCalendarRecipeSelectionPage />} />
                <Route path="/calendar/recipe" element={<FamilyCalendarRecipeDetailPage />} />

                {/* Special Meals */}
                <Route path="/special-meals" element={<SpecialMealsPage />} />
                <Route path="/special-meals/create" element={<CreateSpecialMealPage />} />
                <Route path="/special-meals/recipes" element={<SpecialMealRecipeSelectionPage />} />
                <Route path="/special-meals/recipe" element={<SpecialMealRecipeDetailPage />} />

                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />

                {/* Coming Soon */}
                <Route path="/pantry" element={<ComingSoonPage title="Pantry" icon="kitchen" />} />
                <Route path="/favorites" element={<ComingSoonPage title="Favorites" icon="favorite" />} />
                <Route path="/shopping-list" element={<ComingSoonPage title="Shopping List" icon="shopping_cart" />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
