import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Check } from 'lucide-react'

type Selection = 'domestic' | 'foreigner' | null

export default function AccountCheck() {
  const navigate = useNavigate()
  const { setUserType } = useStore()
  const t = useT()
  const [selected, setSelected] = useState<Selection>(null)

  const handleNext = () => {
    if (!selected) return
    setUserType(selected)
    if (selected === 'domestic') {
      navigate('/login')
    } else {
      navigate('/kyc-contact')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 px-6 pt-10">
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line">
          {t('account_check_heading')}
        </h2>
        <p className="text-sm text-text-gray mt-2 mb-8">{t('account_check_desc')}</p>

        <div className="space-y-3">
          {/* 내국인 (Domestic) */}
          <button
            onClick={() => setSelected('domestic')}
            className={`w-full relative flex items-center justify-center px-5 py-4 rounded-xl border-2 transition-all
              ${selected === 'domestic'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white active:bg-gray-50'
              }`}
          >
            <span className={`font-semibold ${selected === 'domestic' ? 'text-primary' : 'text-text-dark'}`}>
              {t('account_check_yes')}
            </span>
            {selected === 'domestic' && (
              <div className="absolute right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>

          {/* 외국인 (Foreigner) */}
          <button
            onClick={() => setSelected('foreigner')}
            className={`w-full relative flex items-center justify-center px-5 py-4 rounded-xl border-2 transition-all
              ${selected === 'foreigner'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white active:bg-gray-50'
              }`}
          >
            <span className={`font-semibold ${selected === 'foreigner' ? 'text-primary' : 'text-text-dark'}`}>
              {t('account_check_no')}
            </span>
            {selected === 'foreigner' && (
              <div className="absolute right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 font-semibold rounded-xl transition-colors
            ${selected
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}
