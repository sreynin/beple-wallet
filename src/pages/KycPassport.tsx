import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft, AlertCircle, HelpCircle, Camera } from 'lucide-react'
import { Modal } from '../components/Modal'

type ScanState = 'ready' | 'scanning' | 'captured' | 'failed' | 'retry-loop'

export default function KycPassport() {
  const navigate = useNavigate()
  const t = useT()
  const [state, setState] = useState<ScanState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [showFaq, setShowFaq] = useState(false)

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

  // === OCR Failed ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-fade-in">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
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
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white ml-3">{t('kyc_passport_title')}</h1>
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
