import { Icon, LoadingSpinner } from '@/components/common'
import { cn } from '@/utils/cn'
import { getRecipeImageUrl } from '@/utils/placeholders'
import { useRecipeImagePolling } from '@/hooks'
import type { Recipe } from '@/types'

type ImageType = 'mealPlan' | 'familyMeal' | 'specialMeal'

interface RecipeCardProps {
  recipe: Recipe
  isSelected: boolean
  isFavorite?: boolean
  imageType?: ImageType
  onSelect: () => void
  onViewDetails: () => void
  onFavorite?: () => void
  onImageLoaded?: (updatedRecipe: Recipe) => void
}

export function RecipeCard({
  recipe,
  isSelected,
  isFavorite = false,
  imageType = 'mealPlan',
  onSelect,
  onViewDetails,
  onFavorite,
  onImageLoaded,
}: RecipeCardProps) {
  const { imageUrl, isPolling } = useRecipeImagePolling({
    recipe,
    onImageLoaded,
  })

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-surface-light dark:bg-surface-dark',
        'shadow-xl shadow-black/5 dark:shadow-black/40',
        'transition-all hover:-translate-y-2 hover:shadow-2xl',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary z-30" />

      {/* Image section */}
      <div
        className="relative h-48 md:h-64 w-full overflow-hidden cursor-pointer"
        onClick={onViewDetails}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {isPolling ? (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
              Generating image...
            </span>
          </div>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage: `url("${getRecipeImageUrl(imageUrl, imageType)}")`,
            }}
          />
        )}

        {/* Favorite button */}
        {onFavorite && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite()
              }}
              className={cn(
                "size-10 rounded-full backdrop-blur-md transition-all flex items-center justify-center",
                isFavorite
                  ? "bg-primary text-white hover:bg-primary/80"
                  : "bg-white/20 text-white hover:bg-white hover:text-primary"
              )}
            >
              <Icon name={isFavorite ? "favorite" : "favorite_border"} className="text-[20px]" />
            </button>
          </div>
        )}
      </div>

      {/* Content section */}
      <div
        className="flex flex-1 flex-col p-4 md:p-8 pt-4 md:pt-6 cursor-pointer"
        onClick={onViewDetails}
      >
        <h3 className="mb-2 md:mb-3 text-xl md:text-2xl font-black text-text-main-light dark:text-white leading-tight">
          {recipe.name}
        </h3>
        <p className="mb-4 md:mb-6 text-sm md:text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-2">
          {recipe.description}
        </p>

        {/* Keywords */}
        {recipe.keywords && recipe.keywords.length > 0 && (
          <div className="mb-4 md:mb-8 flex flex-wrap gap-2">
            {recipe.keywords.map((keyword, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg bg-primary/5 border border-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Macros and button */}
        <div className="mt-auto">
          {/* Macros grid */}
          <div className="mb-4 md:mb-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 md:divide-x divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10 bg-background-light dark:bg-white/5 py-3 md:py-4">
            <div className="text-center px-1">
              <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-1">
                Cal
              </span>
              <span className="block text-lg font-black text-text-main-light dark:text-white">
                {recipe.macros.calories || '-'}
              </span>
            </div>
            <div className="text-center px-1">
              <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-1">
                Pro
              </span>
              <span className="block text-lg font-black text-primary">
                {recipe.macros.protein || '-'}g
              </span>
            </div>
            <div className="text-center px-1">
              <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-1">
                Carb
              </span>
              <span className="block text-lg font-black text-text-main-light dark:text-white">
                {recipe.macros.carbs || '-'}g
              </span>
            </div>
            <div className="text-center px-1">
              <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-1">
                Fat
              </span>
              <span className="block text-lg font-black text-text-main-light dark:text-white">
                {recipe.macros.fats || '-'}g
              </span>
            </div>
          </div>

          {/* Select button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className={cn(
              'w-full rounded-xl py-4 text-base font-black transition-all',
              isSelected
                ? 'bg-primary/10 text-primary border-2 border-primary'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg shadow-primary/30'
            )}
          >
            {isSelected ? 'Selected' : 'Select This Recipe'}
          </button>
        </div>
      </div>
    </article>
  )
}
