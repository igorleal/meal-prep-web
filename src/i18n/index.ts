import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { DEFAULT_LANGUAGE } from './types'

// English translations
import enCommon from './locales/en/common.json'
import enNavigation from './locales/en/navigation.json'
import enAuth from './locales/en/auth.json'
import enSettings from './locales/en/settings.json'
import enMealPlans from './locales/en/mealPlans.json'
import enSpecialMeals from './locales/en/specialMeals.json'
import enFamilyCalendar from './locales/en/familyCalendar.json'
import enFavorites from './locales/en/favorites.json'
import enRecipes from './locales/en/recipes.json'
import enLegal from './locales/en/legal.json'
import enOnboarding from './locales/en/onboarding.json'
import enLanding from './locales/en/landing.json'
import enSeo from './locales/en/seo.json'

// Portuguese translations
import ptCommon from './locales/pt/common.json'
import ptNavigation from './locales/pt/navigation.json'
import ptAuth from './locales/pt/auth.json'
import ptSettings from './locales/pt/settings.json'
import ptMealPlans from './locales/pt/mealPlans.json'
import ptSpecialMeals from './locales/pt/specialMeals.json'
import ptFamilyCalendar from './locales/pt/familyCalendar.json'
import ptFavorites from './locales/pt/favorites.json'
import ptRecipes from './locales/pt/recipes.json'
import ptLegal from './locales/pt/legal.json'
import ptOnboarding from './locales/pt/onboarding.json'
import ptLanding from './locales/pt/landing.json'
import ptSeo from './locales/pt/seo.json'

// Swedish translations
import svCommon from './locales/sv/common.json'
import svNavigation from './locales/sv/navigation.json'
import svAuth from './locales/sv/auth.json'
import svSettings from './locales/sv/settings.json'
import svMealPlans from './locales/sv/mealPlans.json'
import svSpecialMeals from './locales/sv/specialMeals.json'
import svFamilyCalendar from './locales/sv/familyCalendar.json'
import svFavorites from './locales/sv/favorites.json'
import svRecipes from './locales/sv/recipes.json'
import svLegal from './locales/sv/legal.json'
import svOnboarding from './locales/sv/onboarding.json'
import svLanding from './locales/sv/landing.json'
import svSeo from './locales/sv/seo.json'

export const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    settings: enSettings,
    mealPlans: enMealPlans,
    specialMeals: enSpecialMeals,
    familyCalendar: enFamilyCalendar,
    favorites: enFavorites,
    recipes: enRecipes,
    legal: enLegal,
    onboarding: enOnboarding,
    landing: enLanding,
    seo: enSeo,
  },
  pt: {
    common: ptCommon,
    navigation: ptNavigation,
    auth: ptAuth,
    settings: ptSettings,
    mealPlans: ptMealPlans,
    specialMeals: ptSpecialMeals,
    familyCalendar: ptFamilyCalendar,
    favorites: ptFavorites,
    recipes: ptRecipes,
    legal: ptLegal,
    onboarding: ptOnboarding,
    landing: ptLanding,
    seo: ptSeo,
  },
  sv: {
    common: svCommon,
    navigation: svNavigation,
    auth: svAuth,
    settings: svSettings,
    mealPlans: svMealPlans,
    specialMeals: svSpecialMeals,
    familyCalendar: svFamilyCalendar,
    favorites: svFavorites,
    recipes: svRecipes,
    legal: svLegal,
    onboarding: svOnboarding,
    landing: svLanding,
    seo: svSeo,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'auth',
      'settings',
      'mealPlans',
      'specialMeals',
      'familyCalendar',
      'favorites',
      'recipes',
      'legal',
      'onboarding',
      'landing',
      'seo',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
