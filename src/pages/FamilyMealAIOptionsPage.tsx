import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from '@/components/common'
import { AIOptionsForm, type AIOptionsFormData } from '@/components/features'

export default function FamilyMealAIOptionsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('familyCalendar')
  const { t: tCommon } = useTranslation('common')

  // AI form state
  const [aiFormData, setAiFormData] = useState<AIOptionsFormData>({
    restrictions: [],
    mustHaves: [],
    exclusions: [],
  })

  // Verify we have pending request data
  useEffect(() => {
    const pendingRequest = sessionStorage.getItem('pendingFamilyMealRequest')
    if (!pendingRequest) {
      navigate('/calendar')
    }
  }, [navigate])

  const handleSubmit = () => {
    // Get existing pending request data
    const pendingRequestStr = sessionStorage.getItem('pendingFamilyMealRequest')
    if (!pendingRequestStr) {
      navigate('/calendar')
      return
    }

    const pendingData = JSON.parse(pendingRequestStr)

    // Build the full request with AI options
    const request = {
      date: pendingData.date,
      restrictions: aiFormData.restrictions,
      mustHaves: aiFormData.mustHaves,
      exclusions: aiFormData.exclusions,
    }

    // Update session storage with full request
    sessionStorage.setItem(
      'pendingFamilyMealRequest',
      JSON.stringify({
        date: pendingData.date,
        mealType: pendingData.mealType,
        restrictions: aiFormData.restrictions,
        mustHaves: aiFormData.mustHaves,
        exclusions: aiFormData.exclusions,
        request,
      })
    )

    // Navigate to recipe selection page
    navigate('/calendar/recipes')
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          <span className="text-primary font-bold">{tCommon('steps.step')} 3</span>
          <span>/</span>
          <span>3</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Icon name="auto_awesome" className="text-primary text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white">
                {tCommon('recipeSource.ai.title')}
              </h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                {t('source.aiOptionsSubtitle', 'Customize your AI-generated recipes')}
              </p>
            </div>
          </div>
        </div>

        {/* AI Options Form */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6">
          <AIOptionsForm
            planType="familyPlan"
            data={aiFormData}
            onChange={setAiFormData}
          />
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-between items-center gap-4 h-full">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => navigate('/calendar/source')}
          >
            {tCommon('buttons.back')}
          </Button>
          <Button
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleSubmit}
            className="shadow-lg shadow-primary/20"
          >
            {t('create.nextButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
