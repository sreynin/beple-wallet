import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'
import { AppLogo } from '../components/AppLogo'
import { User, Phone, ChevronRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

type OtpState = 'idle' | 'sending' | 'input' | 'verifying' | 'done'

export default function Login() {
  const { login, updateProfile, pinSet, pin, userType } = useStore()
  const navigate = useNavigate()
  const t = useT()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otpState, setOtpState] = useState<OtpState>('idle')
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [phoneVerified, setPhoneVerified] = useState(false)

  const phoneValid = phone.replace(/[^0-9]/g, '').length >= 8
  const canProceed = name.trim().length > 0 && phoneVerified

  // Returning user check
  const isReturning = pinSet && pin !== '' && userType
  if (isReturning) {
    // Auto-redirect returning users
    login('phone')
    navigate('/home', { replace: true })
    return null
  }

  const sendOtp = () => {
    if (!phoneValid) return
    setOtpState('sending')
    setTimeout(() => {
      setOtpState('input')
      setOtpTimer(180)
      // Auto-fill OTP after 2s (simulation)
      setTimeout(() => setOtpCode('123456'), 2000)
      // Start countdown
      const interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  const verifyOtp = () => {
    if (otpCode.length < 4) return
    setOtpState('verifying')
    setTimeout(() => {
      setOtpState('done')
      setPhoneVerified(true)
      toast(t('otp_success'), 'success')
      setTimeout(() => setOtpState('idle'), 800)
    }, 1000)
  }

  const handleNext = () => {
    login('phone')
    updateProfile({ name: name.trim(), phone })
    // Domestic → Bank setup, Foreigner → KYC passport
    if (userType === 'domestic') {
      navigate('/onboarding-bank')
    } else {
      navigate('/kyc-start')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 flex flex-col items-center px-6 pt-10 overflow-y-auto">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-5 shadow-lg shadow-primary/20 border border-border/40 p-2">
          <AppLogo size={72} />
        </div>
        <h1 className="text-2xl font-bold text-text-dark mb-1">{t('login_title')}</h1>
        <p className="text-sm text-text-gray mb-8">{t('login_subtitle')}</p>

        {/* Name Input */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('signup_fullname')}</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <User size={18} className={name ? 'text-primary' : 'text-text-light'} />
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('signup_fullname_placeholder')}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Phone Input + Verify */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('signup_phone')}</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Phone size={18} className={phone ? 'text-primary' : 'text-text-light'} />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setPhoneVerified(false) }}
              placeholder={t('signup_phone_placeholder')}
              className="w-full pl-12 pr-24 py-4 bg-gray-50 border-2 border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {phoneVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full">
                  <CheckCircle size={12} />{t('otp_verified')}
                </span>
              ) : (
                <button onClick={sendOtp} disabled={!phoneValid || otpState === 'sending'}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                    phoneValid ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
                  }`}>
                  {otpState === 'sending' ? <Loader2 size={14} className="animate-spin" /> : t('otp_send')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Verified badge */}
        {phoneVerified && (
          <div className="w-full flex items-center gap-2 px-1 mb-2 animate-fade-in">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-xs text-green-600 font-medium">{t('otp_phone_verified')}</span>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleNext} disabled={!canProceed}
          className={`w-full flex items-center justify-center gap-2 py-4 font-semibold rounded-xl transition-all ${
            canProceed ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
          }`}>
          <span>{t('next')}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* OTP Input Modal */}
      <Modal open={otpState === 'input' || otpState === 'verifying' || otpState === 'done'} onClose={() => { if (otpState === 'input') setOtpState('idle') }}>
        <div className="flex flex-col items-center">
          {otpState === 'done' ? (
            <div className="py-4 animate-fade-in">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <p className="text-base font-bold text-text-dark text-center">{t('otp_success')}</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Phone size={28} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-dark mb-1">{t('otp_enter')}</h3>
              <p className="text-xs text-text-gray mb-1">{phone}</p>
              {otpTimer > 0 && (
                <p className="text-xs text-primary font-medium mb-4">
                  {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                </p>
              )}

              <input
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-border rounded-xl text-center text-lg font-mono font-bold text-text-dark tracking-[0.3em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
              />

              <button onClick={verifyOtp} disabled={otpCode.length < 4 || otpState === 'verifying'}
                className={`w-full py-3.5 font-semibold rounded-xl ${
                  otpCode.length >= 4 && otpState !== 'verifying' ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
                }`}>
                {otpState === 'verifying' ? <Loader2 size={20} className="animate-spin mx-auto" /> : t('otp_verify')}
              </button>

              <button onClick={() => { setOtpCode(''); sendOtp() }} className="mt-3 text-xs text-primary font-medium">
                {t('otp_resend')}
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
