import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'
import { ArrowLeft, Check, Phone, Loader2, CheckCircle, ChevronDown, ChevronRight, ChevronUp, X } from 'lucide-react'

type OtpState = 'idle' | 'sending' | 'input' | 'verifying' | 'done'

const CARRIERS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LG U+', label: 'LG U+' },
  { value: 'SKT 알뜰폰', label: 'SKT 알뜰폰' },
  { value: 'KT 알뜰폰', label: 'KT 알뜰폰' },
  { value: 'LG U+ 알뜰폰', label: 'LG U+ 알뜰폰' },
]

// Term item keys per group
const GROUP1_ITEMS = ['reg_terms_g1_item1', 'reg_terms_g1_item2', 'reg_terms_g1_item3', 'reg_terms_g1_item4'] as const
const GROUP2_ITEMS = ['reg_terms_g2_item1', 'reg_terms_g2_item2', 'reg_terms_g2_item3', 'reg_terms_g2_item4'] as const
const ALL_ITEMS = [...GROUP1_ITEMS, ...GROUP2_ITEMS]

export default function Login() {
  const { login, updateProfile, pinSet, pin, userType } = useStore()
  const navigate = useNavigate()
  const t = useT()

  // Form state
  const [name, setName] = useState('')
  const [idFront, setIdFront] = useState('')
  const [idBack, setIdBack] = useState('')
  const [carrier, setCarrier] = useState('')
  const [showCarrierSheet, setShowCarrierSheet] = useState(false)
  const [phone, setPhone] = useState('')

  // Terms state
  const [showTerms, setShowTerms] = useState(false)
  const [agreedItems, setAgreedItems] = useState<Set<string>>(new Set())
  const [expandedGroup, setExpandedGroup] = useState<'group1' | 'group2' | null>(null)

  // OTP state
  const [otpState, setOtpState] = useState<OtpState>('idle')
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)

  const nationalId = idFront && idBack ? `${idFront}-${idBack}000000` : ''
  const canVerify = name.trim().length > 0 && idFront.length === 6 && idBack.length === 1 && carrier !== '' && phone.replace(/[^0-9]/g, '').length >= 10

  // Terms logic
  const allGroup1Agreed = GROUP1_ITEMS.every(k => agreedItems.has(k))
  const allGroup2Agreed = GROUP2_ITEMS.every(k => agreedItems.has(k))
  const allAgreed = ALL_ITEMS.every(k => agreedItems.has(k))
  const canAgree = allAgreed

  // Returning user check
  const isReturning = pinSet && pin !== '' && userType
  if (isReturning) {
    login('phone')
    navigate('/home', { replace: true })
    return null
  }

  const formatPhone = (value: string) => {
    const nums = value.replace(/[^0-9]/g, '').slice(0, 11)
    if (nums.length <= 3) return nums
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
  }

  // Toggle a single term item
  const toggleItem = (key: string) => {
    setAgreedItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Toggle entire group
  const toggleGroup = (items: readonly string[]) => {
    const allChecked = items.every(k => agreedItems.has(k))
    setAgreedItems(prev => {
      const next = new Set(prev)
      items.forEach(k => { if (allChecked) next.delete(k); else next.add(k) })
      return next
    })
  }

  // Toggle all
  const toggleAll = () => {
    if (allAgreed) {
      setAgreedItems(new Set())
    } else {
      setAgreedItems(new Set(ALL_ITEMS))
    }
  }

  // Expand/collapse group (only one open at a time)
  const handleExpandGroup = (group: 'group1' | 'group2') => {
    setExpandedGroup(prev => prev === group ? null : group)
  }

  const handleVerifyTap = () => {
    if (!canVerify) return
    setShowTerms(true)
  }

  const handleTermsAgree = () => {
    if (!canAgree) return
    setShowTerms(false)
    // Start OTP
    setOtpState('sending')
    setTimeout(() => {
      setOtpState('input')
      setOtpTimer(180)
      setTimeout(() => setOtpCode('123456'), 2000)
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
      toast(t('otp_success'), 'success')
      setTimeout(() => {
        setOtpState('idle')
        login('phone')
        updateProfile({ name: name.trim(), phone: phone.replace(/[^0-9]/g, ''), residenceId: nationalId })
        navigate('/onboarding-bank')
      }, 800)
    }, 1000)
  }

  const sendOtp = () => {
    setOtpState('sending')
    setTimeout(() => {
      setOtpState('input')
      setOtpTimer(180)
      setTimeout(() => setOtpCode('123456'), 2000)
      const interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  // Checkbox component
  const Checkbox = ({ checked, size = 20 }: { checked: boolean; onToggle: () => void; size?: number }) => (
    <div className="flex-shrink-0">
      <div className={`w-${size === 24 ? 6 : 5} h-${size === 24 ? 6 : 5} rounded-full flex items-center justify-center transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`} style={{ width: size, height: size }}>
        <Check size={size * 0.6} className="text-white" strokeWidth={3} />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Back Button */}
      <div className="px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line mb-2">
          {t('reg_heading')}
        </h2>
        <p className="text-sm text-text-gray mb-8">{t('reg_desc')}</p>

        {/* 1. Name */}
        <div className="mb-5">
          <label className="text-xs text-text-gray mb-1.5 block">{t('reg_name')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.slice(0, 50))}
            placeholder={t('reg_name_placeholder')}
            maxLength={50}
            className="w-full py-3 border-b-2 border-border text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none transition-all"
          />
        </div>

        {/* 2. National ID */}
        <div className="mb-5">
          <label className="text-xs text-text-gray mb-1.5 block">{t('national_id')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={idFront}
              onChange={e => setIdFront(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="생년월일 6자리"
              className="flex-1 py-3 border-b-2 border-border text-base text-text-dark font-mono placeholder:text-text-light focus:border-primary focus:outline-none transition-all tracking-wider"
            />
            <span className="text-text-light text-lg font-bold">-</span>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={idBack}
                onChange={e => setIdBack(e.target.value.replace(/[^0-9]/g, '').slice(0, 1))}
                placeholder="0"
                className="w-8 py-3 border-b-2 border-border text-base text-text-dark font-mono placeholder:text-text-light focus:border-primary focus:outline-none transition-all text-center"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-text-dark" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Carrier */}
        <div className="mb-5">
          <label className="text-xs text-text-gray mb-1.5 block">{t('mobile_carrier')}</label>
          <button
            onClick={() => setShowCarrierSheet(true)}
            className="w-full flex items-center justify-between py-3 border-b-2 border-border text-left transition-all"
          >
            <span className={`text-base ${carrier ? 'text-text-dark' : 'text-text-light'}`}>
              {carrier || t('mobile_carrier_select')}
            </span>
            <ChevronDown size={18} className="text-text-gray" />
          </button>
        </div>

        {/* 4. Phone */}
        <div className="mb-5">
          <label className="text-xs text-text-gray mb-1.5 block">{t('signup_phone')}</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder={t('reg_phone_placeholder')}
            maxLength={13}
            className="w-full py-3 border-b-2 border-border text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleVerifyTap}
          disabled={!canVerify}
          className={`w-full py-4 font-semibold rounded-xl transition-colors
            ${canVerify
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {t('reg_verify_btn')}
        </button>
      </div>

      {/* ===== Terms Bottom Sheet ===== */}
      {showTerms && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTerms(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up flex flex-col" style={{ maxHeight: '85vh' }}>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-text-dark leading-snug whitespace-pre-line">
                {t('reg_terms_title')}
              </h3>
              <button onClick={() => setShowTerms(false)} className="p-1 -mr-1 active:bg-gray-100 rounded-full flex-shrink-0 mt-0.5">
                <X size={20} className="text-text-gray" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5">
              {/* Agree All */}
              <button onClick={toggleAll} className="w-full flex items-center gap-3 py-3 mb-2">
                <Checkbox checked={allAgreed} onToggle={toggleAll} size={24} />
                <span className="text-base font-semibold text-text-dark">{t('reg_terms_agree_all')}</span>
              </button>

              <div className="border-t border-border" />

              {/* Group 1: 비플월렛 필수항목 */}
              <div className="mt-3">
                <button
                  onClick={() => { toggleGroup(GROUP1_ITEMS); if (!allGroup1Agreed) handleExpandGroup('group1') }}
                  className="w-full flex items-center gap-3 py-3"
                >
                  <Checkbox checked={allGroup1Agreed} onToggle={() => toggleGroup(GROUP1_ITEMS)} />
                  <span className="flex-1 text-sm font-semibold text-text-dark text-left">{t('reg_terms_group1')}</span>
                  <span
                    role="button"
                    onClick={e => { e.stopPropagation(); handleExpandGroup('group1') }}
                    className="p-1"
                  >
                    {expandedGroup === 'group1' ? <ChevronUp size={16} className="text-text-gray" /> : <ChevronDown size={16} className="text-text-gray" />}
                  </span>
                </button>

                {expandedGroup === 'group1' && (
                  <div className="ml-2 mb-2 animate-fade-in">
                    {GROUP1_ITEMS.map(key => (
                      <div key={key} className="flex items-center gap-3 py-2.5">
                        <Checkbox checked={agreedItems.has(key)} onToggle={() => toggleItem(key)} size={18} />
                        <span className="flex-1 text-sm text-text-dark">{t(key)}</span>
                        <ChevronRight size={14} className="text-text-light" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 2: 본인 인증 필수항목 */}
              <div className="mt-1">
                <button
                  onClick={() => { toggleGroup(GROUP2_ITEMS); if (!allGroup2Agreed) handleExpandGroup('group2') }}
                  className="w-full flex items-center gap-3 py-3"
                >
                  <Checkbox checked={allGroup2Agreed} onToggle={() => toggleGroup(GROUP2_ITEMS)} />
                  <span className="flex-1 text-sm font-semibold text-text-dark text-left">{t('reg_terms_group2')}</span>
                  <span
                    role="button"
                    onClick={e => { e.stopPropagation(); handleExpandGroup('group2') }}
                    className="p-1"
                  >
                    {expandedGroup === 'group2' ? <ChevronUp size={16} className="text-text-gray" /> : <ChevronDown size={16} className="text-text-gray" />}
                  </span>
                </button>

                {expandedGroup === 'group2' && (
                  <div className="ml-2 mb-2 animate-fade-in">
                    {GROUP2_ITEMS.map(key => (
                      <div key={key} className="flex items-center gap-3 py-2.5">
                        <Checkbox checked={agreedItems.has(key)} onToggle={() => toggleItem(key)} size={18} />
                        <span className="flex-1 text-sm text-text-dark">{t(key)}</span>
                        <ChevronRight size={14} className="text-text-light" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Agree Button */}
            <div className="px-5 pb-8 pt-4">
              <button
                onClick={handleTermsAgree}
                disabled={!canAgree}
                className={`w-full py-4 font-semibold rounded-xl transition-colors
                  ${canAgree
                    ? 'bg-primary text-white active:bg-primary-dark'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {t('reg_terms_agree_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Carrier Bottom Sheet ===== */}
      {showCarrierSheet && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCarrierSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up max-h-[60vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-4 pb-2 border-b border-border">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <h3 className="text-base font-semibold text-text-dark">{t('mobile_carrier')}</h3>
            </div>
            <div className="py-2">
              {CARRIERS.map(c => (
                <button
                  key={c.value}
                  onClick={() => { setCarrier(c.value); setShowCarrierSheet(false) }}
                  className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
                >
                  <span className={`text-base ${carrier === c.value ? 'text-primary font-semibold' : 'text-text-dark'}`}>
                    {c.label}
                  </span>
                  {carrier === c.value && <Check size={20} className="text-primary" />}
                </button>
              ))}
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* ===== OTP Modal ===== */}
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
