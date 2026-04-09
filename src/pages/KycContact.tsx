import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft, ChevronDown, Loader2, Check } from 'lucide-react'

type Tab = 'email' | 'phone'

const COUNTRY_CODES = [
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
]

export default function KycContact() {
  const navigate = useNavigate()
  const t = useT()

  const [tab, setTab] = useState<Tab>('email')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0])
  const [showCountrySheet, setShowCountrySheet] = useState(false)
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)

  // Validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const phoneValid = phone.replace(/[^0-9]/g, '').length >= 8
  const canSend = tab === 'email' ? emailValid : phoneValid

  const formatPhone = (value: string) => {
    const nums = value.replace(/[^0-9]/g, '').slice(0, 11)
    if (nums.length <= 3) return nums
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
  }

  const handleSendCode = () => {
    if (!canSend || sending) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast(t('kyc_contact_code_sent'), 'success')
      const contactValue = tab === 'email' ? email : `${countryCode.code} ${phone}`
      navigate('/kyc-contact-verify', {
        state: { contactType: tab, contactValue }
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-border">
        <button onClick={() => navigate('/account-check')} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
        <h1 className="flex-1 text-center text-[15px] font-semibold text-text-dark mr-6">
          {t('kyc_contact_header')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        {/* Title */}
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line mb-2">
          {t('kyc_contact_heading')}
        </h2>
        <p className="text-sm text-text-gray mb-6">{t('kyc_contact_desc')}</p>

        {/* Tabs */}
        <div className="flex border border-border rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => setTab('email')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-colors ${
              tab === 'email' ? 'bg-text-dark text-white' : 'bg-white text-text-dark'
            }`}
          >
            {t('kyc_contact_tab_email')}
          </button>
          <button
            onClick={() => setTab('phone')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-colors ${
              tab === 'phone' ? 'bg-text-dark text-white' : 'bg-white text-text-dark'
            }`}
          >
            {t('kyc_contact_tab_phone')}
          </button>
        </div>

        {/* Email Tab */}
        {tab === 'email' && (
          <div className="animate-fade-in">
            <label className="text-xs text-text-gray mb-1.5 block">{t('kyc_contact_email_label')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('kyc_contact_email_placeholder')}
              className="w-full px-4 py-3.5 border border-border rounded-xl text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <p className="text-xs text-text-gray mt-2">{t('kyc_contact_email_hint')}</p>
          </div>
        )}

        {/* Phone Tab */}
        {tab === 'phone' && (
          <div className="animate-fade-in">
            {/* Country Code */}
            <label className="text-xs text-text-gray mb-1.5 block">{t('kyc_contact_country_label')}</label>
            <button
              onClick={() => setShowCountrySheet(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 border border-border rounded-xl mb-4 transition-all active:bg-gray-50"
            >
              <span className="text-base text-text-dark">
                {countryCode.flag} {countryCode.code} ({countryCode.country})
              </span>
              <ChevronDown size={18} className="text-text-gray" />
            </button>

            {/* Phone Number */}
            <label className="text-xs text-text-gray mb-1.5 block">{t('kyc_contact_phone_label')}</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              placeholder={t('kyc_contact_phone_placeholder')}
              maxLength={13}
              className="w-full px-4 py-3.5 border border-border rounded-xl text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <p className="text-xs text-text-gray mt-2">{t('kyc_contact_phone_hint')}</p>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleSendCode}
          disabled={!canSend || sending}
          className={`w-full py-4 font-semibold rounded-xl transition-colors
            ${canSend && !sending
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {sending
            ? <Loader2 size={20} className="animate-spin mx-auto" />
            : t('kyc_contact_send_code')
          }
        </button>
      </div>

      {/* Country Code Bottom Sheet */}
      {showCountrySheet && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCountrySheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up max-h-[60vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-4 pb-2 border-b border-border">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <h3 className="text-base font-semibold text-text-dark">{t('kyc_contact_country_label')}</h3>
            </div>
            <div className="py-2">
              {COUNTRY_CODES.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCountryCode(c); setShowCountrySheet(false) }}
                  className="w-full flex items-center justify-between px-5 py-3.5 active:bg-gray-50 transition-colors"
                >
                  <span className={`text-base ${countryCode.code === c.code ? 'text-primary font-semibold' : 'text-text-dark'}`}>
                    {c.flag} {c.code} ({c.country})
                  </span>
                  {countryCode.code === c.code && <Check size={20} className="text-primary" />}
                </button>
              ))}
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}
    </div>
  )
}
