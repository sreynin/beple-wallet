import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle, Loader2, Phone, Check, Landmark, BarChart3, ChevronRight, Info } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'

const banks = [
  { id: 'nh', name: '농협은행', bg: '#FFF3E0' },
  { id: 'woori', name: '우리은행', bg: '#E3F2FD' },
  { id: 'kb', name: '국민은행', bg: '#FFF8E1' },
  { id: 'shinhan', name: '신한은행', bg: '#E8EAF6' },
  { id: 'hana', name: '하나은행', bg: '#E0F2F1' },
  { id: 'ibk', name: '기업은행', bg: '#E3F2FD' },
  { id: 'busan', name: '부산은행', bg: '#FFEBEE' },
  { id: 'post', name: '우체국', bg: '#FFF8E1' },
  { id: 'im', name: 'iM뱅크', bg: '#E0F2F1' },
  { id: 'saemaul', name: '새마을금고', bg: '#F0F0F0' },
  { id: 'gwangju', name: '광주은행', bg: '#FFF3E0' },
  { id: 'sc', name: 'SC제일은행', bg: '#E0F7FA' },
  { id: 'gyeongnam', name: '경남은행', bg: '#FFEBEE' },
  { id: 'citi', name: '씨티은행', bg: '#F0F0F0' },
  { id: 'shinhyup', name: '신협', bg: '#E8F5E9' },
  { id: 'jeonbuk', name: '전북은행', bg: '#E3F2FD' },
  { id: 'suhyup', name: '수협은행', bg: '#E3F2FD' },
  { id: 'jeju', name: '제주은행', bg: '#F0F0F0' },
  { id: 'kdb', name: '산업은행', bg: '#E3F2FD' },
  { id: 'kbank', name: '케이뱅크', bg: '#F5F5F5' },
  { id: 'kakao', name: '카카오뱅크', bg: '#FFF9C4' },
  { id: 'toss', name: '토스뱅크', bg: '#E3F2FD' },
  { id: 'sanlim', name: '산림조합중앙회', bg: '#E8F5E9' },
  { id: 'savings', name: '저축은행중앙회', bg: '#E3F2FD' },
]

