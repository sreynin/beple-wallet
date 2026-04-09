import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PinInput } from '../components/PinInput'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { ArrowLeft } from 'lucide-react'

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet } = useStore()
  const t = useT()
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')
  const [showBioDialog, setShowBioDialog] = useState(false)

  const navState = (location.state || {}) as { flow?: 'signup' | 'reset' | 'kyc' }
  const flow = navState.flow
  const isSignupFlow = flow === 'signup' ? true : flow === 'reset' ? false : !pinSet

  const goHome = () => navigate('/home', { replace: true })

  const handleComplete = (pin: string) => {
    if (step === 'create') {
      setFirstPin(pin)
      setStep('confirm')
      setError('')
    } else {
      if (pin === firstPin) {
        setPin(pin)
        // After KYC or signup PIN setup → offer biometric before going home
        if (flow === 'kyc' || flow === 'signup') {
          setShowBioDialog(true)
        } else if (flow === 'reset') {
          navigate(-1)
        } else if (location.state?.from === 'payment') {
          navigate('/payment-pin', { replace: true })
        } else if (location.state?.from === 'settings') {
          navigate(-1)
        } else if (isSignupFlow) {
          setShowBioDialog(true)
        } else {
          navigate('/home', { replace: true })
        }
      } else {
        setError(t('pin_mismatch'))
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  // ── BW-ONB-PIN-01a: Create PIN (no header, no back button) ──
  if (step === 'create') {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
        <PinInput
          title={t('pin_enter')}
          subtitle={t('pin_used_for')}
          error={error}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  // ── BW-ONB-PIN-02: Confirm PIN (with back + header) ──
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => { setStep('create'); setFirstPin(''); setError('') }} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
        <h1 className="text-[15px] font-semibold text-text-dark ml-2">{t('pin_confirm_header')}</h1>
      </div>

      <PinInput
        title={t('pin_reenter')}
        subtitle={t('pin_reenter_desc')}
        error={error}
        onComplete={handleComplete}
      />

      {/* BW-ONB-BIO-01a: Biometric Registration Dialog */}
      {showBioDialog && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center">
          {/* Dim backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Bottom sheet dialog */}
          <div className="relative w-full bg-white rounded-t-2xl px-6 pt-6 pb-10 animate-slide-up">
            <h3 className="text-[18px] font-bold text-text-dark mb-2">
              {t('bio_register_title')}
            </h3>
            <p className="text-[13px] text-text-gray leading-relaxed mb-8">
              {t('bio_register_desc')}
            </p>

            <div className="flex gap-3">
              <button
                onClick={goHome}
                className="flex-1 py-3.5 bg-gray-100 rounded-xl text-[15px] font-semibold text-text-dark active:bg-gray-200"
              >
                {t('bio_skip')}
              </button>
              <button
                onClick={goHome}
                className="flex-1 py-3.5 bg-gray-900 rounded-xl text-[15px] font-semibold text-white active:bg-gray-700"
              >
                {t('bio_register')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
