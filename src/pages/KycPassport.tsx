import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft, AlertCircle, HelpCircle, Camera, Check, ChevronRight, Info } from 'lucide-react'
import { Modal } from '../components/Modal'

type DocType = 'passport' | 'alien'
type FlowState = 'select-type' | 'shoot-guide' | 'camera'
type ScanState = 'ready' | 'scanning' | 'captured' | 'failed' | 'retry-loop'

// Per-doc items to photograph
const DOC_ITEMS: Record<DocType, { key: string; labelKey: string; optional?: boolean }[]> = {
  passport: [
    { key: 'front',  labelKey: 'kyc_doc_passport_front' },
    { key: 'selfie', labelKey: 'kyc_doc_selfie' },
  ],
  alien: [
    { key: 'front',  labelKey: 'kyc_doc_alien_front' },
    { key: 'back',   labelKey: 'kyc_doc_alien_back', optional: true },
    { key: 'selfie', labelKey: 'kyc_doc_selfie' },
  ],
}

export default function KycPassport() {
  const navigate = useNavigate()
  const t = useT()

  // Flow
  const [flow, setFlow] = useState<FlowState>('select-type')
  const [docType, setDocType] = useState<DocType>('passport')
  const [capturedItems, setCapturedItems] = useState<Set<string>>(new Set())

  // Camera scan
  const [state, setState] = useState<ScanState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [showFaq, setShowFaq] = useState(false)

  const items = DOC_ITEMS[docType]
  const requiredItems = items.filter(i => !i.optional).map(i => i.key)
  const allRequiredCaptured = requiredItems.every(k => capturedItems.has(k))

  // ── Step 1: Select document type ─────────────────────────────────────────
  if (flow === 'select-type') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Back button only, no header bar */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <h2 className="text-[22px] font-bold text-text-dark leading-snug whitespace-pre-line">{t('kyc_doc_select_title')}</h2>
        <p className="text-[13px] text-text-gray mt-3 whitespace-pre-line">{t('kyc_doc_select_desc')}</p>

        <div className="mt-8 space-y-3">
          {/* Passport */}
          <button
            onClick={() => setDocType('passport')}
            className={`w-full text-left px-4 py-4 rounded-xl border transition-all flex items-start gap-3 ${
              docType === 'passport' ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              docType === 'passport' ? 'bg-primary' : 'border-2 border-gray-300'
            }`}>
              {docType === 'passport' && <Check size={12} strokeWidth={3} className="text-white" />}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-text-dark">{t('kyc_doc_passport')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('kyc_doc_passport_desc')}</p>
            </div>
          </button>

          {/* Alien Registration Card */}
          <button
            onClick={() => setDocType('alien')}
            className={`w-full text-left px-4 py-4 rounded-xl border transition-all flex items-start gap-3 ${
              docType === 'alien' ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              docType === 'alien' ? 'bg-primary' : 'border-2 border-gray-300'
            }`}>
              {docType === 'alien' && <Check size={12} strokeWidth={3} className="text-white" />}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-text-dark">{t('kyc_doc_alien')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('kyc_doc_alien_desc')}</p>
            </div>
          </button>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => { setCapturedItems(new Set()); setFlow('shoot-guide') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark"
        >
          {t('next')}
        </button>
      </div>
    </div>
  )

  // ── Step 2: Shoot guide (checklist of sides) ──────────────────────────────
  if (flow === 'shoot-guide') {
    // Find the first uncaptured item index for highlighting
    const firstUncapturedIdx = items.findIndex(item => !capturedItems.has(item.key))

    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
        {/* Back button only */}
        <div className="px-4 pt-4 pb-2">
          <button onClick={() => setFlow('select-type')} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
            <ArrowLeft size={22} className="text-text-dark" />
          </button>
        </div>

        <div className="flex-1 px-6 pt-4 overflow-y-auto">
          <h2 className="text-[22px] font-bold text-text-dark leading-snug whitespace-pre-line">{t('kyc_doc_shoot_title')}</h2>
          <p className="text-[13px] text-text-gray mt-2">{t('kyc_doc_shoot_desc')}</p>

          <div className="mt-8 space-y-3">
            {items.map((item, idx) => {
              const done = capturedItems.has(item.key)
              const isActive = idx === firstUncapturedIdx

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setCapturedItems(prev => new Set([...prev, item.key]))
                  }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${
                    done
                      ? 'bg-primary/5 border border-primary'
                      : isActive
                        ? 'bg-primary/5 border border-primary'
                        : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done
                        ? 'bg-primary'
                        : isActive
                          ? 'bg-primary'
                          : 'bg-gray-200'
                    }`}>
                      {done
                        ? <Check size={14} strokeWidth={2.5} className="text-white" />
                        : isActive
                          ? <Info size={14} className="text-white" />
                          : <span className="w-2 h-2 rounded-full bg-gray-400" />
                      }
                    </span>
                    <span className={`text-[14px] font-medium ${
                      done || isActive ? 'text-text-dark' : 'text-text-gray'
                    }`}>
                      {t(item.labelKey as Parameters<typeof t>[0])}
                      {item.optional && <span className="text-xs text-text-gray ml-1">({t('optional')})</span>}
                    </span>
                  </div>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    done
                      ? 'bg-primary'
                      : isActive
                        ? 'bg-primary'
                        : 'bg-gray-200'
                  }`}>
                    {done
                      ? <Check size={16} className="text-white" />
                      : <Camera size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                    }
                  </span>
                </button>
              )
            })}
          </div>

          <button className="flex items-center gap-1 text-[13px] text-primary font-medium mt-6">
            <span>{t('kyc_doc_tip')}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={() => { setState('ready'); setFlow('camera') }}
            disabled={!allRequiredCaptured}
            className={`w-full py-4 font-semibold rounded-xl transition-colors ${
              allRequiredCaptured
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

  const handleCapture = () => {
    setState('scanning')
    setTimeout(() => {
      const willFail = failCount < 2 && Math.random() < 0.3
      if (willFail) {
        const newCount = failCount + 1
        setFailCount(newCount)
        setState(newCount >= 3 ? 'retry-loop' : 'failed')
      } else {
        setState('captured')
        setTimeout(() => navigate('/kyc-face'), 800)
      }
    }, 2500)
  }

  const handleRetry = () => setState('ready')

  // ── Step 3: Camera view + OCR states ─────────────────────────────────────

  // === OCR Failed ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-fade-in">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => setFlow('shoot-guide')} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="flex-1 text-[15px] font-semibold text-white ml-2">{t('kyc_passport_title')}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle size={36} className="text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">{t('kyc_ocr_fail_title')}</h2>
        <p className="text-sm text-white/60 text-center whitespace-pre-line mb-2">{t('kyc_ocr_fail_msg')}</p>
        <p className="text-xs text-white/40 mb-8">({failCount}/3 {t('attempt_count')})</p>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={handleRetry} className="w-full py-4 bg-[#2663eb] text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <Camera size={18} />{t('kyc_ocr_retry_btn')}
        </button>
        <button onClick={() => navigate(-1)} className="w-full py-3 text-white/50 text-sm font-medium">{t('cancel')}</button>
      </div>
    </div>
  )

  // === Retry Loop (3+ failures) ===
  if (state === 'retry-loop') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-fade-in">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="flex-1 text-[15px] font-semibold text-white ml-2">{t('kyc_passport_title')}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
          <AlertCircle size={36} className="text-amber-400" />
        </div>
        <h2 className="text-base font-bold text-white mb-2">{t('kyc_ocr_retry_title')}</h2>
        <div className="bg-amber-500/10 rounded-xl p-4 mb-6 w-full">
          <p className="text-sm text-amber-300 text-center whitespace-pre-line">{t('kyc_ocr_retry_msg')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => { setFailCount(0); handleRetry() }} className="w-full py-4 bg-[#2663eb] text-white font-semibold rounded-xl">{t('kyc_ocr_guide_btn')}</button>
        <button onClick={() => setShowFaq(true)} className="w-full py-3 text-white/50 text-sm font-medium flex items-center justify-center gap-1">
          <HelpCircle size={14} />{t('kyc_support_faq')}
        </button>
      </div>
      <Modal open={showFaq} onClose={() => setShowFaq(false)}>
        <div className="flex flex-col items-center">
          <HelpCircle size={32} className="text-primary mb-3" />
          <h3 className="text-base font-semibold text-text-dark mb-2">{t('kyc_support_title')}</h3>
          <p className="text-sm text-text-gray text-center mb-4">{t('kyc_support_msg')}</p>
          <button onClick={() => setShowFaq(false)} className="w-full mt-2 py-3 bg-primary text-white font-medium rounded-xl">{t('close')}</button>
        </div>
      </Modal>
    </div>
  )

  // === Camera View ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-slide-in">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => setFlow('shoot-guide')} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white ml-3">
          {docType === 'passport' ? t('kyc_passport_title') : t('kyc_alien_title')}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-5">
        {/* Passport Guide Frame */}
        <div className="w-[300px] h-[200px] mt-16 rounded-lg border-2 border-[#999] bg-[#404040] overflow-hidden relative">
          <div className="absolute left-[18px] top-[38px] text-[12px] text-[#b3b3b3] font-mono leading-[18px]">
            <p>PASSPORT</p>
            <p>USA</p>
            <p>SMITH, JOHN</p>
            <p>{'P<USASMITH<JOHN<<<<<<<<<<'}</p>
          </div>

          {/* Scanning animation */}
          {state === 'scanning' && (
            <div className="absolute inset-0">
              <div className="absolute left-0 right-0 h-0.5 bg-[#2663eb]" style={{ animation: 'scanLine 2s linear infinite' }} />
              <div className="absolute inset-0 bg-[#2663eb]/5 animate-pulse" />
            </div>
          )}

          {/* Captured success */}
          {state === 'captured' && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center animate-bounce-in">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-auto mb-4 text-center">
          <p className="text-white text-base font-semibold leading-relaxed">
            {state === 'scanning' ? t('kyc_passport_scanning') :
             state === 'captured' ? t('kyc_passport_done') :
             <>여권 정보 페이지를 프레임 안에<br />맞춰주세요</>}
          </p>
          <p className="text-[#999] text-[13px] mt-2">
            빛 반사 없이 선명하게 촬영해주세요
          </p>
        </div>

        {/* Fail count */}
        {failCount > 0 && state === 'ready' && (
          <p className="text-amber-400 text-xs mb-2">⚠ {failCount}/3 {t('attempt_count')}</p>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-5 pb-8">
        <button
          onClick={handleCapture}
          disabled={state === 'scanning' || state === 'captured'}
          className="w-full py-3.5 bg-[#2663eb] text-white font-semibold rounded-xl text-base disabled:opacity-50 active:bg-[#1d4fc7] transition-colors"
        >
          {state === 'scanning' ? t('kyc_passport_scanning_btn') : t('kyc_passport_capture')}
        </button>
      </div>
    </div>
  )
}
