import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useT } from '../hooks/useT'
import { Shield } from 'lucide-react'
import { useState } from 'react'

export default function KycStart() {
  const navigate = useNavigate()
  const t = useT()
  const [selected, setSelected] = useState<'minimal' | 'full'>('minimal')

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('kyc_verification')} />

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={24} className="text-primary" />
          <h2 className="text-lg font-bold text-text-dark">{t('kyc_heading')}</h2>
        </div>
        <p className="text-sm text-text-gray mb-6">{t('kyc_desc')}</p>

        <div className="space-y-3">
          <button
            onClick={() => setSelected('minimal')}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              selected === 'minimal' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-text-dark">{t('kyc_minimal')}</span>
              <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">{t('kyc_recommended')}</span>
            </div>
            <p className="text-xs text-text-gray leading-relaxed">{t('kyc_minimal_desc')}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-gray">{t('kyc_limit')}</span>
                <span className="text-sm font-bold text-primary">{t('kyc_limit_value')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-gray">{t('kyc_docs')}</span>
                <span className="text-xs font-medium text-text-dark">{t('kyc_passport_only')}</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelected('full')}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all opacity-60 ${
              selected === 'full' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <span className="font-semibold text-text-dark">{t('kyc_full')}</span>
            <p className="text-xs text-text-gray mt-1">{t('kyc_full_desc')}</p>
            <p className="text-[10px] text-warning mt-2 font-medium">{t('kyc_full_preparing')}</p>
          </button>
        </div>

        <div className="mt-5 bg-gray-50 rounded-xl p-4">
          <p className="text-[10px] text-text-gray leading-relaxed whitespace-pre-line">{t('kyc_notice')}</p>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => navigate('/kyc-passport')}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark"
        >
          {t('kyc_start')}
        </button>
      </div>
    </div>
  )
}
