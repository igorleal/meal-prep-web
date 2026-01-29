import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, WeeklyLimitBanner, WeeklyLimitModal, MobileCarousel, ContentValidationErrorModal } from '@/components/common'
import { isContentValidationError } from '@/utils/errors'
import { RecipeCard, RecipeDetailModal, SkeletonRecipeCard } from '@/components/features'
import { receitaiPlanService, favoriteService, userService } from '@/api/services'
import type { Recipe, GenerateReceitAIPlanRequest } from '@/types'

interface PendingMealPlan {
  planName: string
  recipes: Recipe[]
}

interface PendingRequest {
  planName: string
  request: GenerateReceitAIPlanRequest
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

export default function RecipeSelectionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [pendingPlan, setPendingPlan] = useState<PendingMealPlan | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showContentValidationModal, setShowContentValidationModal] = useState(false)
  const [planName, setPlanName] = useState('')

  // Check if we're using a pre-selected recipe source
  const recipeSource = searchParams.get('source') as 'favorite' | 'loaded' | null
  const isPreSelectedSource = recipeSource === 'favorite' || recipeSource === 'loaded'
  const [preSelectedRecipe, setPreSelectedRecipe] = useState<Recipe | null>(null)

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  const generateRecipes = useCallback(async (request: GenerateReceitAIPlanRequest, name: string) => {
    setIsGenerating(true)
    setHasError(false)
    setPlanName(name)
    try {
      const recipes = await receitaiPlanService.generateRecipes(request)
      const plan = { planName: name, recipes }
      setPendingPlan(plan)
      sessionStorage.setItem('pendingMealPlan', JSON.stringify(plan))
      sessionStorage.removeItem('pendingMealPlanRequest')
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    } catch (error: unknown) {
      if (isContentValidationError(error)) {
        setShowContentValidationModal(true)
        return
      }
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
    // Check if we're using a pre-selected recipe source (favorite or loaded)
    if (isPreSelectedSource) {
      const storedRecipe = sessionStorage.getItem('selectedRecipe')
      const storedRequest = sessionStorage.getItem('pendingMealPlanRequest')
      if (storedRecipe && storedRequest) {
        const recipe = JSON.parse(storedRecipe) as Recipe
        const { planName: name } = JSON.parse(storedRequest) as PendingRequest
        setPreSelectedRecipe(recipe)
        setSelectedRecipeId(recipe.id)
        setPlanName(name)
        return
      }
      // No data - redirect back
      navigate('/meal-plans/source')
      return
    }

    // First check if we have recipes already
    const storedPlan = sessionStorage.getItem('pendingMealPlan')
    if (storedPlan) {
      setPendingPlan(JSON.parse(storedPlan))
      const parsed = JSON.parse(storedPlan)
      setPlanName(parsed.planName)
      return
    }

    // Otherwise check for a pending request
    const storedRequest = sessionStorage.getItem('pendingMealPlanRequest')
    if (storedRequest) {
      const { planName: name, request } = JSON.parse(storedRequest) as PendingRequest
      generateRecipes(request, name)
      return
    }

    // No data - redirect back
    navigate('/meal-plans/create')
  }, [navigate, generateRecipes, isPreSelectedSource])

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
      sessionStorage.removeItem('pendingMealPlanRequest')
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
      navigate('/meal-plans')
    },
  })

  // Mutation for saving plan from pre-selected recipe (favorite/loaded)
  const saveFromRecipeMutation = useMutation({
    mutationFn: () => {
      return receitaiPlanService.createPlanFromRecipe({
        name: planName,
        recipeId: preSelectedRecipe!.id,
      })
    },
    onSuccess: () => {
      sessionStorage.removeItem('pendingMealPlanRequest')
      sessionStorage.removeItem('selectedRecipe')
      sessionStorage.removeItem('recipeSource')
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

  const handleRetry = () => {
    const storedRequest = sessionStorage.getItem('pendingMealPlanRequest')
    if (storedRequest) {
      const { planName: name, request } = JSON.parse(storedRequest) as PendingRequest
      generateRecipes(request, name)
    } else {
      navigate('/meal-plans/create')
    }
  }

  // Show error state
  if (hasError && !isGenerating) {
    return (
      <ErrorState
        onRetry={handleRetry}
        onBack={() => navigate('/meal-plans/create')}
      />
    )
  }

  // Determine header content based on source
  const getHeaderContent = () => {
    if (isPreSelectedSource) {
      const sourceLabel = recipeSource === 'favorite' ? 'From Favorites' : 'Loaded Recipe'
      return {
        badge: sourceLabel,
        icon: recipeSource === 'favorite' ? 'favorite' : 'upload',
        title: 'Confirm Your Recipe',
        description: `You've selected this recipe for "${planName}". Review and save to create your plan.`,
      }
    }
    return {
      badge: 'AI Recommended For You',
      icon: 'auto_awesome',
      title: 'Personalized Menu Selection',
      description: isGenerating
        ? `Generating personalized recipes for "${planName}"...`
        : `We've analyzed your preferences to create these options for "${planName}". Select your favorite to continue.`,
    }
  }

  const headerContent = getHeaderContent()

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-12 pb-40">
        {/* Back button */}
        <button
          onClick={() => navigate(isPreSelectedSource ? '/meal-plans/source' : '/meal-plans/create')}
          className="flex items-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors mb-6"
        >
          <Icon name="arrow_back" size="sm" />
          {isPreSelectedSource ? 'Back to Source Selection' : 'Back to Plan Configuration'}
        </button>

        {/* Weekly Limit Banner */}
        {hasReachedLimit && !isPreSelectedSource && <WeeklyLimitBanner />}

        {/* Header */}
        <div className="mb-6 md:mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
            <Icon name={headerContent.icon} className="text-lg" />
            {headerContent.badge}
          </div>
          <h1 className="text-text-main-light dark:text-white text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            {headerContent.title}
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-lg max-w-2xl">
            {headerContent.description}
          </p>
        </div>

        {/* Pre-selected recipe display (favorite/loaded) */}
        {isPreSelectedSource && preSelectedRecipe && (
          <div className="max-w-lg mx-auto">
            <RecipeCard
              recipe={preSelectedRecipe}
              isSelected={true}
              isFavorite={favoriteIds.has(preSelectedRecipe.id)}
              imageType="mealPlan"
              onSelect={() => {}}
              onViewDetails={() => setViewingRecipe(preSelectedRecipe)}
              onFavorite={() => handleToggleFavorite(preSelectedRecipe.id)}
            />
          </div>
        )}

        {/* Recipe grid - Loading state (AI generation only) */}
        {!isPreSelectedSource && (isGenerating || regenerateMutation.isPending) && (
          <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonRecipeCard />
            <SkeletonRecipeCard />
            <SkeletonRecipeCard />
          </div>
        )}

        {/* Recipe grid - Mobile carousel (AI generation only) */}
        {!isPreSelectedSource && !isGenerating && !regenerateMutation.isPending && pendingPlan?.recipes && (
          <>
            <div className="md:hidden">
              <MobileCarousel
                items={pendingPlan.recipes}
                keyExtractor={(recipe) => recipe.id}
                renderItem={(recipe) => (
                  <RecipeCard
                    recipe={recipe}
                    isSelected={selectedRecipeId === recipe.id}
                    isFavorite={favoriteIds.has(recipe.id)}
                    imageType="mealPlan"
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
          </>
        )}

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

        {/* Content Validation Error Modal */}
        {showContentValidationModal && (
          <ContentValidationErrorModal
            onClose={() => navigate('/meal-plans/create')}
            onGoBack={() => navigate('/meal-plans/create')}
          />
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-t border-border-light dark:border-border-dark p-6 z-30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Regenerate button - only show for AI generation */}
          {!isPreSelectedSource && (
            <Button
              variant="ghost"
              icon="refresh"
              iconPosition="left"
              className="w-full sm:w-auto"
              loading={regenerateMutation.isPending}
              disabled={hasReachedLimit || isGenerating || !pendingPlan}
              onClick={() => regenerateMutation.mutate()}
            >
              Regenerate Options
            </Button>
          )}
          {/* Spacer for pre-selected source */}
          {isPreSelectedSource && <div />}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {!isPreSelectedSource && (
              <span className="hidden sm:inline-block text-sm text-text-muted-light dark:text-text-muted-dark">
                {selectedRecipeId ? '1 of 3 options selected' : 'No option selected'}
              </span>
            )}
            <Button
              icon="check"
              iconPosition="left"
              disabled={isPreSelectedSource ? !preSelectedRecipe : (!selectedRecipeId || isGenerating)}
              loading={isPreSelectedSource ? saveFromRecipeMutation.isPending : saveMutation.isPending}
              onClick={() => isPreSelectedSource ? saveFromRecipeMutation.mutate() : saveMutation.mutate()}
              className="w-full sm:w-auto"
            >
              {isPreSelectedSource ? 'Save Plan' : 'Save Selected'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
