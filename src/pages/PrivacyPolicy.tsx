import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, SEO } from '@/components/common'

export default function PrivacyPolicy() {
  const { t } = useTranslation('legal')

  return (
    <div className="max-w-4xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
      <SEO titleKey="privacy.title" descriptionKey="privacy.description" />

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
          {t('privacy.title')}
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          {t('privacy.lastUpdated', { date: 'January 25, 2026' })}
        </p>
      </div>

      {/* GDPR Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green/10 text-accent-green rounded-full text-sm font-semibold mb-8">
        <Icon name="verified_user" size="sm" />
        {t('privacy.gdprCompliant')}
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* Intro */}
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-8">
          {t('privacy.intro')}
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            1. {t('privacy.sections.controller.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            ReceitAI<br />
            {t('privacy.sections.controller.contact')}{' '}
            <a href="mailto:igorlealhk@gmail.com" className="text-primary hover:underline">
              igorlealhk@gmail.com
            </a>
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            2. {t('privacy.sections.collection.title')}
          </h2>

          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-3">
            2.1 {t('privacy.sections.collection.account.title')}
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark mb-6">
            <li>{t('privacy.sections.collection.account.items.email')}</li>
            <li>{t('privacy.sections.collection.account.items.name')}</li>
            <li>{t('privacy.sections.collection.account.items.id')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-3">
            2.2 {t('privacy.sections.collection.provided.title')}
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark mb-6">
            <li>{t('privacy.sections.collection.provided.items.dietary')}</li>
            <li>{t('privacy.sections.collection.provided.items.preferences')}</li>
            <li>{t('privacy.sections.collection.provided.items.macros')}</li>
            <li>{t('privacy.sections.collection.provided.items.recipes')}</li>
            <li>{t('privacy.sections.collection.provided.items.language')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-3">
            2.3 {t('privacy.sections.collection.automatic.title')}
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('privacy.sections.collection.automatic.items.browser')}</li>
            <li>{t('privacy.sections.collection.automatic.items.theme')}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            3. {t('privacy.sections.legalBasis.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('privacy.sections.legalBasis.intro')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li><strong>{t('privacy.sections.legalBasis.items.contract.label')}:</strong> {t('privacy.sections.legalBasis.items.contract.desc')}</li>
            <li><strong>{t('privacy.sections.legalBasis.items.consent.label')}:</strong> {t('privacy.sections.legalBasis.items.consent.desc')}</li>
            <li><strong>{t('privacy.sections.legalBasis.items.legitimate.label')}:</strong> {t('privacy.sections.legalBasis.items.legitimate.desc')}</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            4. {t('privacy.sections.usage.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('privacy.sections.usage.items.generate')}</li>
            <li>{t('privacy.sections.usage.items.save')}</li>
            <li>{t('privacy.sections.usage.items.auth')}</li>
            <li>{t('privacy.sections.usage.items.language')}</li>
            <li>{t('privacy.sections.usage.items.improve')}</li>
          </ul>
        </section>

        {/* Section 5 - Third Party Services */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            5. {t('privacy.sections.thirdParty.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('privacy.sections.thirdParty.intro')}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm mb-4">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <th className="text-left py-3 pr-4 font-semibold text-text-main-light dark:text-white">{t('privacy.sections.thirdParty.table.service')}</th>
                  <th className="text-left py-3 pr-4 font-semibold text-text-main-light dark:text-white">{t('privacy.sections.thirdParty.table.purpose')}</th>
                  <th className="text-left py-3 font-semibold text-text-main-light dark:text-white">{t('privacy.sections.thirdParty.table.data')}</th>
                </tr>
              </thead>
              <tbody className="text-text-muted-light dark:text-text-muted-dark">
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 pr-4">Google OAuth</td>
                  <td className="py-3 pr-4">{t('privacy.sections.thirdParty.services.googleOauth.purpose')}</td>
                  <td className="py-3">{t('privacy.sections.thirdParty.services.googleOauth.data')}</td>
                </tr>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 pr-4">Apple OAuth</td>
                  <td className="py-3 pr-4">{t('privacy.sections.thirdParty.services.appleOauth.purpose')}</td>
                  <td className="py-3">{t('privacy.sections.thirdParty.services.appleOauth.data')}</td>
                </tr>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 pr-4">Google Vertex AI</td>
                  <td className="py-3 pr-4">{t('privacy.sections.thirdParty.services.vertexAi.purpose')}</td>
                  <td className="py-3">{t('privacy.sections.thirdParty.services.vertexAi.data')}</td>
                </tr>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 pr-4">Google Cloud Storage</td>
                  <td className="py-3 pr-4">{t('privacy.sections.thirdParty.services.cloudStorage.purpose')}</td>
                  <td className="py-3">{t('privacy.sections.thirdParty.services.cloudStorage.data')}</td>
                </tr>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 pr-4">Google Cloud SQL</td>
                  <td className="py-3 pr-4">{t('privacy.sections.thirdParty.services.cloudSql.purpose')}</td>
                  <td className="py-3">{t('privacy.sections.thirdParty.services.cloudSql.data')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('privacy.sections.thirdParty.location')}
          </p>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mt-2">
            {t('privacy.sections.thirdParty.euUsers')}
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            6. {t('privacy.sections.retention.title')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('privacy.sections.retention.items.active')}</li>
            <li>{t('privacy.sections.retention.items.deleted')}</li>
            <li>{t('privacy.sections.retention.items.tokens')}</li>
          </ul>
        </section>

        {/* Section 7 - GDPR Rights */}
        <section className="mb-8 p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            7. {t('privacy.sections.rights.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('privacy.sections.rights.intro')}
          </p>
          <ul className="list-none space-y-3 text-text-muted-light dark:text-text-muted-dark">
            <li className="flex items-start gap-3">
              <Icon name="visibility" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.access.label')}:</strong> {t('privacy.sections.rights.items.access.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="edit" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.rectification.label')}:</strong> {t('privacy.sections.rights.items.rectification.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="delete" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.erasure.label')}:</strong> {t('privacy.sections.rights.items.erasure.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="download" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.portability.label')}:</strong> {t('privacy.sections.rights.items.portability.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="block" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.restriction.label')}:</strong> {t('privacy.sections.rights.items.restriction.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="do_not_disturb" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.objection.label')}:</strong> {t('privacy.sections.rights.items.objection.desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="undo" className="text-primary mt-1 flex-shrink-0" size="sm" />
              <span><strong>{t('privacy.sections.rights.items.withdraw.label')}:</strong> {t('privacy.sections.rights.items.withdraw.desc')}</span>
            </li>
          </ul>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mt-4">
            {t('privacy.sections.rights.contact')}{' '}
            <a href="mailto:igorlealhk@gmail.com" className="text-primary hover:underline">
              igorlealhk@gmail.com
            </a>
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            8. {t('privacy.sections.security.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('privacy.sections.security.intro')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('privacy.sections.security.items.https')}</li>
            <li>{t('privacy.sections.security.items.jwt')}</li>
            <li>{t('privacy.sections.security.items.cloud')}</li>
            <li>{t('privacy.sections.security.items.validation')}</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            9. {t('privacy.sections.cookies.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
            {t('privacy.sections.cookies.intro')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark mb-4">
            <li>{t('privacy.sections.cookies.items.tokens')}</li>
            <li>{t('privacy.sections.cookies.items.theme')}</li>
            <li>{t('privacy.sections.cookies.items.language')}</li>
          </ul>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
            {t('privacy.sections.cookies.notUsed')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted-light dark:text-text-muted-dark">
            <li>{t('privacy.sections.cookies.notUsedItems.tracking')}</li>
            <li>{t('privacy.sections.cookies.notUsedItems.analytics')}</li>
            <li>{t('privacy.sections.cookies.notUsedItems.advertising')}</li>
            <li>{t('privacy.sections.cookies.notUsedItems.thirdParty')}</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            10. {t('privacy.sections.children.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('privacy.sections.children.content')}
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            11. {t('privacy.sections.transfers.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('privacy.sections.transfers.content')}
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            12. {t('privacy.sections.changes.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('privacy.sections.changes.content')}
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-4">
            13. {t('privacy.sections.contact.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            {t('privacy.sections.contact.content')}{' '}
            <a href="mailto:igorlealhk@gmail.com" className="text-primary hover:underline">
              igorlealhk@gmail.com
            </a>
          </p>
          <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed mt-4">
            {t('privacy.sections.contact.euComplaint')}
          </p>
        </section>

        {/* Link to Terms */}
        <section className="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('privacy.seeAlso')}{' '}
            <Link to="/terms" className="text-primary hover:underline">
              {t('terms.title')}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
