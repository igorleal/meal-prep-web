import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Badge, Icon, LoadingOverlay } from '@/components/common'
import { foodFriendsService } from '@/api/services'
import { cn } from '@/utils/cn'
import type { Recipe } from '@/types'

interface PendingSpecialMeal {
  name: string
  recipes: Recipe[]
  restrictions: string[]
  mustHaves: string[]
  exclusions: string[]
}

const recipeIcons = ['skillet', 'nutrition', 'soup_kitchen', 'ramen_dining', 'lunch_dining', 'kebab_dining']
const recipeColors = [
  { bg: 'bg-orange-50 dark:bg-orange-900/20', hover: 'group-hover:bg-orange-100', icon: 'text-orange-200 dark:text-orange-800/40' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', hover: 'group-hover:bg-emerald-100', icon: 'text-emerald-200 dark:text-emerald-800/40' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', hover: 'group-hover:bg-amber-100', icon: 'text-amber-200 dark:text-amber-800/40' },
]

function RecipeCard({
  recipe,
  isSelected,
  isBestMatch,
  onSelect,
  onFavorite,
  colorIndex,
}: {
  recipe: Recipe
  isSelected: boolean
  isBestMatch: boolean
  onSelect: () => void
  onFavorite: () => void
  colorIndex: number
}) {
  const colors = recipeColors[colorIndex % recipeColors.length]
  const icon = recipeIcons[colorIndex % recipeIcons.length]
  const tag = recipe.tags?.[0] || 'Chef Pick'

  return (
    <Card
      padding="none"
      hover
      className={cn(
        'overflow-hidden relative flex flex-col h-full group',
        isSelected && 'ring-2 ring-primary',
        isBestMatch && !isSelected && 'ring-2 ring-primary/20'
      )}
    >
      {/* Best Match Badge */}
      {isBestMatch && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md z-10 border-2 border-surface-light dark:border-surface-dark">
          Best Match 98%
        </div>
      )}

      {/* Image/Icon area */}
      <div className={cn('h-48 relative overflow-hidden transition-colors', colors.bg, colors.hover)}>
        <div className={cn('absolute inset-0 flex items-center justify-center', colors.icon)}>
          <Icon name={icon} className="text-[80px]" />
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Icon name="favorite" size="sm" className="text-gray-400 hover:text-red-500" />
        </button>

        {/* Tag */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/90 dark:bg-black/60 backdrop-blur text-text-main-light dark:text-white text-[10px] font-bold uppercase rounded-md shadow-sm border border-black/5">
            {tag}
          </span>
        </div>

        {/* Cook time */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-text-main-light dark:text-white flex items-center gap-1.5 shadow-sm border border-black/5">
          <Icon name="timer" size="sm" className="text-primary" />
          {recipe.cookTime || '30m'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
          {recipe.name}
        </h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

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
          className="w-full mt-auto"
          onClick={onSelect}
          icon={isSelected ? 'check_circle' : undefined}
        >
          {isSelected ? 'Selected' : 'Select This Recipe'}
        </Button>
      </div>
    </Card>
  )
}

export default function SpecialMealRecipeSelectionPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingMeal, setPendingMeal] = useState<PendingSpecialMeal | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingSpecialMeal')
    if (stored) {
      setPendingMeal(JSON.parse(stored))
    } else {
      navigate('/special-meals')
    }
  }, [navigate])

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
      queryClient.invalidateQueries({ queryKey: ['foodFriends'] })
      navigate('/special-meals')
    },
  })

  if (!pendingMeal) {
    return <LoadingOverlay message="Loading recipes..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white">
              Choose Your Menu
            </h1>
            <Badge variant="primary" icon="auto_awesome">
              AI
            </Badge>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            AI suggestions for <strong className="text-text-main-light dark:text-white">&quot;{pendingMeal.name}&quot;</strong> based on your guest preferences.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon="arrow_back"
            iconPosition="left"
            onClick={() => navigate('/special-meals/create')}
          >
            Back to Details
          </Button>
          <Button
            icon="check"
            iconPosition="left"
            disabled={!selectedRecipeId}
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            Confirm & Save Event
          </Button>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingMeal.recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipeId === recipe.id}
            isBestMatch={index === 0}
            onSelect={() => setSelectedRecipeId(recipe.id)}
            onFavorite={() => {}}
            colorIndex={index}
          />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-light dark:border-border-dark">
        <Button
          variant="ghost"
          icon="refresh"
          iconPosition="left"
          onClick={() => navigate('/special-meals/create')}
        >
          Regenerate Options
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Not what you&apos;re looking for?
          </span>
          <button className="text-sm font-bold text-primary underline decoration-2 underline-offset-2 hover:text-red-700">
            Browse Full Library
          </button>
        </div>
      </div>
    </div>
  )
}
