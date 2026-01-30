import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://receitai.app'
const SUPPORTED_LANGUAGES = ['en', 'pt', 'sv']
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

interface SEOProps {
  titleKey?: string
  descriptionKey?: string
  image?: string
  noindex?: boolean
}

export function SEO({
  titleKey = 'home.title',
  descriptionKey = 'home.description',
  image = DEFAULT_OG_IMAGE,
  noindex = false,
}: SEOProps) {
  const { t, i18n } = useTranslation('seo')
  const location = useLocation()
  const currentLang = i18n.language

  const title = t(titleKey)
  const description = t(descriptionKey)
  const canonicalUrl = `${SITE_URL}${location.pathname}`

  return (
    <Helmet>
      {/* Language */}
      <html lang={currentLang} />

      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang tags for language alternatives */}
      {SUPPORTED_LANGUAGES.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${SITE_URL}${location.pathname}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${location.pathname}`} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ReceitAI" />
      <meta property="og:locale" content={currentLang} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
