import { useStore, type Theme } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { toast } from '../components/Toast'
import { Check, Sun, Moon, Monitor } from 'lucide-react'

export default function SettingsTheme() {
  const { theme, setTheme } = useStore()
  const t = useT()

  const themeOptions: { code: Theme; label: string; desc: string; icon: typeof Sun; color: string }[] = [
    { code: 'light', label: t('theme_light'), desc: t('theme_light_desc'), icon: Sun, color: 'bg-amber-50 text-amber-500' },
    { code: 'dark', label: t('theme_dark'), desc: t('theme_dark_desc'), icon: Moon, color: 'bg-indigo-50 text-indigo-500' },
    { code: 'system', label: t('theme_system'), desc: t('theme_system_desc'), icon: Monitor, color: 'bg-gray-100 text-text-gray' },
  ]

  const handleSelect = (code: Theme) => {
    setTheme(code)
    const selected = themeOptions.find(o => o.code === code)
    toast(selected?.label || '', 'success')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('settings_theme')} />

      <div className="flex-1 px-4 pt-5 overflow-y-auto">
        <p className="text-sm text-text-gray mb-4 px-1">{t('settings_theme_desc')}</p>

        <div className="space-y-2">
          {themeOptions.map(opt => {
            const isActive = theme === opt.code
            const Icon = opt.icon
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 transition-all ${
                  isActive ? 'border-primary bg-primary/5' : 'border-transparent active:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-primary/10' : opt.color.split(' ')[0]
                }`}>
                  <Icon size={20} className={isActive ? 'text-primary' : opt.color.split(' ')[1]} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-dark'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-text-light mt-0.5">{opt.desc}</p>
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

        {/* Preview */}
        <div className="mt-6 px-1">
          <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">Preview</p>
          <div className="bg-white rounded-2xl p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 bg-primary/10 rounded-xl" />
              <div className="h-10 flex-1 bg-gray-50 rounded-xl" />
              <div className="h-10 flex-1 bg-gray-50 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
