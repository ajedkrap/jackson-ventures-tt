import * as Localization from 'expo-localization'
import i18n, { use as applyI18nextPlugin } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import id from './id.json'

const SUPPORTED = ['en', 'id'] as const
type SupportedLanguage = (typeof SUPPORTED)[number]

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en'
const initialLanguage: SupportedLanguage = (SUPPORTED as readonly string[]).includes(deviceLocale)
  ? (deviceLocale as SupportedLanguage)
  : 'en'

applyI18nextPlugin(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
})

export default i18n
export { SUPPORTED }
export type { SupportedLanguage }
