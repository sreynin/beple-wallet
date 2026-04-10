import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PinInput } from '../components/PinInput'
import { Modal } from '../components/Modal'
import { FaceIdScreen } from '../components/FaceIdScreen'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet, setFaceIdEnabled } = useStore()
  const t = useT()
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')
  const [showFaceId, setShowFaceId] = useState(false)
  const [showFaceIdScreen, setShowFaceIdScreen] = useState(false)

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
        setShowFaceId(true)
      } else {
        setError(t('pin_mismatch'))
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  const handleFaceIdUse = () => {
    setFaceIdEnabled(true)
    setShowFaceId(false)
    setShowFaceIdScreen(true)
  }

  const handleFaceIdSkip = () => {
    setFaceIdEnabled(false)
    setShowFaceId(false)
    goNext()
  }

  const handleClose = () => {
    navigate(-1)
  }

  // FaceID scanning screen
  if (showFaceIdScreen) {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white">
        <FaceIdScreen onComplete={goNext} onCancel={() => { setShowFaceIdScreen(false) }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <PinInput
        title={step === 'create' ? t('pin_enter') : t('pin_reenter')}
        subtitle={step === 'create' ? t('pin_used_for') : t('pin_reenter_desc')}
        error={error}
        onComplete={handleComplete}
        onClose={handleClose}
      />

      {/* FaceID Modal */}
      <Modal open={showFaceId} onClose={handleFaceIdSkip}>
        <div className="text-center">
          <h3 className="text-base font-bold text-text-dark mb-3">
            FaceID(으)로 로그인 하시겠습니까?
          </h3>
          <p className="text-sm text-text-gray leading-relaxed mb-6">
            간편비밀번호 대신 FaceID(으)로<br/>로그인하시겠습니까?
          </p>
          <div className="flex gap-3">
            <button onClick={handleFaceIdSkip}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-text-gray">
              사용안함
            </button>
            <button onClick={handleFaceIdUse}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold">
              FaceID 사용
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
