import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/common'
import { LoginModal } from '@/components/common/LoginModal'

export default function PublicLandingPage() {
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
      {/* Top Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-20 lg:px-40 py-4">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                  fill="currentColor"
                />
                <path
                  clipRule="evenodd"
                  d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">ReceitAI</h2>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                href="#features"
                onClick={scrollToFeatures}
              >
                Features
              </a>
            </nav>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all"
            >
              <span>Log In</span>
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
                      Master Your Meals with AI
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-[600px] mx-auto">
                      Effortless meal planning, smart grocery lists, and recipe discovery powered by
                      artificial intelligence.
                    </p>
                  </div>
                  <div className="z-10 flex flex-col items-center gap-4 mt-4">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="flex min-w-[240px] cursor-pointer items-center justify-center gap-3 rounded-xl h-14 px-8 bg-primary hover:bg-primary-hover text-white text-lg font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(236,73,19,0.3)]"
                    >
                      <span>Get Started for Free</span>
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
                  Powerful Tools for Modern Cooks
                </h2>
                <p className="text-text-muted-dark text-lg font-normal leading-normal max-w-[600px]">
                  Everything you need to manage your kitchen, save time on grocery runs, and impress
                  your guests every single night.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-0">
                {/* Feature 1: AI Planner */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-primary/50 transition-all hover:bg-surface-dark">
                  <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon name="restaurant_menu" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">AI Meal Planner</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      Personalized weekly plans generated just for your dietary needs and tastes.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Family Calendar */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-orange-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-orange-400 bg-orange-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-orange-400 group-hover:text-background-dark transition-colors">
                    <Icon name="calendar_month" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">Family Calendar</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      Sync with the whole household to ensure everyone is on the same page for
                      dinner.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Special Meals */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-green-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-green-400 bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-green-400 group-hover:text-background-dark transition-colors">
                    <Icon name="celebration" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">Special Occasions</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      Plan the perfect complex menu to impress your friends at your next party.
                    </p>
                  </div>
                </div>

                {/* Feature 4: Smart Import */}
                <div className="group flex flex-1 gap-4 rounded-2xl border border-white/10 bg-surface-dark/50 p-6 flex-col hover:border-purple-400/50 transition-all hover:bg-surface-dark">
                  <div className="text-purple-400 bg-purple-400/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-purple-400 group-hover:text-background-dark transition-colors">
                    <Icon name="link" className="text-3xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold">Smart Import</h3>
                    <p className="text-text-muted-dark text-sm font-normal leading-relaxed">
                      Paste a recipe URL or raw text to instantly import ingredients and
                      instructions.
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
            <div className="flex items-center gap-2 text-primary">
              <Icon name="database" className="text-2xl" />
              <span className="text-white font-bold text-lg">ReceitAI</span>
            </div>
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} ReceitAI. All rights reserved.
            </p>
          </div>
          <div className="flex gap-10">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
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
