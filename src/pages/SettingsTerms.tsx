import { Header } from '../components/Header'
import { useT } from '../hooks/useT'

export default function SettingsTerms() {
  const t = useT()

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_terms_title')} />
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
        <h2 className="text-base font-bold text-text-dark mb-4">{t('settings_terms_heading')}</h2>
        <div className="text-xs text-text-gray leading-relaxed space-y-4">
          <div>
            <p className="font-semibold text-text-dark mb-1">Article 1 / 제 1 조</p>
            <p>{t('terms_service_content')}</p>
          </div>
          <div>
            <p className="font-semibold text-text-dark mb-1">Article 2 / 제 2 조</p>
            <p className="whitespace-pre-line">{t('terms_privacy_content')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
