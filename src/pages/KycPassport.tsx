import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { ArrowLeft, AlertCircle, HelpCircle, Camera, Check, ChevronRight } from 'lucide-react'
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
  const location = useLocation()
  const t = useT()

  const returnState = location.state as { captured?: string[]; docType?: DocType } | null

  // Flow
  const [flow, setFlow] = useState<FlowState>(returnState?.captured ? 'shoot-guide' : 'select-type')
  const [docType, setDocType] = useState<DocType>(returnState?.docType || 'passport')
  const [capturedItems, setCapturedItems] = useState<Set<string>>(
    returnState?.captured ? new Set(returnState.captured) : new Set()
  )
  const [captureKey, setCaptureKey] = useState<string>('front')

  // Camera scan
  const [state, setState] = useState<ScanState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [showFaq, setShowFaq] = useState(false)
  const [showTip, setShowTip] = useState(false)

  const items = DOC_ITEMS[docType]

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
              const stepNum = idx + 1

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (done) return
                    if (!isActive) return
                    if (item.key === 'selfie') {
                      navigate('/kyc-face')
                    } else {
                      setCaptureKey(item.key)
                      setState('ready')
                      setFailCount(0)
                      setFlow('camera')
                    }
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
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold ${
                      done
                        ? 'bg-primary text-white'
                        : isActive
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {done
                        ? <Check size={14} strokeWidth={2.5} className="text-white" />
                        : stepNum
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

          <button onClick={() => setShowTip(true)} className="flex items-center gap-1 text-[13px] text-primary font-medium mt-6">
            <span>{t('kyc_doc_tip')}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <Modal open={showTip} onClose={() => setShowTip(false)}>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Camera size={24} className="text-primary" />
            </div>
            <h3 className="text-base font-semibold text-text-dark mb-4">{t('kyc_doc_tip_title')}</h3>
            <div className="w-full space-y-2.5 mb-5">
              {(['kyc_doc_tip_1', 'kyc_doc_tip_2', 'kyc_doc_tip_3', 'kyc_doc_tip_4', 'kyc_doc_tip_5'] as const).map((key, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-primary">{i + 1}</span>
                  </span>
                  <span className="text-[13px] text-text-dark leading-snug">{t(key)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTip(false)} className="w-full py-3 bg-primary text-white font-medium rounded-xl">
              {t('close')}
            </button>
          </div>
        </Modal>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={() => navigate('/kyc-face')}
            disabled={!capturedItems.has('front')}
            className={`w-full py-4 font-semibold rounded-xl transition-colors ${
              capturedItems.has('front')
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
        const newCaptured = [...capturedItems, captureKey]
        if (captureKey === 'front') {
          // front (passport or alien) → confirm info
          setTimeout(() => navigate('/kyc-confirm', {
            state: { captured: newCaptured, docType }
          }), 800)
        } else {
          // back (alien back) → return to shoot-guide
          setTimeout(() => {
            setCapturedItems(new Set(newCaptured))
            setState('ready')
            setFlow('shoot-guide')
          }, 800)
        }
      }
    }, 2500)
  }

  const handleRetry = () => setState('ready')

  // ── Step 3: Camera view + OCR states ─────────────────────────────────────

  const cameraTitle = docType === 'passport' ? t('kyc_passport_title') : t('kyc_alien_title')

  // === OCR Failed ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-fade-in">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => setFlow('shoot-guide')} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="flex-1 text-[15px] font-semibold text-white ml-2">{cameraTitle}</h1>
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
        <h1 className="flex-1 text-[15px] font-semibold text-white ml-2">{cameraTitle}</h1>
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
        <h1 className="text-[17px] font-semibold text-white ml-3">{cameraTitle}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-5">
        {/* Document Guide Frame */}
        {docType === 'passport' ? (
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
        ) : (
          <div className="w-[220px] h-[320px] mt-10 rounded-xl border-2 border-[#999] bg-[#404040] overflow-hidden relative">
            <div className="absolute left-[16px] top-[24px] text-[11px] text-[#b3b3b3] leading-[20px]">
              <p className="text-[13px] font-semibold text-[#ccc] mb-2">{captureKey === 'back' ? t('kyc_alien_back_label') : t('kyc_alien_front_label')}</p>
              <p>이름: JOHN SMITH</p>
              <p>국적: USA</p>
              <p>체류자격: D-2</p>
              <p>등록번호: 000000-0000000</p>
            </div>
            {/* Photo placeholder */}
            {captureKey === 'front' && (
              <div className="absolute right-[16px] top-[24px] w-[60px] h-[80px] rounded border border-[#666] bg-[#555] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8 opacity-30">
                  <circle cx="20" cy="15" r="8" fill="#999" />
                  <ellipse cx="20" cy="35" rx="12" ry="8" fill="#999" />
                </svg>
              </div>
            )}

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
        )}

        {/* Instructions */}
        <div className="mt-auto mb-4 text-center">
          <p className="text-white text-base font-semibold leading-relaxed">
            {state === 'scanning' ? t(docType === 'passport' ? 'kyc_passport_scanning' : 'kyc_alien_scanning') :
             state === 'captured' ? t(docType === 'passport' ? 'kyc_passport_done' : 'kyc_alien_done') :
             t(docType === 'passport' ? 'kyc_passport_guide' : 'kyc_alien_guide')}
          </p>
          <p className="text-[#999] text-[13px] mt-2">
            {t('kyc_passport_auto_fail')}
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
