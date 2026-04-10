import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PinInput } from '../components/PinInput'
import { StepIndicator } from '../components/StepIndicator'
import { Modal } from '../components/Modal'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle } from 'lucide-react'

function FaceScanIcon() {
  return (
    <div className="w-20 h-20 rounded-2xl bg-[#1a2332] flex items-center justify-center">
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none"
        stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Corner brackets */}
        <path d="M6 16 V8 Q6 6 8 6 H16" />
        <path d="M32 6 H40 Q42 6 42 8 V16" />
        <path d="M42 32 V40 Q42 42 40 42 H32" />
        <path d="M16 42 H8 Q6 42 6 40 V32" />
        {/* Eyes */}
        <line x1="18" y1="18" x2="18" y2="22" strokeWidth="2.5" />
        <line x1="30" y1="18" x2="30" y2="22" strokeWidth="2.5" />
        {/* Nose */}
        <path d="M24 20 L24 28" strokeWidth="1.5" />
        {/* Smile */}
        <path d="M17 32 Q24 38 31 32" strokeWidth="2" />
      </svg>
    </div>
  )
}

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet, setFaceIdEnabled } = useStore()
  const t = useT()
  const [step, setStep] = useState<'create' | 'confirm' | 'faceid' | 'scanning' | 'scan-done'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')

  const navState = (location.state || {}) as { flow?: 'signup' | 'reset' }
  const flow = navState.flow
  const isSignupFlow = flow === 'signup' ? true : flow === 'reset' ? false : !pinSet

  const goNext = () => {
    if (flow === 'signup') {
      navigate('/home', { replace: true })
    } else if (flow === 'reset') {
      navigate(-1)
    } else if ((location.state as any)?.from === 'payment') {
      navigate('/payment-pin', { replace: true })
    } else if ((location.state as any)?.from === 'settings') {
      navigate(-1)
    } else {
      navigate('/home', { replace: true })
    }
  }

  const handleComplete = (pin: string) => {
    if (step === 'create') {
      setFirstPin(pin)
      setStep('confirm')
      setError('')
    } else if (step === 'confirm') {
      if (pin === firstPin) {
        setPin(pin)
        if (isSignupFlow) {
          setStep('faceid')
        } else {
          goNext()
        }
      } else {
        setError(t('pin_mismatch'))
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  // Face scan simulation
  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => setStep('scan-done'), 2500)
      return () => clearTimeout(timer)
    }
    if (step === 'scan-done') {
      const timer = setTimeout(() => goNext(), 1500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleFaceIdChoice = (useFaceId: boolean) => {
    if (useFaceId) {
      setFaceIdEnabled(true)
      setStep('scanning')
    } else {
      setFaceIdEnabled(false)
      goNext()
    }
  }

  // ── Face scanning screen ──
  if (step === 'scanning' || step === 'scan-done') {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {step === 'scanning' ? (
            <>
              <div className="animate-pulse">
                <FaceScanIcon />
              </div>
              <h2 className="text-lg font-bold text-text-dark mt-8">얼굴 인식 중...</h2>
              <p className="text-sm text-text-gray mt-2">카메라를 바라봐 주세요</p>
            </>
          ) : (
            <>
              <div className="animate-bounce-in">
                <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center">
                  <CheckCircle size={40} className="text-white" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-lg font-bold text-text-dark mt-8">얼굴 인식 완료</h2>
              <p className="text-sm text-text-gray mt-2">FaceID가 등록되었습니다</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {isSignupFlow && (
        <div className="px-6 pt-3">
          <StepIndicator current={3} />
        </div>
      )}
      <PinInput
        title={step === 'create' ? t('pin_enter') : step === 'confirm' ? t('pin_reenter') : ''}
        subtitle={step === 'create' ? t('pin_used_for') : step === 'confirm' ? t('pin_reenter_desc') : ''}
        error={error}
        onComplete={handleComplete}
        variant="light"
      />

      {/* FaceID Prompt — shows after PIN confirmed */}
      <Modal open={step === 'faceid'} onClose={() => handleFaceIdChoice(false)}>
        <div className="flex flex-col items-center">
          <h3 className="text-base font-semibold text-text-dark text-center mb-3">
            FaceID(으)로 로그인 하시겠습니까?
          </h3>
          <p className="text-sm text-text-gray text-center mb-6">
            간편비밀번호 대신 FaceID(으)로 로그인하시겠습니까?
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleFaceIdChoice(false)}
              className="flex-1 py-3 bg-gray-100 text-text-dark font-medium rounded-xl text-sm"
            >
              사용안함
            </button>
            <button
              onClick={() => handleFaceIdChoice(true)}
              className="flex-1 py-3 bg-primary text-white font-medium rounded-xl text-sm"
            >
              FaceID 사용
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
