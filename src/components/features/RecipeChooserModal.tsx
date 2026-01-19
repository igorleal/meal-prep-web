import { Icon, Button } from '@/components/common'
import { cn } from '@/utils/cn'
import type { Recipe } from '@/types'

interface RecipeChooserModalProps {
  isOpen: boolean
  onClose: () => void
  recipes: Recipe[]
  onSelectRecipe: (recipe: Recipe) => void
  onRegenerate: () => void
  title?: string
  subtitle?: string
  isLoading?: boolean
}

interface RecipeCardProps {
  recipe: Recipe
  isBestMatch?: boolean
  onSelect: () => void
  onFavorite: () => void
}

const recipeIcons = ['skillet', 'nutrition', 'soup_kitchen', 'ramen_dining', 'lunch_dining', 'kebab_dining']
const recipeColors = [
  { bg: 'bg-orange-50 dark:bg-orange-900/20', hover: 'group-hover:bg-orange-100', icon: 'text-orange-200 dark:text-orange-800/40' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', hover: 'group-hover:bg-emerald-100', icon: 'text-emerald-200 dark:text-emerald-800/40' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', hover: 'group-hover:bg-amber-100', icon: 'text-amber-200 dark:text-amber-800/40' },
  { bg: 'bg-blue-50 dark:bg-blue-900/20', hover: 'group-hover:bg-blue-100', icon: 'text-blue-200 dark:text-blue-800/40' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', hover: 'group-hover:bg-purple-100', icon: 'text-purple-200 dark:text-purple-800/40' },
  { bg: 'bg-pink-50 dark:bg-pink-900/20', hover: 'group-hover:bg-pink-100', icon: 'text-pink-200 dark:text-pink-800/40' },
]

function RecipeCard({ recipe, isBestMatch, onSelect, onFavorite }: RecipeCardProps) {
  const colorIndex = Math.abs(recipe.id.charCodeAt(0)) % recipeColors.length
  const iconIndex = Math.abs(recipe.id.charCodeAt(1) || 0) % recipeIcons.length
  const colors = recipeColors[colorIndex]
  const icon = recipeIcons[iconIndex]

  // Get first tag/label from recipe if available
  const tag = recipe.tags?.[0] || 'Chef Pick'

  return (
    <div
      className={cn(
        'bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border flex flex-col group h-full relative',
        isBestMatch
          ? 'ring-2 ring-primary/20 border-primary/20'
          : 'border-border-light dark:border-border-dark'
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
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-text-main-light dark:text-white leading-snug">
            {recipe.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavorite()
            }}
            className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
          >
            <Icon name="favorite" size="sm" />
          </button>
        </div>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-muted-light dark:text-text-muted-dark tracking-wider">
              Calories
            </span>
            <span className="text-sm font-bold text-text-main-light dark:text-white">
              {recipe.macros.calories || 400} kcal
            </span>
          </div>
          <Button
            onClick={onSelect}
            icon="check_circle"
            iconPosition="right"
            className="flex-1"
          >
            Select This Recipe
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function RecipeChooserModal({
  isOpen,
  onClose,
  recipes,
  onSelectRecipe,
  onRegenerate,
  title = 'Your Personalized Menu',
  subtitle = 'AI suggestions based on your preferences.',
  isLoading = false,
}: RecipeChooserModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-main-light/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-background-light dark:bg-background-dark rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-white/20 ring-1 ring-black/5 animate-[zoomIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex-none px-6 py-5 lg:px-8 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Icon name="auto_awesome" size="lg" />
              </div>
              <h2 className="text-2xl font-bold text-text-main-light dark:text-white tracking-tight">
                {title}
              </h2>
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark text-sm ml-1">
              {subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Icon
              name="close"
              size="lg"
              className="text-text-muted-light dark:text-text-muted-dark group-hover:text-text-main-light dark:group-hover:text-white"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50 dark:bg-black/20">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="auto_awesome" className="text-primary animate-pulse text-4xl mb-4" />
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Generating personalized recipes...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isBestMatch={index === 0}
                  onSelect={() => onSelectRecipe(recipe)}
                  onFavorite={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none px-6 py-4 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex justify-between items-center gap-4">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark font-bold text-sm hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5 disabled:opacity-50"
          >
            <Icon name="refresh" size="sm" />
            Regenerate Options
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
              Not what you&apos;re looking for?
            </span>
            <button className="text-xs font-bold text-primary underline decoration-2 underline-offset-2 hover:text-red-700">
              Browse Full Library
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
