import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { ArrowLeft, Check, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'

interface TermItem {
  id: string
  labelKey: string
  required: boolean
  /** 'navigate' shows > arrow, 'expand' shows v/^ toggle with inline content */
  action: 'navigate' | 'expand'
  contentKey?: string
}

const TERM_ITEMS: TermItem[] = [
  { id: 'finance',    labelKey: 'terms_finance',       required: true,  action: 'navigate' },
  { id: 'service',    labelKey: 'terms_service',       required: true,  action: 'navigate' },
  { id: 'privacy',    labelKey: 'terms_privacy_collect', required: true, action: 'expand', contentKey: 'terms_privacy_content' },
  { id: 'card',       labelKey: 'terms_card',          required: true,  action: 'navigate' },
  { id: 'openbank',   labelKey: 'terms_openbank',      required: true,  action: 'navigate' },
  { id: 'biometric',  labelKey: 'terms_biometric',     required: true,  action: 'expand', contentKey: 'terms_biometric_content' },
  { id: 'location',   labelKey: 'terms_location',      required: false, action: 'navigate' },
  { id: 'marketing',  labelKey: 'terms_marketing',     required: false, action: 'expand', contentKey: 'terms_marketing_content' },
]

export default function Terms() {
  const navigate = useNavigate()
  const location = useLocation()
  const t = useT()
  const flow = (location.state as { flow?: string })?.flow

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const allChecked = TERM_ITEMS.every(item => checked.has(item.id))
  const requiredChecked = TERM_ITEMS.filter(item => item.required).every(item => checked.has(item.id))

  const toggleAll = () => {
    setChecked(allChecked ? new Set() : new Set(TERM_ITEMS.map(item => item.id)))
  }

  const toggle = (id: string) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id); else next.add(id)
    setChecked(next)
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id); else next.add(id)
    setExpanded(next)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-2 overflow-y-auto">
        {/* Title */}
        <h2 className="text-[22px] font-bold text-text-dark leading-snug">
          Welcome,{'\n'}
          {t('terms_heading')}
        </h2>

        {/* Agree all */}
        <button
          onClick={toggleAll}
          className="w-full flex items-center gap-3 mt-8 pb-4 border-b border-gray-200"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            allChecked ? 'bg-primary' : 'bg-gray-200'
          }`}>
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-[15px] font-semibold text-text-dark">{t('terms_all')}</span>
        </button>

        {/* Individual terms */}
        <div className="mt-2">
          {TERM_ITEMS.map(term => (
            <div key={term.id}>
              <div className="flex items-center gap-3 py-3.5">
                {/* Checkmark */}
                <button
                  onClick={() => toggle(term.id)}
                  className="flex-shrink-0"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    checked.has(term.id) ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                </button>

                {/* Label */}
                <button onClick={() => toggle(term.id)} className="flex-1 text-left">
                  <span className={`text-[13px] ${term.required ? 'text-text-dark' : 'text-text-gray'}`}>
                    [{term.required ? t('terms_required') : t('terms_optional')}] {t(term.labelKey as Parameters<typeof t>[0])}
                  </span>
                </button>

                {/* Action icon */}
                {term.action === 'navigate' ? (
                  <button className="p-1 text-text-gray">
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={() => toggleExpand(term.id)} className="p-1 text-text-gray">
                    {expanded.has(term.id)
                      ? <ChevronUp size={16} />
                      : <ChevronDown size={16} />
                    }
                  </button>
                )}
              </div>

              {/* Expandable content */}
              {term.action === 'expand' && expanded.has(term.id) && term.contentKey && (
                <div className="ml-8 mb-2 animate-fade-in">
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto text-xs text-text-gray leading-relaxed whitespace-pre-wrap">
                    {t(term.contentKey as Parameters<typeof t>[0])}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => flow === 'kyc'
            ? navigate('/kyc-start')
            : navigate('/pin-setup', { state: { flow: 'signup' } })
          }
          disabled={!requiredChecked}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${
            requiredChecked
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}
