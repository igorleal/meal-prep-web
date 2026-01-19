import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Badge, Icon, Chip, LoadingOverlay } from '@/components/common'
import { receitaiPlanService } from '@/api/services'
import { cn } from '@/utils/cn'
import type { Recipe } from '@/types'

interface PendingMealPlan {
  requestId: string
  planName: string
  recipes: Recipe[]
}

function RecipeCard({
  recipe,
  isSelected,
  onSelect,
  onFavorite,
}: {
  recipe: Recipe
  isSelected: boolean
  onSelect: () => void
  onFavorite: () => void
}) {
  return (
    <Card
      padding="none"
      hover
      className={cn(
        'overflow-hidden relative',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop")`,
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Icon name="favorite" size="sm" className="text-gray-400 hover:text-red-500" />
        </button>
        <Badge variant="default" className="absolute top-3 left-3">
          {recipe.servings} servings
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
          {recipe.name}
        </h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Ingredients preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.ingredients.slice(0, 3).map((ing, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs text-text-muted-light dark:text-text-muted-dark"
            >
              {ing.name}
            </span>
          ))}
          {recipe.ingredients.length > 3 && (
            <span className="px-2 py-1 text-xs text-text-muted-light dark:text-text-muted-dark">
              +{recipe.ingredients.length - 3} more
            </span>
          )}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Cal</p>
            <p className="font-bold text-text-main-light dark:text-white">
              {recipe.macros.calories || '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Pro</p>
            <p className="font-bold text-primary">{recipe.macros.protein || '-'}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Carb</p>
            <p className="font-bold text-text-main-light dark:text-white">
              {recipe.macros.carbs || '-'}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Fat</p>
            <p className="font-bold text-text-main-light dark:text-white">
              {recipe.macros.fats || '-'}g
            </p>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant={isSelected ? 'primary' : 'secondary'}
          className="w-full"
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Select Recipe'}
        </Button>
      </div>
    </Card>
  )
}

export function LoadingRecipeCard() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="aspect-video bg-gray-100 dark:bg-white/10 flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="auto_awesome"
            className="text-primary animate-pulse mb-2"
            size="xl"
          />
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Chef AI is cooking...
          </p>
        </div>
      </div>
      <div className="p-5 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-white/10 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded mb-4 w-1/2" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-white/10 rounded" />
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function RecipeSelectionPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingPlan, setPendingPlan] = useState<PendingMealPlan | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [filterChips, setFilterChips] = useState<string[]>(['All Recipes'])

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingMealPlan')
    if (stored) {
      setPendingPlan(JSON.parse(stored))
    } else {
      navigate('/meal-plans/create')
    }
  }, [navigate])

  const saveMutation = useMutation({
    mutationFn: () =>
      receitaiPlanService.createPlan({
        mealPrepPlanRequestId: pendingPlan!.requestId,
        recipeId: selectedRecipeId!,
      }),
    onSuccess: () => {
      sessionStorage.removeItem('pendingMealPlan')
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
      navigate('/meal-plans')
    },
  })

  if (!pendingPlan) {
    return <LoadingOverlay message="Loading recipes..." />
  }

  const filters = ['All Recipes', 'Under 30 mins', 'Vegetarian', 'High Protein']

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white">
              Your Personalized Menu
            </h1>
            <Badge variant="primary" icon="auto_awesome">
              AI
            </Badge>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Found {pendingPlan.recipes.length} recipes for &quot;{pendingPlan.planName}&quot;
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="refresh" iconPosition="left">
            Regenerate All
          </Button>
          <Button
            icon="bookmark"
            iconPosition="left"
            disabled={!selectedRecipeId}
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            Save Selected
          </Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <Chip
            key={filter}
            selected={filterChips.includes(filter)}
            onSelect={() => {
              if (filter === 'All Recipes') {
                setFilterChips(['All Recipes'])
              } else {
                setFilterChips((prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter)
                    : [...prev.filter((f) => f !== 'All Recipes'), filter]
                )
              }
            }}
          >
            {filter}
          </Chip>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingPlan.recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipeId === recipe.id}
            onSelect={() => setSelectedRecipeId(recipe.id)}
            onFavorite={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
