import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft, ChevronDown, Loader2, Check } from 'lucide-react'

type Tab = 'email' | 'phone'

const COUNTRY_CODES = [
  { code: '+82', country: 'South Korea', localName: '대한민국', isoCode: 'KR', flag: '🇰🇷' },
  { code: '+1',  country: 'USA',         localName: '미국',    isoCode: 'US', flag: '🇺🇸' },
  { code: '+81', country: 'Japan',       localName: '일본',    isoCode: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'China',       localName: '중국',    isoCode: 'CN', flag: '🇨🇳' },
  { code: '+44', country: 'UK',          localName: '영국',    isoCode: 'GB', flag: '🇬🇧' },
  { code: '+49', country: 'Germany',     localName: '독일',    isoCode: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'France',      localName: '프랑스',  isoCode: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'Australia',   localName: '호주',    isoCode: 'AU', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore',   localName: '싱가포르',isoCode: 'SG', flag: '🇸🇬' },
  { code: '+84', country: 'Vietnam',     localName: '베트남',  isoCode: 'VN', flag: '🇻🇳' },
  { code: '+66', country: 'Thailand',    localName: '태국',    isoCode: 'TH', flag: '🇹🇭' },
  { code: '+63', country: 'Philippines', localName: '필리핀',  isoCode: 'PH', flag: '🇵🇭' },
  { code: '+855', country: 'Cambodia',    localName: '캄보디아',isoCode: 'KH', flag: '🇰🇭' },
  { code: '+62', country: 'Indonesia',   localName: '인도네시아',isoCode: 'ID', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia',    localName: '말레이시아',isoCode: 'MY', flag: '🇲🇾' },
  { code: '+95', country: 'Myanmar',     localName: '미얀마',  isoCode: 'MM', flag: '🇲🇲' },
  { code: '+856', country: 'Laos',        localName: '라오스',  isoCode: 'LA', flag: '🇱🇦' },
  { code: '+91', country: 'India',       localName: '인도',    isoCode: 'IN', flag: '🇮🇳' },
  { code: '+971', country: 'UAE',         localName: '아랍에미리트',isoCode: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia',localName: '사우디아라비아',isoCode: 'SA', flag: '🇸🇦' },
  { code: '+7',  country: 'Russia',      localName: '러시아',  isoCode: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil',      localName: '브라질',  isoCode: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico',      localName: '멕시코',  isoCode: 'MX', flag: '🇲🇽' },
  { code: '+234', country: 'Nigeria',     localName: '나이지리아',isoCode: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya',       localName: '케냐',    isoCode: 'KE', flag: '🇰🇪' },
  { code: '+27', country: 'South Africa',localName: '남아프리카',isoCode: 'ZA', flag: '🇿🇦' },
  { code: '+64', country: 'New Zealand', localName: '뉴질랜드',isoCode: 'NZ', flag: '🇳🇿' },
  { code: '+39', country: 'Italy',       localName: '이탈리아',isoCode: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'Spain',       localName: '스페인',  isoCode: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', localName: '네덜란드',isoCode: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden',      localName: '스웨덴',  isoCode: 'SE', flag: '🇸🇪' },
  { code: '+41', country: 'Switzerland', localName: '스위스',  isoCode: 'CH', flag: '🇨🇭' },
  { code: '+48', country: 'Poland',      localName: '폴란드',  isoCode: 'PL', flag: '🇵🇱' },
  { code: '+90', country: 'Turkey',      localName: '터키',    isoCode: 'TR', flag: '🇹🇷' },
  { code: '+20', country: 'Egypt',       localName: '이집트',  isoCode: 'EG', flag: '🇪🇬' },
  { code: '+880', country: 'Bangladesh',  localName: '방글라데시',isoCode: 'BD', flag: '🇧🇩' },
  { code: '+92', country: 'Pakistan',    localName: '파키스탄',isoCode: 'PK', flag: '🇵🇰' },
  { code: '+977', country: 'Nepal',       localName: '네팔',    isoCode: 'NP', flag: '🇳🇵' },
]

export default function KycContact() {
  const navigate = useNavigate()
  const t = useT()

  const [tab, setTab] = useState<Tab>('phone')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0])
  const [showCountrySheet, setShowCountrySheet] = useState(false)
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)

  // Validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const phoneValid = phone.replace(/[^0-9]/g, '').length >= 8

  // Numbers-only (no formatting dashes)
  const handlePhoneInput = (value: string) => {
    setPhone(value.replace(/[^0-9]/g, '').slice(0, 11))
  }
  const canSend = tab === 'email' ? emailValid : phoneValid

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

      {/* Back button only — no title bar */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate('/account-check')} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
          <ArrowLeft size={22} className="text-text-dark" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-2 overflow-y-auto">
        {/* Title — no subtitle */}
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line mb-8">
          {t('kyc_contact_heading')}
        </h2>

        {/* Tabs — underline style */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setTab('phone')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-colors relative ${
              tab === 'phone' ? 'text-text-dark' : 'text-text-gray'
            }`}
          >
            {t('kyc_contact_tab_phone')}
            {tab === 'phone' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-dark rounded-t" />
            )}
          </button>
          <button
            onClick={() => setTab('email')}
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-colors relative ${
              tab === 'email' ? 'text-text-dark' : 'text-text-gray'
            }`}
          >
            {t('kyc_contact_tab_email')}
            {tab === 'email' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-dark rounded-t" />
            )}
          </button>
        </div>

        {/* Email Tab */}
        {tab === 'email' && (
          <div className="animate-fade-in">
            <label className="text-xs text-text-gray mb-1 block">{t('kyc_contact_email_label')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('kyc_contact_email_placeholder')}
              className="w-full py-3 border-b border-border text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none bg-transparent transition-colors"
            />
            <p className="text-xs text-text-gray mt-2">{t('kyc_contact_email_hint')}</p>
          </div>
        )}

        {/* Phone Tab */}
        {tab === 'phone' && (
          <div className="animate-fade-in">
            {/* Country Code — bottom-line style */}
            <label className="text-xs text-text-gray mb-1 block">{t('kyc_contact_country_label')}</label>
            <button
              onClick={() => setShowCountrySheet(true)}
              className="w-full flex items-center justify-between py-3 border-b border-border mb-5 transition-colors active:opacity-70"
            >
              <span className="text-base text-text-dark">
                {countryCode.flag} {countryCode.localName} {countryCode.isoCode} {countryCode.code}
              </span>
              <ChevronDown size={18} className="text-text-gray" />
            </button>

            {/* Phone Number — bottom-line style */}
            <label className="text-xs text-text-gray mb-1 block">{t('kyc_contact_phone_label')}</label>
            <input
              type="tel"
              value={phone}
              onChange={e => handlePhoneInput(e.target.value)}
              placeholder={t('kyc_contact_phone_placeholder')}
              maxLength={11}
              className="w-full py-3 border-b border-border text-base text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none bg-transparent transition-colors"
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
                    {c.flag} {c.localName} {c.isoCode} {c.code}
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
