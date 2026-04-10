import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PinInput } from '../components/PinInput'
import { StepIndicator } from '../components/StepIndicator'
import { Modal } from '../components/Modal'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet, setFaceIdEnabled } = useStore()
  const t = useT()
  const [step, setStep] = useState<'faceid' | 'create' | 'confirm'>('faceid')
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
        goNext()
      } else {
        setError(t('pin_mismatch'))
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  const handleFaceIdChoice = (useFaceId: boolean) => {
    if (useFaceId) {
      setFaceIdEnabled(true)
      goNext()
    } else {
      setFaceIdEnabled(false)
      setStep('create')
    }
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

      {/* FaceID Prompt Modal — shows immediately on entry */}
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
