import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import i18n, { use as applyI18nextPlugin, changeLanguage as changeLanguageI18next } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import id from './id.json'

const SUPPORTED = ['en', 'id'] as const
type SupportedLanguage = (typeof SUPPORTED)[number]

const STORAGE_KEY = 'language'

const isSupported = (code: string): code is SupportedLanguage =>
  (SUPPORTED as readonly string[]).includes(code)

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en'
const initialLanguage: SupportedLanguage = isSupported(deviceLocale) ? deviceLocale : 'en'

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

// Rehydrate
AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
  if (saved && isSupported(saved) && saved !== i18n.language) {
    changeLanguageI18next(saved)
  }
})

export const setLanguage = async (lang: SupportedLanguage) => {
  await changeLanguageI18next(lang)
  await AsyncStorage.setItem(STORAGE_KEY, lang)
}

export default i18n
export { SUPPORTED }
export type { SupportedLanguage }
