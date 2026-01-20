import { Icon } from '@/components/common'
import { cn } from '@/utils/cn'
import type { Recipe } from '@/types'

interface RecipeCardProps {
  recipe: Recipe
  isSelected: boolean
  isFavorite?: boolean
  onSelect: () => void
  onViewDetails: () => void
  onFavorite?: () => void
}

export function RecipeCard({
  recipe,
  isSelected,
  isFavorite = false,
  onSelect,
  onViewDetails,
  onFavorite,
}: RecipeCardProps) {
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
        className="relative h-64 w-full overflow-hidden cursor-pointer"
        onClick={onViewDetails}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop")`,
          }}
        />

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
        className="flex flex-1 flex-col p-8 pt-6 cursor-pointer"
        onClick={onViewDetails}
      >
        <h3 className="mb-3 text-2xl font-black text-text-main-light dark:text-white leading-tight">
          {recipe.name}
        </h3>
        <p className="mb-6 text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-2">
          {recipe.description}
        </p>

        {/* Keywords */}
        {recipe.keywords && recipe.keywords.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
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
          <div className="mb-6 grid grid-cols-4 divide-x divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10 bg-background-light dark:bg-white/5 py-4">
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
