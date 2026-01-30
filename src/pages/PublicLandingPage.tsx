import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, LanguageSelector, SEO, JsonLd } from '@/components/common'
import { LoginModal } from '@/components/common/LoginModal'

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ReceitAI',
  url: 'https://receitai.app',
  logo: 'https://receitai.app/favicon.png',
  sameAs: [],
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ReceitAI',
  url: 'https://receitai.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://receitai.app/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ReceitAI',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'AI-powered meal planning and recipe generator. Create personalized meal plans based on your preferences and dietary restrictions.',
}

export default function PublicLandingPage() {
  const { t } = useTranslation('landing')
  const { t: tNav } = useTranslation('navigation')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative flex w-full flex-col overflow-x-hidden">
      <SEO titleKey="home.title" descriptionKey="home.description" />
      <JsonLd data={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, SOFTWARE_APPLICATION_SCHEMA]} />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-20 lg:px-40 py-4">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex items-center justify-center rounded-xl size-10">
              <Icon name="restaurant_menu" className="text-primary" />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">ReceitAI</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                href="#features"
                onClick={scrollToFeatures}
              >
                {tNav('header.features')}
              </a>
            </nav>
            <LanguageSelector variant="dark" />
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all"
            >
              <span>{tNav('header.login')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <div className="px-6 md:px-20 lg:px-40 flex flex-1 justify-center py-12 md:py-24">
          <div className="flex flex-col max-w-[1200px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-0">
                <div
                  className="flex min-h-[600px] flex-col gap-8 bg-cover bg-center bg-no-repeat rounded-2xl items-center justify-center p-6 text-center border border-white/5 shadow-2xl overflow-hidden relative"
                  style={{
                    backgroundImage: `linear-gradient(rgba(34, 21, 16, 0.7) 0%, rgba(34, 21, 16, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGc6s5Pe5GwBUgkomOW0m72phf_NPgLg05JGdi7AQSo9XRuGVZuuOA42ml90zQxFdmfz6dyDPAk5sj80zYLjEdCPIZtm48Y7vQsW6g26k1M_ydu9PYz5tXiFu7rGQdGNXHofTSANnQBmZopjtTmEwc18bsKLkXuMBWh02XsxFsLk0oeC00Qm8st-dQHzUNLF6q2lNbb-sW4hQHdJMor_g4WZvGdoKIM_yACD84woPeLk-PiVnpARdf7il6atp7WD88a_x_NrPrdaI")`,
                  }}
                >
                  <div className="z-10 flex flex-col gap-4 max-w-[800px]">
                    <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight">
                      {t('hero.title')}
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-[600px] mx-auto">
                      {t('hero.subtitle')}
                    </p>
                  </div>
                  <div className="z-10 flex flex-col items-center gap-4 mt-4">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="flex min-w-[240px] cursor-pointer items-center justify-center gap-3 rounded-xl h-14 px-8 bg-primary hover:bg-primary-hover text-white text-lg font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(236,73,19,0.3)]"
                    >
                      <span>{t('hero.cta')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div
          className="px-6 md:px-20 lg:px-40 flex flex-1 justify-center py-16 bg-white/[0.02]"
          id="features"
        >
          <div className="flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-col gap-12 px-4 py-10 @container">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  {t('features.title')}
                </h2>
                <p className="text-text-muted-dark text-lg font-normal leading-normal max-w-[600px]">
                  {t('features.subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-0">
                {/* Feature 1: AI Planner */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-primary/50 transition-all hover:bg-surface-dark">
                  <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon name="restaurant_menu" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">{t('features.aiPlanner.title')}</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      {t('features.aiPlanner.description')}
                    </p>
                  </div>
                </div>

                {/* Feature 2: Family Calendar */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-orange-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-orange-400 bg-orange-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-orange-400 group-hover:text-background-dark transition-colors">
                    <Icon name="calendar_month" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">{t('features.familyCalendar.title')}</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      {t('features.familyCalendar.description')}
                    </p>
                  </div>
                </div>

                {/* Feature 3: Special Meals */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-green-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-green-400 bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-green-400 group-hover:text-background-dark transition-colors">
                    <Icon name="celebration" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">{t('features.specialOccasions.title')}</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      {t('features.specialOccasions.description')}
                    </p>
                  </div>
                </div>

                {/* Feature 4: Smart Import */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-purple-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-purple-400 bg-purple-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-purple-400 group-hover:text-background-dark transition-colors">
                    <Icon name="link" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">{t('features.smartImport.title')}</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      {t('features.smartImport.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 md:px-20 lg:px-40 py-12 bg-background-dark">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex items-center justify-center rounded-xl size-10">
                <Icon name="restaurant_menu" className="text-primary" />
              </div>
              <span className="text-white font-bold text-lg">ReceitAI</span>
            </div>
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} ReceitAI. {t('footer.copyright')}
            </p>
          </div>
          <div className="flex gap-10">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm">
              {t('footer.termsOfService')}
            </Link>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCopyUrl}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                copied ? 'bg-green-500/20' : 'bg-white/5 hover:bg-white/10'
              }`}
              title="Copy link to clipboard"
            >
              <Icon
                name={copied ? 'check' : 'share'}
                className={`text-xl ${copied ? 'text-green-400' : 'text-white'}`}
              />
            </button>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}
