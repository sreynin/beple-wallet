import ko, { type TranslationKeys } from './ko'
import en from './en'
import zh from './zh'
import type { Language } from '../store/useStore'

const translations: Record<string, Record<TranslationKeys, string>> = { ko, en, zh }

export function getTranslation(lang: Language): Record<TranslationKeys, string> {
  return translations[lang] || translations.ko
}

export type { TranslationKeys }
