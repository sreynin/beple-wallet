import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { User, Phone, Mail, ChevronRight, Check } from 'lucide-react'

type Step = 'info' | 'pin-create' | 'pin-confirm'

export default function SignUp() {
  const navigate = useNavigate()
  const { login, updateProfile, setPin } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('info')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [pin, setPinValue] = useState('')
  const [pinError, setPinError] = useState('')

  const infoValid = fullName.trim().length >= 2 && phone.trim().length >= 8 && email.includes('@')

  const handleInfoNext = () => {
    if (!fullName.trim()) { toast(t('signup_name_required')); return }
    if (!phone.trim()) { toast(t('signup_phone_required')); return }
    if (!email.trim()) { toast(t('signup_email_required')); return }
    setStep('pin-create')
  }

  const handlePinKey = (key: string) => {
    if (step === 'pin-create') {
      if (key === 'del') { setFirstPin(p => p.slice(0, -1)); return }
      if (firstPin.length >= 6) return
      const next = firstPin + key
      setFirstPin(next)
      if (next.length === 6) {
        setTimeout(() => { setStep('pin-confirm') }, 300)
      }
    } else {
      if (key === 'del') { setPinValue(p => p.slice(0, -1)); setPinError(''); return }
      if (pin.length >= 6) return
      const next = pin + key
      setPinValue(next)
      if (next.length === 6) {
        setTimeout(() => {
          if (next === firstPin) {
            // Success — save everything
            updateProfile({ name: fullName.trim(), phone: phone.trim(), email: email.trim() })
            login('email')
            setPin(next)
            navigate('/terms')
          } else {
            setPinError(t('pin_mismatch'))
            setPinValue('')
            setTimeout(() => setPinError(''), 2000)
          }
        }, 300)
      }
    }
  }

  const currentPin = step === 'pin-create' ? firstPin : pin
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del']

  // === Step 1: Info Form ===
  if (step === 'info') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('signup_title')} />

      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</div>
            <span className="text-xs font-medium text-primary">{t('profile_basic_info')}</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-text-light text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-xs text-text-light">PIN</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-text-light text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-xs text-text-light">{t('terms_title')}</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-text-dark whitespace-pre-line">{t('signup_heading')}</h2>
        <p className="text-xs text-text-gray mt-1 mb-6">{t('signup_desc')}</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <User size={13} /> {t('signup_fullname')}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={t('signup_fullname_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Phone size={13} /> {t('signup_phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('signup_phone_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Mail size={13} /> {t('signup_email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('signup_email_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleInfoNext}
          disabled={!infoValid}
          className={`w-full py-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
            infoValid ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}
        >
          {t('signup_next')} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )

  // === Step 2 & 3: PIN Create / Confirm ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header
        title={t('pin_title')}
        onBack={() => {
          if (step === 'pin-confirm') { setPinValue(''); setPinError(''); setStep('pin-create'); setFirstPin('') }
          else { setStep('info') }
        }}
      />

      <div className="flex flex-col h-full">
        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center"><Check size={13} strokeWidth={3} /></div>
            <span className="text-xs text-green-600">{t('profile_basic_info')}</span>
          </div>
          <div className="flex-1 h-px bg-primary" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-xs font-medium text-primary">PIN</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-text-light text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-xs text-text-light">{t('terms_title')}</span>
          </div>
        </div>

        {/* PIN display */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <p className="text-sm text-text-gray mb-1">{fullName}</p>
          <h2 className="text-lg font-semibold text-text-dark text-center">
            {step === 'pin-create' ? t('pin_enter') : t('pin_reenter')}
          </h2>
          <p className="text-xs text-text-gray mt-1">
            {step === 'pin-create' ? t('pin_used_for') : t('pin_reenter_desc')}
          </p>

          <div className="flex gap-3 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  i < currentPin.length ? 'bg-primary scale-110' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {pinError && <p className="text-error text-sm mt-4 animate-fade-in">{pinError}</p>}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-0 bg-gray-50 border-t border-border">
          {keys.map((key, i) => (
            <button
              key={i}
              onClick={() => key && handlePinKey(key)}
              disabled={!key}
              className={`h-16 flex items-center justify-center text-xl font-medium transition-colors
                ${key === '' ? 'cursor-default' : 'active:bg-gray-200'}
                ${key === 'del' ? 'text-text-gray text-base' : 'text-text-dark'}
              `}
            >
              {key === 'del' ? t('pin_delete') : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
