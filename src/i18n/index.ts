import ko, { type TranslationKeys } from './ko'
import en from './en'
import ja from './ja'
import zh from './zh'
import es from './es'
import type { Language } from '../store/useStore'

const translations: Record<string, Record<TranslationKeys, string>> = { ko, en, ja, zh, es }

export function getTranslation(lang: Language): Record<TranslationKeys, string> {
  return translations[lang] || translations.ko
}

export type { TranslationKeys }
