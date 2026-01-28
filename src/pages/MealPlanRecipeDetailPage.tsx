import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, IngredientConversionModal, MarkdownText } from '@/components/common'
import { favoriteService } from '@/api/services'
import { getRecipeImageUrl } from '@/utils/placeholders'
import { parseInstructions } from '@/utils/recipe'
import { useFormatUnit } from '@/hooks'
import type { ReceitAIPlanResponse, RecipeIngredient } from '@/types'

export default function MealPlanRecipeDetailPage() {
  const { formatUnit } = useFormatUnit()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [plan, setPlan] = useState<ReceitAIPlanResponse | null>(null)
  const [conversionIngredient, setConversionIngredient] = useState<RecipeIngredient | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('viewingMealPlan')
    if (stored) {
      setPlan(JSON.parse(stored))
    } else {
      navigate('/meal-plans')
    }
  }, [navigate])

  // Fetch favorites to check if this recipe is favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
  })

  const recipe = plan?.recipe
  const request = plan?.request
  const isFavorite = recipe ? favorites.some((f) => f.id === recipe.id) : false

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

  const handleToggleFavorite = () => {
    if (!recipe) return
    if (isFavorite) {
      removeFavoriteMutation.mutate(recipe.id)
    } else {
      addFavoriteMutation.mutate(recipe.id)
    }
  }

  if (!plan || !recipe || !request) {
    return null
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero image */}
      <div className="relative h-[400px] lg:h-[480px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'mealPlan')}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="secondary"
            icon="arrow_back"
            iconPosition="left"
            onClick={() => {
              sessionStorage.removeItem('viewingMealPlan')
              navigate('/meal-plans')
            }}
            className="bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white hover:text-primary"
          >
            Back to Meal Plans
          </Button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                {recipe!.name}
              </h1>
              <div className="flex flex-wrap gap-3">
                <div className="flex h-9 items-center gap-x-2 rounded-lg bg-surface-dark-highlight/80 backdrop-blur-sm px-4 border border-white/10">
                  <Icon name="group" className="text-primary text-[20px]" />
                  <p className="text-white text-sm font-semibold">{recipe!.servings} Servings</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`h-12 w-12 flex items-center justify-center rounded-xl backdrop-blur-md transition-all border border-white/10 ${
                  isFavorite
                    ? 'bg-primary text-white hover:bg-primary/80'
                    : 'bg-surface-dark-highlight text-white hover:bg-white hover:text-black'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Icon name={isFavorite ? 'favorite' : 'favorite_border'} className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left column - Nutrition & Info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Nutrition Facts */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">Nutrition Facts</h3>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">per serving</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-dark border border-border-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    <p className="text-text-muted-dark text-sm font-medium">Protein</p>
                  </div>
                  <p className="text-white text-2xl font-bold">{recipe.macros.protein || '-'}g</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-dark border border-border-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-yellow-500"></span>
                    <p className="text-text-muted-dark text-sm font-medium">Carbs</p>
                  </div>
                  <p className="text-white text-2xl font-bold">{recipe.macros.carbs || '-'}g</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-dark border border-border-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-red-500"></span>
                    <p className="text-text-muted-dark text-sm font-medium">Fat</p>
                  </div>
                  <p className="text-white text-2xl font-bold">{recipe.macros.fats || '-'}g</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface-dark border border-border-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <p className="text-text-muted-dark text-sm font-medium">Calories</p>
                  </div>
                  <p className="text-white text-2xl font-bold">{recipe.macros.calories || '-'}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {recipe.keywords && recipe.keywords.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-white text-xl font-bold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-surface-dark border border-border-dark text-text-muted-dark text-sm hover:text-primary hover:border-primary transition-colors cursor-pointer"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Ingredients & Instructions */}
          <div className="lg:col-span-8 space-y-10">
            {/* Ingredients */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-dark pb-4">
                <h3 className="text-white text-2xl font-bold">Ingredients</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-3 rounded-xl bg-surface-dark/40 border border-border-dark hover:border-primary/50 transition-colors"
                  >
                    <span className="text-white font-medium">
                      {ing.quantity} {formatUnit(ing.unit)} {ing.name}
                    </span>
                    <button
                      onClick={() => setConversionIngredient(ing)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-primary/20 hover:bg-primary/40 p-1.5 rounded-lg text-primary flex-shrink-0 ml-2"
                      title="Convert units"
                    >
                      <Icon name="auto_fix_high" className="text-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Preparation */}
            <section className="flex flex-col gap-6 pt-4">
              <div className="flex items-center justify-between border-b border-border-dark pb-4">
                <h3 className="text-white text-2xl font-bold">Preparation</h3>
              </div>
              <div className="flex flex-col gap-0 relative">
                <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-border-dark"></div>
                {parseInstructions(recipe.instructions).map((step, i, steps) => (
                  <div key={i} className={`flex gap-6 ${i < steps.length - 1 ? 'pb-10' : ''} relative`}>
                    <div className="shrink-0 size-10 rounded-full bg-primary shadow-lg flex items-center justify-center text-white font-bold text-lg z-10 border-4 border-background-dark">
                      {i + 1}
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <MarkdownText className="text-text-muted-dark leading-relaxed">
                        {step}
                      </MarkdownText>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {conversionIngredient && (
        <IngredientConversionModal
          ingredient={conversionIngredient}
          onClose={() => setConversionIngredient(null)}
        />
      )}
    </div>
  )
}
