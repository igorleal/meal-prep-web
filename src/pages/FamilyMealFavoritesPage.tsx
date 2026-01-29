import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button, LoadingSpinner } from '@/components/common'
import { favoriteService } from '@/api/services'
import { cn } from '@/utils/cn'
import { getRecipeImageUrl } from '@/utils/placeholders'
import type { Recipe } from '@/types'

export default function FamilyMealFavoritesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Verify we have pending request data
  useEffect(() => {
    const pendingRequest = sessionStorage.getItem('pendingFamilyMealRequest')
    if (!pendingRequest) {
      navigate('/calendar')
    }
  }, [navigate])

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
  })

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites
    const query = searchQuery.toLowerCase()
    return favorites.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
    )
  }, [favorites, searchQuery])

  const handleSelect = () => {
    if (selectedRecipe) {
      sessionStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe))
      sessionStorage.setItem('recipeSource', 'favorite')
      navigate('/calendar/recipes?source=favorite')
    }
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          <span className="text-primary font-bold">{t('steps.step')} 3</span>
          <span>/</span>
          <span>3</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Icon name="favorite" className="text-primary text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white">
                {t('favoritePicker.title')}
              </h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                {t('favoritePicker.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('favoritePicker.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Icon name="favorite_border" className="text-3xl text-text-muted-light dark:text-text-muted-dark" />
            </div>
            <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
              {t('favoritePicker.empty.title')}
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark max-w-sm">
              {t('favoritePicker.empty.description')}
            </p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Icon name="search_off" className="text-3xl text-text-muted-light dark:text-text-muted-dark" />
            </div>
            <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
              {t('labels.noResults')}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={cn(
                  'relative flex flex-col overflow-hidden rounded-xl text-left transition-all',
                  'bg-surface-light dark:bg-surface-dark',
                  'border-2',
                  selectedRecipe?.id === recipe.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border-light dark:border-border-dark hover:border-primary/50'
                )}
              >
                {/* Image */}
                <div className="relative h-32 w-full overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'familyMeal')}")`,
                    }}
                  />
                  {selectedRecipe?.id === recipe.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Icon name="check" className="text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 className="font-bold text-text-main-light dark:text-white line-clamp-1 mb-1">
                    {recipe.name}
                  </h4>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-2">
                    {recipe.description}
                  </p>
                  {/* Macros */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <span>{recipe.macros.calories} kcal</span>
                    <span className="text-primary font-medium">{recipe.macros.protein}g protein</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-between items-center gap-4 h-full">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => navigate('/calendar/source')}
          >
            {t('buttons.back')}
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedRecipe}
            icon="check"
            className="shadow-lg shadow-primary/20"
          >
            {t('favoritePicker.selectButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
