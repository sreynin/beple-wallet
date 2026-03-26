import { useStore } from '../store/useStore'
import { getTranslation, type TranslationKeys } from '../i18n'

export function useT() {
  const { language } = useStore()
  const dict = getTranslation(language)
  return function t(key: TranslationKeys): string {
    return dict[key] ?? key
  }
}
