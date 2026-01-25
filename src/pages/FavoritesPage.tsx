import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, LoadingOverlay, MobileCarousel } from '@/components/common'
import { favoriteService } from '@/api/services'
import { getRecipeImageUrl } from '@/utils/placeholders'
import type { Recipe } from '@/types'

function FavoriteRecipeCard({
  recipe,
  onUnfavorite,
  onViewDetails,
}: {
  recipe: Recipe
  onUnfavorite: () => void
  onViewDetails: () => void
}) {
  const { t } = useTranslation('favorites')
  const { t: tCommon } = useTranslation('common')

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xl shadow-black/5 dark:shadow-black/40 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onClick={onViewDetails}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary z-30" />

      {/* Image section */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'mealPlan')}")`,
          }}
        />

        {/* Unfavorite button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUnfavorite()
            }}
            className="size-10 rounded-full bg-primary text-white backdrop-blur-md transition-all hover:bg-red-500 flex items-center justify-center"
            title={t('card.removeFromFavorites')}
          >
            <Icon name="favorite" className="text-[20px]" />
          </button>
        </div>

        {/* Servings badge */}
        <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 text-white text-sm font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          <Icon name="restaurant" className="text-[18px]" />
          {tCommon('units.servings', { count: recipe.servings })}
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-black text-text-main-light dark:text-white leading-tight">
          {recipe.name}
        </h3>
        <p className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-2">
          {recipe.description}
        </p>

        {/* Keywords */}
        {recipe.keywords && recipe.keywords.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {recipe.keywords.slice(0, 3).map((keyword, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg bg-primary/5 border border-primary/10 px-2 py-1 text-xs font-bold text-primary"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Macros */}
        <div className="mt-auto grid grid-cols-4 divide-x divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10 bg-background-light dark:bg-white/5 py-3">
          <div className="text-center px-1">
            <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-0.5">
              {tCommon('macros.cal')}
            </span>
            <span className="block text-base font-black text-text-main-light dark:text-white">
              {recipe.macros.calories || '-'}
            </span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-0.5">
              {tCommon('macros.pro')}
            </span>
            <span className="block text-base font-black text-primary">
              {recipe.macros.protein || '-'}g
            </span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-0.5">
              {tCommon('macros.carb')}
            </span>
            <span className="block text-base font-black text-text-main-light dark:text-white">
              {recipe.macros.carbs || '-'}g
            </span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[10px] uppercase text-text-muted-light dark:text-text-muted-dark font-black tracking-widest mb-0.5">
              {tCommon('macros.fat')}
            </span>
            <span className="block text-base font-black text-text-main-light dark:text-white">
              {recipe.macros.fats || '-'}g
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FavoritesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('favorites')

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
  })

  const unfavoriteMutation = useMutation({
    mutationFn: favoriteService.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon name="favorite" className="text-primary" size="lg" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white">
              {t('page.title')}
            </h1>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('page.subtitle')}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingOverlay message={t('loading')} />
      ) : favorites.length > 0 ? (
        <>
          {/* Mobile carousel */}
          <div className="md:hidden">
            <MobileCarousel
              items={favorites}
              keyExtractor={(recipe) => recipe.id}
              renderItem={(recipe) => (
                <FavoriteRecipeCard
                  recipe={recipe}
                  onUnfavorite={() => unfavoriteMutation.mutate(recipe.id)}
                  onViewDetails={() => {
                    sessionStorage.setItem('viewingFavoriteRecipe', JSON.stringify(recipe))
                    navigate('/favorites/recipe')
                  }}
                />
              )}
            />
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <FavoriteRecipeCard
                key={recipe.id}
                recipe={recipe}
                onUnfavorite={() => unfavoriteMutation.mutate(recipe.id)}
                onViewDetails={() => {
                  sessionStorage.setItem('viewingFavoriteRecipe', JSON.stringify(recipe))
                  navigate('/favorites/recipe')
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Icon
            name="favorite_border"
            className="text-gray-300 dark:text-gray-600 mb-4"
            size="xl"
          />
          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-2">
            {t('empty.title')}
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {t('empty.description')}
          </p>
          <Button onClick={() => navigate('/meal-plans')}>
            {t('empty.button')}
          </Button>
        </div>
      )}
    </div>
  )
}
