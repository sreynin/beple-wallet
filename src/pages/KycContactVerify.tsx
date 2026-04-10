import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore, type Language } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft } from 'lucide-react'

const CODE_LENGTH = 6
const TIMER_SECONDS = 180

export default function KycContactVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateProfile, userType } = useStore()
  const t = useT()

  const { contactType, contactValue } = (location.state as { contactType: 'email' | 'phone'; contactValue: string }) || { contactType: 'email', contactValue: '' }

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [verifying, setVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const code = digits.join('')
  const canConfirm = code.length === CODE_LENGTH
  const timerExpired = timer <= 0

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Simulate auto-fill after 2s
  useEffect(() => {
    const timeout = setTimeout(() => {
      const simCode = '123456'.split('')
      setDigits(simCode)
      // Focus last box
      inputRefs.current[CODE_LENGTH - 1]?.focus()
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    // Auto-advance to next box
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move back on backspace when current box is empty
      const newDigits = [...digits]
      newDigits[index - 1] = ''
      setDigits(newDigits)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const newDigits = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((d, i) => { newDigits[i] = d })
    setDigits(newDigits)
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const handleConfirm = useCallback(() => {
    if (!canConfirm || verifying || timerExpired) return
    setVerifying(true)
    setTimeout(() => {
      // Simulate verification (accept 123456)
      if (code === '123456') {
        toast(t('kyc_contact_code_sent'), 'success')
        if (contactType === 'email') {
          updateProfile({ email: contactValue })
        } else {
          updateProfile({ phone: contactValue })
        }
        // Domestic → bank setup, Foreigner → Terms → KYC start
        if (userType === 'domestic') {
          navigate('/onboarding-bank', { replace: true })
        } else {
          navigate('/terms', { replace: true, state: { flow: 'kyc' } })
        }
      } else {
        toast(t('kyc_contact_verify_fail'), 'error')
        setDigits(Array(CODE_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
        setVerifying(false)
      }
    }, 1000)
  }, [canConfirm, verifying, timerExpired, code, contactType, contactValue, navigate, t, updateProfile])

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(''))
    setTimer(TIMER_SECONDS)
    inputRefs.current[0]?.focus()
    toast(t('kyc_contact_code_sent'), 'success')
    // Simulate auto-fill again
    setTimeout(() => {
      const simCode = '123456'.split('')
      setDigits(simCode)
      inputRefs.current[CODE_LENGTH - 1]?.focus()
    }, 2000)
  }

  const formatTimer = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, '0')
    const s = String(timer % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
        <h1 className="flex-1 text-center text-[15px] font-semibold text-text-dark mr-6">
          {t('kyc_contact_verify_header')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 overflow-y-auto">
        {/* Title */}
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line mb-2">
          {t('kyc_contact_verify_title')}
        </h2>

        {/* Sent info */}
        <p className="text-sm text-text-gray mb-1">{contactValue}</p>
        <p className="text-sm text-text-gray mb-8">
          {contactType === 'email' ? t('kyc_contact_verify_sent_email') : t('kyc_contact_verify_sent_phone')}
        </p>

        {/* OTP Input Boxes */}
        <div className="flex gap-2.5 mb-4" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-full aspect-square max-w-[50px] border-2 rounded-xl text-center text-xl font-bold text-text-dark transition-all focus:outline-none
                ${digit
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white focus:border-primary'
                }`}
            />
          ))}
        </div>

        {/* Timer + Resend */}
        <div className="flex flex-col items-start gap-2">
          <span className={`text-sm font-semibold ${timerExpired ? 'text-red-500' : 'text-red-500'}`}>
            {timerExpired ? t('kyc_contact_verify_expired') : formatTimer()}
          </span>
          <button onClick={handleResend} className="text-sm text-primary font-medium underline">
            {t('kyc_contact_verify_resend')}
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleConfirm}
          disabled={!canConfirm || verifying || timerExpired}
          className={`w-full py-4 font-semibold rounded-xl transition-colors
            ${canConfirm && !verifying && !timerExpired
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {t('kyc_contact_verify_btn')}
        </button>
      </div>
    </div>
  )
}
