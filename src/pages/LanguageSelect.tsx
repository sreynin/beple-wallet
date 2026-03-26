import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, type Language } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Check, Globe } from 'lucide-react'

const languages: { code: Language; labelKey: 'lang_ko' | 'lang_en' | 'lang_zh'; subKey: 'lang_ko_sub' | 'lang_en_sub' | 'lang_zh_sub' }[] = [
  { code: 'ko', labelKey: 'lang_ko', subKey: 'lang_ko_sub' },
  { code: 'en', labelKey: 'lang_en', subKey: 'lang_en_sub' },
  { code: 'zh', labelKey: 'lang_zh', subKey: 'lang_zh_sub' },
]

export default function LanguageSelect() {
  const { language, setLanguage } = useStore()
  const [selected, setSelected] = useState<Language>(language)
  const navigate = useNavigate()
  const t = useT()

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 px-6 pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Globe size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-dark">{t('lang_title')}</h1>
            <p className="text-sm text-text-gray">{t('lang_subtitle')}</p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setSelected(lang.code); setLanguage(lang.code) }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all
                ${selected === lang.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white active:bg-gray-50'
                }`}
            >
              <div className="text-left">
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

      <div className="px-6 pb-8">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark transition-colors"
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}
