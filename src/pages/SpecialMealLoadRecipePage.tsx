import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Icon, Button, WeeklyLimitBanner } from '@/components/common'
import { recipeService, userService } from '@/api/services'
import type { LoadRecipeRequestType } from '@/types'

const MAX_CONTENT_LENGTH = 8000
const MAX_URL_LENGTH = 2048
const URL_REGEX = /^https?:\/\/.+/i
const INSTAGRAM_REGEX = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i
const YOUTUBE_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i

const isSocialMediaUrl = (url: string): boolean => {
  const trimmed = url.trim()
  return INSTAGRAM_REGEX.test(trimmed) || YOUTUBE_REGEX.test(trimmed)
}

export default function SpecialMealLoadRecipePage() {
  const navigate = useNavigate()
  const { t } = useTranslation('favorites')
  const { t: tCommon } = useTranslation('common')

  const [activeTab, setActiveTab] = useState<LoadRecipeRequestType>('TEXT')
  const [content, setContent] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const hasReachedWeeklyLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Verify we have pending request data
  useEffect(() => {
    const pendingRequest = sessionStorage.getItem('pendingSpecialMealRequest')
    if (!pendingRequest) {
      navigate('/special-meals/create')
    }
  }, [navigate])

  const loadMutation = useMutation({
    mutationFn: recipeService.loadRecipe,
    onSuccess: (recipe) => {
      sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe))
      sessionStorage.setItem('recipeSource', 'loaded')
      navigate('/special-meals/recipes?source=loaded')
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      if (error.response?.status === 429) {
        setError(t('loadRecipe.quotaExceeded'))
      } else if (error.response?.status === 400) {
        setError(t('loadRecipe.urlInvalid'))
      } else if (error.response?.status === 403) {
        setError(t('loadRecipe.urlBlocked'))
      } else if (error.response?.status === 504) {
        setError(t('loadRecipe.urlTimeout'))
      } else if (error.response?.status === 422) {
        setError(activeTab === 'URL' ? t('loadRecipe.urlNoContent') : t('loadRecipe.error'))
      } else if (error.response?.status === 503) {
        setError(t('loadRecipe.urlNotConfigured'))
      } else {
        setError(t('loadRecipe.error'))
      }
    },
  })

  const isValidUrl = (url: string): boolean => {
    return URL_REGEX.test(url.trim()) && url.trim().length <= MAX_URL_LENGTH
  }

  const handleSubmit = () => {
    if (hasReachedWeeklyLimit) return
    setError(null)

    if (activeTab === 'URL') {
      const trimmedUrl = urlInput.trim()
      if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
        setError(t('loadRecipe.urlInvalid'))
        return
      }
      if (isSocialMediaUrl(trimmedUrl)) {
        setError(t('loadRecipe.urlSocialMediaNotSupported'))
        return
      }
      loadMutation.mutate({ type: 'URL', content: trimmedUrl })
    } else {
      if (!content.trim()) return
      loadMutation.mutate({ type: 'TEXT', content: content.trim() })
    }
  }

  const isLoading = loadMutation.isPending
  const canSubmit = activeTab === 'URL'
    ? (urlInput.trim().length > 0 && isValidUrl(urlInput) && !isSocialMediaUrl(urlInput) && !hasReachedWeeklyLimit && !isLoading)
    : (content.trim().length > 0 && !hasReachedWeeklyLimit && !isLoading)

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          <span className="text-primary font-bold">{tCommon('steps.step')} 3</span>
          <span>/</span>
          <span>3</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Icon name="upload" className="text-primary text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white">
                {t('loadRecipe.title')}
              </h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                {tCommon('recipeSource.loaded.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Limit Banner */}
        {hasReachedWeeklyLimit && <WeeklyLimitBanner />}

        {/* Form Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('TEXT')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'TEXT'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <Icon name="content_paste" className="mr-2 text-base align-middle" />
              {t('loadRecipe.textTab')}
            </button>
            <button
              onClick={() => setActiveTab('URL')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'URL'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <Icon name="link" className="mr-2 text-base align-middle" />
              {t('loadRecipe.urlTab')}
            </button>
          </div>

          {/* Text Area */}
          {activeTab === 'TEXT' && (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                placeholder={t('loadRecipe.textPlaceholder')}
                disabled={isLoading || hasReachedWeeklyLimit}
                className="w-full h-56 p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 resize-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${
                  content.length >= MAX_CONTENT_LENGTH
                    ? 'text-red-500'
                    : 'text-text-muted-light dark:text-text-muted-dark'
                }`}>
                  {t('loadRecipe.characterCount', { count: content.length, max: MAX_CONTENT_LENGTH })}
                </span>
              </div>
            </div>
          )}

          {/* URL Input */}
          {activeTab === 'URL' && (
            <div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value.slice(0, MAX_URL_LENGTH))}
                placeholder={t('loadRecipe.urlPlaceholder')}
                disabled={isLoading || hasReachedWeeklyLimit}
                className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark flex items-center gap-2">
                <Icon name="info" className="text-base" />
                {t('loadRecipe.urlSupportedSites')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <Icon name="error" className="text-base" />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-between items-center gap-4 h-full">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => navigate('/special-meals/source')}
          >
            {tCommon('buttons.back')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            icon={isLoading ? undefined : 'check'}
            className="shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Icon name="hourglass_empty" className="animate-spin" />
                {t('loadRecipe.loading')}
              </span>
            ) : (
              t('loadRecipe.loadButton')
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
