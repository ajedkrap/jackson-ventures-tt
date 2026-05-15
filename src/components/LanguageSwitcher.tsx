import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import styles from './LanguageSwitcher.style'

import { setLanguage, type SupportedLanguage } from '@/i18n'

const FLAGS: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  id: '🇮🇩',
}

const NEXT_LANG: Record<SupportedLanguage, SupportedLanguage> = {
  en: 'id',
  id: 'en',
}

const NATIVE_NAME: Record<SupportedLanguage, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
}

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const insets = useSafeAreaInsets()

  const current =
    (i18n.language as SupportedLanguage) in FLAGS ? (i18n.language as SupportedLanguage) : 'en'
  const next = NEXT_LANG[current]

  const handleToggle = () => {
    setLanguage(next)
  }

  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: insets.bottom + 24 }]}
      onPress={handleToggle}
      accessibilityRole="button"
      accessibilityLabel={`Switch language to ${NATIVE_NAME[next]}`}
    >
      <Text style={styles.flag}>{FLAGS[current]}</Text>
    </TouchableOpacity>
  )
}

export default LanguageSwitcher
