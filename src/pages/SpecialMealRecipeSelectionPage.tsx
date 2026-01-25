import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, WeeklyLimitBanner, WeeklyLimitModal, MobileCarousel } from '@/components/common'
import { RecipeCard, RecipeDetailModal } from '@/components/features'
import { foodFriendsService, favoriteService, userService } from '@/api/services'
import type { Recipe, GenerateFoodFriendsRequest } from '@/types'

interface PendingSpecialMeal {
  name: string
  recipes: Recipe[]
  restrictions: string[]
  mustHaves: string[]
  exclusions: string[]
}

interface PendingRequest {
  name: string
  eventDate: string
  restrictions: string[]
  mustHaves: string[]
  exclusions: string[]
  request: GenerateFoodFriendsRequest
}

function LoadingCard() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xl animate-pulse">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/30 z-30" />
      <div className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-primary animate-spin" />
          <span className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
            Generating recipe...
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-8 pt-4 md:pt-6">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
        <div className="mt-auto">
          <div className="mb-6 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function ErrorState({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Icon name="error_outline" className="text-4xl text-red-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-main-light dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mb-8">
          We couldn't generate your recipes. This might be a temporary issue. Please try again.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onBack}>
            Go Back
          </Button>
          <Button onClick={onRetry} icon="refresh" iconPosition="left">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SpecialMealRecipeSelectionPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingMeal, setPendingMeal] = useState<PendingSpecialMeal | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [eventName, setEventName] = useState('')

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  const generateRecipes = useCallback(async (pendingRequest: PendingRequest) => {
    setIsGenerating(true)
    setHasError(false)
    setEventName(pendingRequest.name)
    try {
      const recipes = await foodFriendsService.generateRecipes(pendingRequest.request)
      const meal: PendingSpecialMeal = {
        name: pendingRequest.name,
        recipes,
        restrictions: pendingRequest.restrictions,
        mustHaves: pendingRequest.mustHaves,
        exclusions: pendingRequest.exclusions,
      }
      setPendingMeal(meal)
      sessionStorage.setItem('pendingSpecialMeal', JSON.stringify(meal))
      sessionStorage.removeItem('pendingSpecialMealRequest')
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } }
      if (err.response?.status === 429) {
        setShowLimitModal(true)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      }
      setHasError(true)
    } finally {
      setIsGenerating(false)
    }
  }, [queryClient])

  useEffect(() => {
    // First check if we have recipes already
    const storedMeal = sessionStorage.getItem('pendingSpecialMeal')
    if (storedMeal) {
      const parsed = JSON.parse(storedMeal)
      setPendingMeal(parsed)
      setEventName(parsed.name)
      return
    }

    // Otherwise check for a pending request
    const storedRequest = sessionStorage.getItem('pendingSpecialMealRequest')
    if (storedRequest) {
      const pendingRequest = JSON.parse(storedRequest) as PendingRequest
      generateRecipes(pendingRequest)
      return
    }

    // No data - redirect back
    navigate('/special-meals')
  }, [navigate, generateRecipes])

  // Fetch favorites to check which recipes are favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
  })

  const favoriteIds = new Set(favorites.map((f) => f.id))

  const saveMutation = useMutation({
    mutationFn: () => {
      const selectedRecipe = pendingMeal!.recipes.find((r) => r.id === selectedRecipeId)
      return foodFriendsService.createEvent({
        requestId: selectedRecipe!.requestId,
        recipeId: selectedRecipeId!,
      })
    },
    onSuccess: () => {
      sessionStorage.removeItem('pendingSpecialMeal')
      sessionStorage.removeItem('pendingSpecialMealRequest')
      queryClient.invalidateQueries({ queryKey: ['foodFriends'] })
      navigate('/special-meals')
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
      return foodFriendsService.regenerateRecipes(requestId)
    },
    onSuccess: (newRecipes) => {
      const updatedMeal = { ...pendingMeal!, recipes: newRecipes }
      setPendingMeal(updatedMeal)
      sessionStorage.setItem('pendingSpecialMeal', JSON.stringify(updatedMeal))
      setSelectedRecipeId(null)
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
    setPendingMeal((prev) => {
      if (!prev) return prev
      const updatedRecipes = prev.recipes.map((r) =>
        r.id === updatedRecipe.id ? { ...r, imageUrl: updatedRecipe.imageUrl } : r
      )
      const updatedMeal = { ...prev, recipes: updatedRecipes }
      sessionStorage.setItem('pendingSpecialMeal', JSON.stringify(updatedMeal))
      return updatedMeal
    })
    setViewingRecipe((prev) =>
      prev?.id === updatedRecipe.id ? { ...prev, imageUrl: updatedRecipe.imageUrl } : prev
    )
  }, [])

  const handleRetry = () => {
    const storedRequest = sessionStorage.getItem('pendingSpecialMealRequest')
    if (storedRequest) {
      const pendingRequest = JSON.parse(storedRequest) as PendingRequest
      generateRecipes(pendingRequest)
    } else {
      navigate('/special-meals/create')
    }
  }

  // Show error state
  if (hasError && !isGenerating) {
    return (
      <ErrorState
        onRetry={handleRetry}
        onBack={() => navigate('/special-meals/create')}
      />
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-12">
      {/* Back button */}
      <button
        onClick={() => navigate('/special-meals/create')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors mb-6"
      >
        <Icon name="arrow_back" size="sm" />
        Back to Event Details
      </button>

      {/* Weekly Limit Banner */}
      {hasReachedLimit && <WeeklyLimitBanner />}

      {/* Header */}
      <div className="mb-6 md:mb-12 flex flex-col gap-4 md:gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
            <Icon name="auto_awesome" className="text-lg" />
            AI Recommended For You
          </div>
          <h1 className="text-text-main-light dark:text-white text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Personalized Menu Selection
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-lg max-w-2xl">
            {isGenerating
              ? `Generating personalized recipes for "${eventName}"...`
              : <>AI suggestions for <strong className="text-text-main-light dark:text-white">"{eventName}"</strong> based on your guest preferences.</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            icon="refresh"
            iconPosition="left"
            className="rounded-xl"
            loading={regenerateMutation.isPending}
            disabled={hasReachedLimit || isGenerating || !pendingMeal}
            onClick={() => regenerateMutation.mutate()}
          >
            Refresh Suggestions
          </Button>
          <Button
            icon="check"
            iconPosition="left"
            disabled={!selectedRecipeId || isGenerating}
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="rounded-xl"
          >
            Confirm & Save Event
          </Button>
        </div>
      </div>

      {/* Recipe grid - Loading state */}
      {(isGenerating || regenerateMutation.isPending) && (
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      )}

      {/* Recipe grid - Mobile carousel */}
      {!isGenerating && !regenerateMutation.isPending && pendingMeal?.recipes && (
        <>
          <div className="md:hidden">
            <MobileCarousel
              items={pendingMeal.recipes}
              keyExtractor={(recipe) => recipe.id}
              renderItem={(recipe) => (
                <RecipeCard
                  recipe={recipe}
                  isSelected={selectedRecipeId === recipe.id}
                  isFavorite={favoriteIds.has(recipe.id)}
                  imageType="specialMeal"
                  onSelect={() => setSelectedRecipeId(prev => prev === recipe.id ? null : recipe.id)}
                  onViewDetails={() => setViewingRecipe(recipe)}
                  onFavorite={() => handleToggleFavorite(recipe.id)}
                  onImageLoaded={handleRecipeImageLoaded}
                />
              )}
            />
          </div>

          {/* Recipe grid - Desktop */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingMeal.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSelected={selectedRecipeId === recipe.id}
                isFavorite={favoriteIds.has(recipe.id)}
                imageType="specialMeal"
                onSelect={() => setSelectedRecipeId(prev => prev === recipe.id ? null : recipe.id)}
                onViewDetails={() => setViewingRecipe(recipe)}
                onFavorite={() => handleToggleFavorite(recipe.id)}
                onImageLoaded={handleRecipeImageLoaded}
              />
            ))}
          </div>
        </>
      )}

      {/* Recipe Detail Modal */}
      {viewingRecipe && (
        <RecipeDetailModal
          recipe={viewingRecipe}
          imageType="specialMeal"
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
