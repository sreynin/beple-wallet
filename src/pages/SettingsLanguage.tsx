import { useStore, type Language } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { toast } from '../components/Toast'
import { Check, Globe } from 'lucide-react'

const languageOptions: { code: Language; flag: string; label: string; sub: string }[] = [
  { code: 'ko', flag: '🇰🇷', label: '한국어', sub: 'Korean' },
  { code: 'en', flag: '🇺🇸', label: 'English', sub: 'English' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', sub: 'Japanese' },
  { code: 'zh', flag: '🇨🇳', label: '中文', sub: 'Chinese' },
  { code: 'es', flag: '🇪🇸', label: 'Español', sub: 'Spanish' },
]

export default function SettingsLanguage() {
  const { language, setLanguage } = useStore()
  const t = useT()

  const handleSelect = (code: Language) => {
    setLanguage(code)
    const selected = languageOptions.find(l => l.code === code)
    toast(selected?.label || '', 'success')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('settings_language')} />

      <div className="flex-1 px-4 pt-5 overflow-y-auto">
        <p className="text-sm text-text-gray mb-4 px-1">{t('settings_language_desc')}</p>

        <div className="space-y-2">
          {languageOptions.map(opt => {
            const isActive = language === opt.code
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 transition-all ${
                  isActive ? 'border-primary bg-primary/5' : 'border-transparent active:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{opt.flag}</span>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-dark'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-text-light mt-0.5">{opt.sub}</p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
