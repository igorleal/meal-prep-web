import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, LoadingOverlay, WeeklyLimitBanner, WeeklyLimitModal } from '@/components/common'
import { RecipeCard, RecipeDetailModal } from '@/components/features'
import { familyPlanService, favoriteService, userService } from '@/api/services'
import type { Recipe } from '@/types'

interface PendingFamilyMeal {
  date: string
  mealType: string
  restrictions: string[]
  mustHaves: string[]
  exclusions: string[]
  recipes: Recipe[]
}

export default function FamilyCalendarRecipeSelectionPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingMeal, setPendingMeal] = useState<PendingFamilyMeal | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingFamilyMeal')
    if (stored) {
      setPendingMeal(JSON.parse(stored))
      setIsLoading(false)
    } else {
      navigate('/calendar')
    }
  }, [navigate])

  // Fetch favorites to check which recipes are favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
  })

  const favoriteIds = new Set(favorites.map((f) => f.id))

  const saveMutation = useMutation({
    mutationFn: () => {
      const selectedRecipe = pendingMeal!.recipes.find((r) => r.id === selectedRecipeId)
      return familyPlanService.createPlan({
        requestId: selectedRecipe!.requestId,
        recipeId: selectedRecipeId!,
        date: pendingMeal!.date,
      })
    },
    onSuccess: () => {
      sessionStorage.removeItem('pendingFamilyMeal')
      queryClient.invalidateQueries({ queryKey: ['familyPlans'] })
      navigate('/calendar')
    },
  })

  const addFavoriteMutation = useMutation({
    mutationFn: favoriteService.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: favoriteService.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const handleToggleFavorite = (recipeId: string) => {
    if (favoriteIds.has(recipeId)) {
      removeFavoriteMutation.mutate(recipeId)
    } else {
      addFavoriteMutation.mutate(recipeId)
    }
  }

  const regenerateMutation = useMutation({
    mutationFn: () => {
      const requestId = pendingMeal!.recipes[0].requestId
      return familyPlanService.regenerateRecipes(requestId)
    },
    onSuccess: (newRecipes) => {
      const updatedMeal = { ...pendingMeal!, recipes: newRecipes }
      setPendingMeal(updatedMeal)
      sessionStorage.setItem('pendingFamilyMeal', JSON.stringify(updatedMeal))
      setSelectedRecipeId(null)
      // Refetch user to check if limit was reached
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error.response?.status === 429) {
        setShowLimitModal(true)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      }
    },
  })

  if (!pendingMeal && isLoading) {
    return <LoadingOverlay message="Loading recipes..." />
  }

  if (!pendingMeal) {
    return null
  }

  // Parse date for display
  const date = new Date(pendingMeal.date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const dayNum = date.getDate()

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate(`/calendar/create?date=${pendingMeal.date}&meal=${pendingMeal.mealType}`)}
        className="flex items-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors mb-6"
      >
        <Icon name="arrow_back" size="sm" />
        Back to Meal Details
      </button>

      {/* Weekly Limit Banner */}
      {hasReachedLimit && <WeeklyLimitBanner />}

      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
            <Icon name="auto_awesome" className="text-lg" />
            AI Recommended For You
          </div>
          <h1 className="text-text-main-light dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Personalized Menu Selection
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-lg max-w-2xl">
            AI suggestions for <strong className="text-text-main-light dark:text-white">{pendingMeal.mealType}, {dayName} {month} {dayNum}</strong> based on your preferences.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            icon="refresh"
            iconPosition="left"
            className="rounded-xl"
            loading={regenerateMutation.isPending}
            disabled={hasReachedLimit}
            onClick={() => regenerateMutation.mutate()}
          >
            Refresh Suggestions
          </Button>
          <Button
            icon="check"
            iconPosition="left"
            disabled={!selectedRecipeId}
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="rounded-xl"
          >
            Confirm Selection
          </Button>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pendingMeal.recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipeId === recipe.id}
            isFavorite={favoriteIds.has(recipe.id)}
            onSelect={() => setSelectedRecipeId(prev => prev === recipe.id ? null : recipe.id)}
            onViewDetails={() => setViewingRecipe(recipe)}
            onFavorite={() => handleToggleFavorite(recipe.id)}
          />
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {viewingRecipe && (
        <RecipeDetailModal
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
        />
      )}

      {/* Weekly Limit Modal */}
      {showLimitModal && (
        <WeeklyLimitModal onClose={() => setShowLimitModal(false)} />
      )}
    </div>
  )
}
