import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, LoadingSpinner, IngredientConversionModal, MarkdownText } from '@/components/common'
import { getRecipeImageUrl } from '@/utils/placeholders'
import { parseInstructions } from '@/utils/recipe'
import { useRecipeImagePolling, useFormatUnit } from '@/hooks'
import type { Recipe, RecipeIngredient } from '@/types'

type ImageType = 'mealPlan' | 'familyMeal' | 'specialMeal'

interface RecipeDetailModalProps {
  recipe: Recipe
  imageType?: ImageType
  onClose: () => void
  onImageLoaded?: (updatedRecipe: Recipe) => void
}

export function RecipeDetailModal({
  recipe,
  imageType = 'mealPlan',
  onClose,
  onImageLoaded,
}: RecipeDetailModalProps) {
  const { t } = useTranslation('common')
  const { formatUnit } = useFormatUnit()
  const [conversionIngredient, setConversionIngredient] = useState<RecipeIngredient | null>(null)
  const { imageUrl, isPolling } = useRecipeImagePolling({
    recipe,
    onImageLoaded,
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-surface-light dark:bg-background-dark w-full max-w-4xl max-h-[90vh] rounded-3xl border border-gray-200 dark:border-[#393028] shadow-2xl overflow-hidden flex flex-col">
        {/* Hero image with title overlay */}
        <div className="relative h-72 md:h-96 shrink-0">
          {isPolling ? (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center gap-3">
              <LoadingSpinner size="lg" />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
                {t('recipe.generatingImage')}
              </span>
            </div>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${getRecipeImageUrl(imageUrl, imageType)}")`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-light dark:from-background-dark via-surface-light/60 dark:via-background-dark/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
          >
            <Icon name="close" />
          </button>

          {/* Title and servings overlaid on image */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-main-light dark:text-white tracking-tight leading-tight mb-4">
              {recipe.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex h-9 items-center gap-x-2 rounded-lg bg-gray-800/80 dark:bg-surface-dark-highlight/80 backdrop-blur-sm px-4 border border-gray-700 dark:border-white/10">
                <Icon name="group" className="text-primary text-[20px]" />
                <span className="text-white text-sm font-semibold">
                  {recipe.servings} {t('recipe.servings')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left column - Nutrition & Tags */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Nutrition Facts */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-main-light dark:text-white text-xl font-bold">{t('recipe.nutritionFacts')}</h3>
                  <span className="text-xs text-text-muted-light dark:text-[#baab9c]">{t('recipe.perServing')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-[#393028]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-2 rounded-full bg-blue-500"></span>
                      <p className="text-text-muted-light dark:text-[#baab9c] text-sm font-medium">{t('recipe.protein')}</p>
                    </div>
                    <p className="text-text-main-light dark:text-white text-2xl font-bold">{recipe.macros.protein || '-'}g</p>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-[#393028]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-2 rounded-full bg-yellow-500"></span>
                      <p className="text-text-muted-light dark:text-[#baab9c] text-sm font-medium">{t('recipe.carbs')}</p>
                    </div>
                    <p className="text-text-main-light dark:text-white text-2xl font-bold">{recipe.macros.carbs || '-'}g</p>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-[#393028]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-2 rounded-full bg-red-500"></span>
                      <p className="text-text-muted-light dark:text-[#baab9c] text-sm font-medium">{t('recipe.fat')}</p>
                    </div>
                    <p className="text-text-main-light dark:text-white text-2xl font-bold">{recipe.macros.fats || '-'}g</p>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-[#393028]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-2 rounded-full bg-primary"></span>
                      <p className="text-text-muted-light dark:text-[#baab9c] text-sm font-medium">{t('recipe.calories')}</p>
                    </div>
                    <p className="text-text-main-light dark:text-white text-2xl font-bold">{recipe.macros.calories || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-text-main-light dark:text-white text-xl font-bold">{t('recipe.tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-[#393028] text-text-muted-light dark:text-[#baab9c] text-sm hover:text-primary hover:border-primary dark:hover:text-primary dark:hover:border-primary transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Ingredients & Preparation */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Ingredients */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#393028] pb-4">
                  <h3 className="text-text-main-light dark:text-white text-2xl font-bold">{t('recipe.ingredients')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="group relative flex items-center p-3 rounded-xl bg-gray-50 dark:bg-surface-dark/40 border border-gray-200 dark:border-[#393028] hover:border-primary/50 transition-colors"
                    >
                      <span className="text-text-main-light dark:text-white font-medium flex-1 pr-10">
                        {ing.quantity} {formatUnit(ing.unit)} {ing.name}
                      </span>
                      <button
                        onClick={() => setConversionIngredient(ing)}
                        className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-primary/20 hover:bg-primary/40 p-1.5 rounded-lg text-primary"
                        title={t('recipe.convertUnits')}
                      >
                        <Icon name="auto_fix_high" className="text-[18px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparation */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#393028] pb-4">
                  <h3 className="text-text-main-light dark:text-white text-2xl font-bold">{t('recipe.preparation')}</h3>
                </div>
                <div className="flex flex-col gap-0 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-gray-200 dark:bg-[#393028]"></div>

                  {parseInstructions(recipe.instructions).map((step, i, steps) => (
                    <div key={i} className={`flex gap-6 ${i < steps.length - 1 ? 'pb-10' : ''} relative`}>
                      <div className="shrink-0 size-10 rounded-full bg-primary shadow-lg flex items-center justify-center text-white font-bold text-lg z-10 border-4 border-surface-light dark:border-background-dark">
                        {i + 1}
                      </div>
                      <div className="flex flex-col gap-3 pt-1">
                        <MarkdownText className="text-text-muted-light dark:text-[#baab9c] leading-relaxed">
                          {step}
                        </MarkdownText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
