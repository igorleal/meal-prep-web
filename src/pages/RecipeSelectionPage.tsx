import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, LoadingOverlay, WeeklyLimitBanner, WeeklyLimitModal } from '@/components/common'
import { RecipeCard, RecipeDetailModal } from '@/components/features'
import { receitaiPlanService, favoriteService, userService } from '@/api/services'
import type { Recipe } from '@/types'

interface PendingMealPlan {
  planName: string
  recipes: Recipe[]
}

export default function RecipeSelectionPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingPlan, setPendingPlan] = useState<PendingMealPlan | null>(null)
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
    const stored = sessionStorage.getItem('pendingMealPlan')
    if (stored) {
      setPendingPlan(JSON.parse(stored))
      setIsLoading(false)
    } else {
      navigate('/meal-plans/create')
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
      const selectedRecipe = pendingPlan!.recipes.find((r) => r.id === selectedRecipeId)
      return receitaiPlanService.createPlan({
        mealPrepPlanRequestId: selectedRecipe!.requestId,
        recipeId: selectedRecipeId!,
      })
    },
    onSuccess: () => {
      sessionStorage.removeItem('pendingMealPlan')
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
      navigate('/meal-plans')
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
      const requestId = pendingPlan!.recipes[0].requestId
      return receitaiPlanService.regenerateRecipes(requestId)
    },
    onSuccess: (newRecipes) => {
      const updatedPlan = { ...pendingPlan!, recipes: newRecipes }
      setPendingPlan(updatedPlan)
      sessionStorage.setItem('pendingMealPlan', JSON.stringify(updatedPlan))
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

  const handleRecipeImageLoaded = useCallback((updatedRecipe: Recipe) => {
    setPendingPlan((prev) => {
      if (!prev) return prev
      const updatedRecipes = prev.recipes.map((r) =>
        r.id === updatedRecipe.id ? { ...r, imageUrl: updatedRecipe.imageUrl } : r
      )
      const updatedPlan = { ...prev, recipes: updatedRecipes }
      sessionStorage.setItem('pendingMealPlan', JSON.stringify(updatedPlan))
      return updatedPlan
    })
    setViewingRecipe((prev) =>
      prev?.id === updatedRecipe.id ? { ...prev, imageUrl: updatedRecipe.imageUrl } : prev
    )
  }, [])

  if (!pendingPlan && isLoading) {
    return <LoadingOverlay message="Loading recipes..." />
  }

  if (!pendingPlan) {
    return null
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate('/meal-plans/create')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors mb-6"
      >
        <Icon name="arrow_back" size="sm" />
        Back to Plan Configuration
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
            We've analyzed your preferences to create these options for "{pendingPlan.planName}". Select your favorite to continue.
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
            icon="bookmark"
            iconPosition="left"
            disabled={!selectedRecipeId}
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="rounded-xl"
          >
            Save Selected
          </Button>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pendingPlan.recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipeId === recipe.id}
            isFavorite={favoriteIds.has(recipe.id)}
            imageType="mealPlan"
            onSelect={() => setSelectedRecipeId(prev => prev === recipe.id ? null : recipe.id)}
            onViewDetails={() => setViewingRecipe(recipe)}
            onFavorite={() => handleToggleFavorite(recipe.id)}
            onImageLoaded={handleRecipeImageLoaded}
          />
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {viewingRecipe && (
        <RecipeDetailModal
          recipe={viewingRecipe}
          imageType="mealPlan"
          onClose={() => setViewingRecipe(null)}
          onImageLoaded={handleRecipeImageLoaded}
        />
      )}

      {/* Weekly Limit Modal */}
      {showLimitModal && (
        <WeeklyLimitModal onClose={() => setShowLimitModal(false)} />
      )}
    </div>
  )
}
