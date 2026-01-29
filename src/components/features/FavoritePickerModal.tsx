import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Icon, Button, LoadingSpinner } from '@/components/common'
import { favoriteService } from '@/api/services'
import { cn } from '@/utils/cn'
import { getRecipeImageUrl } from '@/utils/placeholders'
import type { Recipe } from '@/types'

interface FavoritePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (recipe: Recipe) => void
}

export function FavoritePickerModal({
  isOpen,
  onClose,
  onSelect,
}: FavoritePickerModalProps) {
  const { t } = useTranslation('common')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteService.getFavorites,
    enabled: isOpen,
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
      onSelect(selectedRecipe)
      handleClose()
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setSelectedRecipe(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl animate-[zoomIn_0.2s_ease-out] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="favorite" className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main-light dark:text-white">
                {t('favoritePicker.title')}
              </h2>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {t('favoritePicker.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Icon name="close" className="text-text-muted-light dark:text-text-muted-dark" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <Icon name="search_off" className="text-3xl text-text-muted-light dark:text-text-muted-dark" />
              </div>
              <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
                No Results
              </h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                No recipes match your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={cn(
                    'relative flex flex-col overflow-hidden rounded-xl text-left transition-all',
                    'bg-background-light dark:bg-background-dark',
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
                        backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'mealPlan')}")`,
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

        {/* Footer */}
        <div className="p-4 border-t border-border-light dark:border-border-dark flex-shrink-0">
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!selectedRecipe}
              icon="check"
            >
              {t('favoritePicker.selectButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
