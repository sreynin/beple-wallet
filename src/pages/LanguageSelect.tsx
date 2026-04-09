import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, type Language } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Check, Globe } from 'lucide-react'

const languages: { code: Language; flag: string; labelKey: 'lang_ko' | 'lang_en' | 'lang_ja' | 'lang_zh' | 'lang_es'; subKey: 'lang_ko_sub' | 'lang_en_sub' | 'lang_ja_sub' | 'lang_zh_sub' | 'lang_es_sub' }[] = [
  { code: 'ko', flag: '🇰🇷', labelKey: 'lang_ko', subKey: 'lang_ko_sub' },
  { code: 'en', flag: '🇺🇸', labelKey: 'lang_en', subKey: 'lang_en_sub' },
  { code: 'ja', flag: '🇯🇵', labelKey: 'lang_ja', subKey: 'lang_ja_sub' },
  { code: 'zh', flag: '🇨🇳', labelKey: 'lang_zh', subKey: 'lang_zh_sub' },
  { code: 'es', flag: '🇪🇸', labelKey: 'lang_es', subKey: 'lang_es_sub' },
]

export default function LanguageSelect() {
  const { language, setLanguage } = useStore()
  const [selected, setSelected] = useState<Language>(language)
  const navigate = useNavigate()
  const t = useT()

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-center text-sm font-medium text-text-dark">Language Selection</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {/* Globe Icon */}
        <div className="flex justify-center mt-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Globe size={32} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-text-dark text-center">{t('lang_title')}</h1>
        <p className="text-sm text-text-gray text-center mt-1">{t('lang_subtitle')}</p>

        {/* Language Cards */}
        <div className="mt-6 space-y-3">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setSelected(lang.code); setLanguage(lang.code) }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all
                ${selected === lang.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white active:bg-gray-50'
                }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left flex-1">
                <p className={`font-semibold ${selected === lang.code ? 'text-primary' : 'text-text-dark'}`}>
                  {t(lang.labelKey)}
                </p>
                <p className="text-xs text-text-gray mt-0.5">{t(lang.subKey)}</p>
              </div>
              {selected === lang.code && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => navigate('/account-check')}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark transition-colors"
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}