/* ── Bank logo: loads PNG from /banks/{id}.png, falls back to styled text ── */
function BankLogo({ id, size = 32 }: { id: string; size?: number }) {
  return (
    <img
      src={`/banks/${id}.png`}
      alt=""
      width={size}
      height={size}
      className="object-contain"
      onError={(e) => {
        // Hide broken image, parent bg color still shows bank identity
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

type AccountType = 'bank' | 'korbit'
type Step = 'type-select' | 'bank-select' | 'form' | 'ars' | 'verifying' | 'done' | 'korbit-connect' | 'korbit-verifying' | 'korbit-done'

export default function OnboardingBank() {
  const navigate = useNavigate()
  const { addBankAccount, bankAccounts, connectKorbit, profile, kycData } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('type-select')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [selBank, setSelBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [arsCode] = useState(String(Math.floor(Math.random() * 90 + 10)))

  const goNext = () => navigate('/pin-setup', { state: { flow: 'signup' } })

  // Pre-fill name from profile or KYC data
  const getPrefilledName = () => {
    if (profile.name) return profile.name
    if (kycData.surname && kycData.givenName) return `${kycData.surname} ${kycData.givenName}`
    return ''
  }

  const handleBankComplete = () => {
    const bank = banks.find(b => b.id === selBank)
    if (bank) {
      addBankAccount({
        bankName: bank.name,
        accountNumber: accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3'),
        holderName: holderName || getPrefilledName(),
        isDefault: bankAccounts.length === 0,
      })
    }
    setStep('done')
  }

  const handleKorbitConnect = () => {
    navigate('/charge-korbit-onboarding', { state: { fromOnboarding: true } })
  }

  // === Type Select (Bank Account or Korbit) ===
  if (step === 'type-select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('onboarding_bank_title')} />
      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <StepIndicator current={2} />
        <h2 className="text-lg font-bold text-text-dark mb-1">{t('onboarding_type_heading')}</h2>
        <p className="text-sm text-text-gray mb-6">{t('onboarding_type_desc')}</p>

        <div className="space-y-3">
          {/* Bank Account */}
          <button onClick={() => setAccountType('bank')}
            className={`w-full flex items-center gap-4 p-5 border-2 rounded-2xl transition-all ${
              accountType === 'bank' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Landmark size={24} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className={`font-semibold text-sm ${accountType === 'bank' ? 'text-primary' : 'text-text-dark'}`}>{t('onboarding_type_bank')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('onboarding_type_bank_desc')}</p>
            </div>
            {accountType === 'bank' && <Check size={20} className="text-primary" />}
          </button>

          {/* Korbit */}
          <button onClick={() => setAccountType('korbit')}
            className={`w-full flex items-center gap-4 p-5 border-2 rounded-2xl transition-all ${
              accountType === 'korbit' ? 'border-[#0052FF] bg-[#0052FF]/5' : 'border-border'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={24} className="text-[#0052FF]" />
            </div>
            <div className="text-left flex-1">
              <p className={`font-semibold text-sm ${accountType === 'korbit' ? 'text-[#0052FF]' : 'text-text-dark'}`}>{t('onboarding_type_korbit')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('onboarding_type_korbit_desc')}</p>
            </div>
            {accountType === 'korbit' && <Check size={20} className="text-[#0052FF]" />}
          </button>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => accountType === 'korbit' ? navigate('/charge-korbit-onboarding', { state: { fromOnboarding: true } }) : setStep('bank-select')} disabled={!accountType}
          className={`w-full py-4 font-semibold rounded-xl ${accountType ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: Select Bank (3-column card grid) ===
  if (step === 'bank-select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('ob_bank_register_title')} onBack={() => setStep('type-select')} />
      <div className="flex-1 px-5 pt-5 overflow-y-auto pb-4">
        <h2 className="text-base font-bold text-text-dark mb-5">{t('ob_bank_select_heading')}</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {banks.map(bank => (
            <button key={bank.id} onClick={() => setSelBank(bank.id)}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all ${
                selBank === bank.id
                  ? 'bg-primary/5 ring-2 ring-primary'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bank.bg }}>
                <BankLogo id={bank.id} size={32} />
              </div>
              <span className={`text-[10px] leading-tight text-center font-medium ${
                selBank === bank.id ? 'text-primary' : 'text-text-dark'
              }`}>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => {
          if (!holderName) setHolderName(getPrefilledName())
          setStep('form')
        }} disabled={!selBank}
          className={`w-full py-4 font-semibold rounded-xl ${selBank ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: Account Form (Redesigned) ===
  if (step === 'form') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('ob_bank_register_title')} onBack={() => setStep('bank-select')} />
      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        {/* Heading */}
        <h2 className="text-base font-bold text-text-dark mb-1 whitespace-pre-line">{t('ob_form_heading')}</h2>

        <div className="mt-6 space-y-5">
          {/* Bank Name (read-only) */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('ob_form_bank_name')}</label>
            <div className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark">
              {banks.find(b => b.id === selBank)?.name}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('ob_form_account_number')}</label>
            <input type="text" inputMode="numeric" value={accountNumber}
              onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder={t('ob_form_account_placeholder')}
              maxLength={14}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {/* Name (pre-filled) */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('ob_form_name')}</label>
            <input type="text" value={holderName}
              onChange={e => setHolderName(e.target.value)}
              placeholder={t('account_holder_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        {/* ARS Info Box */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex gap-3">
          <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-primary leading-relaxed">{t('ob_form_ars_info')}</p>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('ars')} disabled={!accountNumber || !holderName || accountNumber.length < 8}
          className={`w-full py-4 font-semibold rounded-xl ${
            accountNumber && holderName && accountNumber.length >= 8 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
          }`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: ARS ===
  if (step === 'ars') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_account_ars')} onBack={() => setStep('form')} />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Phone size={36} className="text-primary" /></div>
        <p className="text-base font-semibold text-text-dark text-center mb-2">{t('settings_account_ars')}</p>
        <p className="text-sm text-text-gray text-center mb-6">{t('settings_account_ars_desc')}</p>
        <div className="bg-primary/5 rounded-2xl px-8 py-4 mb-4">
          <p className="text-4xl font-bold text-primary text-center tracking-widest">{arsCode}</p>
        </div>
        <p className="text-xs text-text-gray text-center">{t('settings_account_ars_input')}</p>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => { setStep('verifying'); setTimeout(handleBankComplete, 2500) }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('settings_account_ars_btn')}</button>
      </div>
    </div>
  )

  // === Bank: Verifying ===
  if (step === 'verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('settings_account_ars_verifying')}</p>
    </div>
  )

  // === Bank: Done ===
  if (step === 'done') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('settings_account_done')}</p>
        <p className="text-sm text-text-gray mt-1">{t('settings_account_done_msg')}</p>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: banks.find(b => b.id === selBank)?.bg }}>
              <BankLogo id={selBank} size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">{banks.find(b => b.id === selBank)?.name}</p>
              <p className="text-xs text-text-gray">{accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3')} · {holderName}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={goNext} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
      </div>
    </div>
  )

  // === Korbit: Connect ===
  if (step === 'korbit-connect') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title="Korbit" onBack={() => setStep('type-select')} />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mb-6">
          <BarChart3 size={40} className="text-[#0052FF]" />
        </div>
        <h2 className="text-lg font-bold text-text-dark text-center mb-2">{t('onboarding_korbit_heading')}</h2>
        <p className="text-sm text-text-gray text-center mb-6">{t('onboarding_korbit_desc')}</p>

        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">1</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">2</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">3</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step3')}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={handleKorbitConnect}
          className="w-full py-4 bg-[#0052FF] text-white font-semibold rounded-xl active:bg-[#0040CC]">{t('onboarding_korbit_connect')}</button>
      </div>
    </div>
  )

  // === Korbit: Verifying ===
  if (step === 'korbit-verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-[#0052FF] animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('onboarding_korbit_connecting')}</p>
    </div>
  )

  // === Korbit: Done ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('onboarding_korbit_done')}</p>
        <p className="text-sm text-text-gray mt-1">{t('onboarding_korbit_done_desc')}</p>
        <div className="mt-4 bg-[#0052FF]/5 rounded-xl p-4 w-full flex items-center gap-3">
          <BarChart3 size={24} className="text-[#0052FF]" />
          <p className="text-sm font-semibold text-text-dark">Korbit</p>
          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-auto">{t('otp_verified')}</span>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={goNext} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
      </div>
    </div>
  )
}
