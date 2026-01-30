import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, SEO } from '@/components/common'

export default function TermsOfService() {
  const { t } = useTranslation('legal')

  return (
    <div className="max-w-4xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
      <SEO titleKey="terms.title" descriptionKey="terms.description" />

      {/* Back link */}
      <Link
        to="/settings"
        className="inline-flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary mb-8 transition-colors"
      >
        <Icon name="arrow_back" size="sm" />
        <span>{t('back')}</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-3">
          {t('terms.title')}
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          {t('terms.lastUpdated', { date: 'January 25, 2026' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            1. {t('terms.sections.about.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.about.content')}
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            2. {t('terms.sections.acceptance.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.acceptance.content')}
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            3. {t('terms.sections.account.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.account.items.oauth')}</li>
            <li>{t('terms.sections.account.items.age')}</li>
            <li>{t('terms.sections.account.items.security')}</li>
            <li>{t('terms.sections.account.items.accuracy')}</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            4. {t('terms.sections.service.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('terms.sections.service.intro')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.service.items.recipes')}</li>
            <li>{t('terms.sections.service.items.mealPlanning')}</li>
            <li>{t('terms.sections.service.items.saving')}</li>
            <li>{t('terms.sections.service.items.conversion')}</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            5. {t('terms.sections.limits.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.limits.items.freeTier')}</li>
            <li>{t('terms.sections.limits.items.maxRecipes')}</li>
            <li>{t('terms.sections.limits.items.reset')}</li>
          </ul>
        </section>

        {/* Section 6 - AI Disclaimer */}
        <section className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4">
            6. {t('terms.sections.aiDisclaimer.title')}
          </h2>
          <p className="text-amber-700 dark:text-amber-300 font-medium mb-4">
            {t('terms.sections.aiDisclaimer.important')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-amber-700 dark:text-amber-300">
            <li>{t('terms.sections.aiDisclaimer.items.accuracy')}</li>
            <li>{t('terms.sections.aiDisclaimer.items.allergies')}</li>
            <li>{t('terms.sections.aiDisclaimer.items.verify')}</li>
            <li>{t('terms.sections.aiDisclaimer.items.risk')}</li>
            <li>{t('terms.sections.aiDisclaimer.items.liability')}</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            7. {t('terms.sections.responsibilities.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('terms.sections.responsibilities.intro')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.responsibilities.items.accurate')}</li>
            <li>{t('terms.sections.responsibilities.items.verify')}</li>
            <li>{t('terms.sections.responsibilities.items.medical')}</li>
            <li>{t('terms.sections.responsibilities.items.misuse')}</li>
            <li>{t('terms.sections.responsibilities.items.limits')}</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            8. {t('terms.sections.ip.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.ip.items.personal')}</li>
            <li>{t('terms.sections.ip.items.share')}</li>
            <li>{t('terms.sections.ip.items.ownership')}</li>
            <li>{t('terms.sections.ip.items.copy')}</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            9. {t('terms.sections.availability.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.availability.items.asIs')}</li>
            <li>{t('terms.sections.availability.items.uptime')}</li>
            <li>{t('terms.sections.availability.items.modify')}</li>
            <li>{t('terms.sections.availability.items.notify')}</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            10. {t('terms.sections.termination.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('terms.sections.termination.items.delete')}</li>
            <li>{t('terms.sections.termination.items.violate')}</li>
            <li>{t('terms.sections.termination.items.data')}</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            11. {t('terms.sections.liability.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.liability.content')}
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            12. {t('terms.sections.changes.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.changes.content')}
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            13. {t('terms.sections.governing.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.governing.content')}
          </p>
        </section>

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            14. {t('terms.sections.contact.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('terms.sections.contact.content')}{' '}
            <a href="mailto:igorlealhk@gmail.com" className="text-primary hover:underline">
              igorlealhk@gmail.com
            </a>
          </p>
        </section>

        {/* Link to Privacy Policy */}
        <section className="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('terms.seeAlso')}{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              {t('privacy.title')}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
