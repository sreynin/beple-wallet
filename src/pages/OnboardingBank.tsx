import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle, Loader2, Phone, Check, Landmark, BarChart3, ChevronRight } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'
import { PinInput } from '../components/PinInput'
import { Modal } from '../components/Modal'
import { FaceIdScreen } from '../components/FaceIdScreen'

const banks = [
  { id: 'nh', name: '농협은행', bg: '#F0F0F0' },
  { id: 'woori', name: '우리은행', bg: '#F0F0F0' },
  { id: 'kb', name: '국민은행', bg: '#F0F0F0' },
  { id: 'shinhan', name: '신한은행', bg: '#F0F0F0' },
  { id: 'hana', name: '하나은행', bg: '#F0F0F0' },
  { id: 'ibk', name: '기업은행', bg: '#F0F0F0' },
  { id: 'busan', name: '부산은행', bg: '#F0F0F0' },
  { id: 'post', name: '우체국', bg: '#F0F0F0' },
  { id: 'im', name: 'iM뱅크', bg: '#F0F0F0' },
  { id: 'saemaul', name: '새마을금고', bg: '#F0F0F0' },
  { id: 'gwangju', name: '광주은행', bg: '#F0F0F0' },
  { id: 'sc', name: 'SC제일은행', bg: '#F0F0F0' },
  { id: 'gyeongnam', name: '경남은행', bg: '#F0F0F0' },
  { id: 'citi', name: '씨티은행', bg: '#F0F0F0' },
  { id: 'shinhyup', name: '신협', bg: '#F0F0F0' },
  { id: 'jeonbuk', name: '전북은행', bg: '#F0F0F0' },
  { id: 'suhyup', name: '수협은행', bg: '#F0F0F0' },
  { id: 'jeju', name: '제주은행', bg: '#F0F0F0' },
  { id: 'kdb', name: '산업은행', bg: '#F0F0F0' },
  { id: 'kbank', name: '케이뱅크', bg: '#F0F0F0' },
  { id: 'kakao', name: '카카오뱅크', bg: '#F0F0F0' },
  { id: 'toss', name: '토스뱅크', bg: '#F0F0F0' },
  { id: 'sanlim', name: '산림조합중앙회', bg: '#F0F0F0' },
  { id: 'savings', name: '저축은행중앙회', bg: '#F0F0F0' },
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
type Step = 'type-select' | 'bank-select' | 'terms' | 'pin' | 'faceid' | 'form' | 'ars' | 'verifying' | 'done' | 'korbit-connect' | 'korbit-verifying' | 'korbit-done'

export default function OnboardingBank() {
  const navigate = useNavigate()
  const { addBankAccount, bankAccounts, connectKorbit, profile, kycData, setFaceIdEnabled } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('type-select')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [selBank, setSelBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [term1, setTerm1] = useState(false)
  const [term2, setTerm2] = useState(false)
  const [term3, setTerm3] = useState(false)
  const [showFaceId, setShowFaceId] = useState(false)
  const [pinStep, setPinStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
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

  const allRequiredTerms = term1 && term2
  const allTerms = term1 && term2 && term3

  const handleAgreeAll = () => {
    if (allTerms) {
      setTerm1(false)
      setTerm2(false)
      setTerm3(false)
    } else {
      setTerm1(true)
      setTerm2(true)
      setTerm3(true)
    }
  }

  const handleTermsConfirm = () => {
    if (allRequiredTerms) {
      // Pre-fill holder name when moving to form
      if (!holderName) {
        setHolderName(getPrefilledName())
      }
      setStep('form')
    }
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
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#F0F0F0] animate-slide-in">
      <Header title={t('ob_bank_register_title')} onBack={() => setStep('type-select')} />
      <div className="flex-1 px-4 pt-5 overflow-y-auto pb-4">
        <h2 className="text-base font-bold text-text-dark mb-5">{t('ob_bank_select_heading')}</h2>
        <div className="grid grid-cols-3 gap-2">
          {banks.map(bank => (
            <button key={bank.id} onClick={() => setSelBank(bank.id)}
              className={`flex flex-col items-center justify-center gap-2.5 py-4 px-2 rounded-2xl transition-all ${
                selBank === bank.id
                  ? 'ring-2 ring-primary bg-white'
                  : 'bg-white'
              }`}>
              <div className="w-10 h-10 flex items-center justify-center">
                <BankLogo id={bank.id} size={36} />
              </div>
              <span className={`text-xs leading-tight text-center font-semibold ${
                selBank === bank.id ? 'text-primary' : 'text-text-dark'
              }`}>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => { setTerm1(false); setTerm2(false); setTerm3(false); setStep('terms') }} disabled={!selBank}
          className={`w-full py-4 font-semibold rounded-xl ${selBank ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: Open Banking Consent ===
  if (step === 'terms') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('ob_bank_register_title')} onBack={() => setStep('bank-select')} />
      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        {/* Title */}
        <h2 className="text-[15px] font-bold text-text-dark leading-snug mb-5 whitespace-pre-line">{t('ob_openbanking_title')}</h2>

        {/* What is Open Banking */}
        <div className="mb-6">
          <p className="text-sm font-bold text-text-dark mb-1.5">{t('ob_openbanking_what')}</p>
          <p className="text-xs text-text-gray leading-relaxed">{t('ob_openbanking_desc')}</p>
        </div>

        {/* Consent Checkboxes */}
        <div className="mb-2">
          <button onClick={() => setTerm1(!term1)}
            className="w-full flex items-center gap-3 py-3">
            <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
              term1 ? 'bg-primary' : 'border-[1.5px] border-gray-300'
            }`}>
              {term1 && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-[13px] text-text-dark flex-1 text-left">{t('ob_openbanking_term1')}</span>
            <ChevronRight size={18} className="text-text-light flex-shrink-0" />
          </button>

          <button onClick={() => setTerm2(!term2)}
            className="w-full flex items-center gap-3 py-3">
            <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
              term2 ? 'bg-primary' : 'border-[1.5px] border-gray-300'
            }`}>
              {term2 && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-[13px] text-text-dark flex-1 text-left">{t('ob_openbanking_term2')}</span>
            <ChevronRight size={18} className="text-text-light flex-shrink-0" />
          </button>

          <button onClick={() => setTerm3(!term3)}
            className="w-full flex items-center gap-3 py-3 border-b border-gray-200">
            <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
              term3 ? 'bg-primary' : 'border-[1.5px] border-gray-300'
            }`}>
              {term3 && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-[13px] text-text-dark flex-1 text-left">{t('ob_openbanking_term3')}</span>
            <ChevronRight size={18} className="text-text-light flex-shrink-0" />
          </button>
        </div>

        {/* Agree All - right aligned */}
        <button onClick={handleAgreeAll}
          className="flex items-center justify-end gap-2 w-full py-3 mb-6">
          <span className="text-[13px] font-semibold text-text-dark">{t('ob_openbanking_agree_all')}</span>
          <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
            allTerms ? 'bg-primary' : 'border-[1.5px] border-gray-300'
          }`}>
            {allTerms && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>
        </button>

        {/* SMS Warning */}
        <div className="bg-[#F5F8FB] rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-text-dark mb-2">{t('ob_openbanking_sms_warning')}</p>
          <p className="text-[11px] text-text-gray leading-relaxed mb-2">{t('ob_openbanking_sms_desc')}</p>
          <p className="text-[11px] text-text-gray leading-relaxed">{t('ob_openbanking_sms_desc2')}</p>
        </div>
      </div>

      {/* Cancel / Confirm Buttons */}
      <div className="px-5 pb-8 pt-4 flex gap-3">
        <button onClick={() => setStep('bank-select')}
          className="flex-1 py-4 font-semibold rounded-xl border border-gray-200 text-text-gray">{t('ob_cancel')}</button>
        <button onClick={handleTermsConfirm} disabled={!allRequiredTerms}
          className={`flex-1 py-4 font-semibold rounded-xl ${
            allRequiredTerms ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
          }`}>{t('ob_confirm')}</button>
      </div>
    </div>
  )

  // === Bank: PIN Verification ===
  if (step === 'pin') {
    const handlePinComplete = (pin: string) => {
      if (pinStep === 'create') {
        setFirstPin(pin)
        setPinStep('confirm')
      } else {
        if (pin === firstPin) {
          setShowFaceId(true)
        }
      }
    }

    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
        <PinInput
          title={pinStep === 'create' ? '거래승인번호 6자리를\n입력해주세요' : '거래승인번호 6자리를\n한번 더 입력해 주세요.'}
          subtitle={pinStep === 'create' ? '결제 및 출금 시 사용합니다' : ''}
          onComplete={handlePinComplete}
          onClose={() => { setPinStep('create'); setFirstPin(''); setStep('bank-select') }}
        />
        <Modal open={showFaceId} onClose={() => { setShowFaceId(false); setStep('form') }}>
          <div className="text-center">
            <h3 className="text-base font-bold text-text-dark mb-3">
              FaceID(으)로 로그인 하시겠습니까?
            </h3>
            <p className="text-sm text-text-gray leading-relaxed mb-6">
              간편비밀번호 대신 FaceID(으)<br/>로 로그인하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setFaceIdEnabled(false); setShowFaceId(false); setPinStep('create'); setFirstPin(''); setTerm1(false); setTerm2(false); setTerm3(false); setStep('terms') }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-text-gray">
                사용안함
              </button>
              <button onClick={() => { setFaceIdEnabled(true); setShowFaceId(false); setPinStep('create'); setFirstPin(''); setStep('faceid') }}

                className="flex-1 py-3 rounded-xl bg-text-dark text-white text-sm font-semibold">
                FaceID 사용
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // === Bank: FaceID Scanning Screen ===
  if (step === 'faceid') return (
    <FaceIdScreen onComplete={() => { setTerm1(false); setTerm2(false); setTerm3(false); setStep('terms') }} onCancel={() => setStep('pin')} />
  )

  // === Bank: Account Form (Redesigned) ===
  if (step === 'form') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('ob_bank_register_title')} onBack={() => setStep('terms')} />
      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        {/* Heading */}
        <h2 className="text-[15px] font-bold text-text-dark leading-snug whitespace-pre-line">{t('ob_form_heading')}</h2>

        <div className="mt-8 space-y-6">
          {/* Bank Name (read-only) */}
          <div>
            <label className="text-[11px] text-text-gray block mb-1">{t('ob_form_bank_name')}</label>
            <p className="text-[15px] font-semibold text-text-dark pb-3 border-b border-gray-200">
              {banks.find(b => b.id === selBank)?.name}
            </p>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-[11px] text-text-gray block mb-1">{t('ob_form_account_number')}</label>
            <input type="text" inputMode="numeric" value={accountNumber}
              onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder={t('ob_form_account_placeholder')}
              maxLength={14}
              className="w-full text-[15px] text-text-dark pb-3 border-b border-gray-200 bg-transparent focus:border-primary focus:outline-none placeholder:text-text-light" />
          </div>

          {/* Name (pre-filled) */}
          <div>
            <label className="text-[11px] text-text-gray block mb-1">{t('ob_form_name')}</label>
            <input type="text" value={holderName}
              onChange={e => setHolderName(e.target.value)}
              placeholder={t('account_holder_placeholder')}
              className="w-full text-[15px] text-text-dark pb-3 border-b border-gray-200 bg-transparent focus:border-primary focus:outline-none placeholder:text-text-light" />
          </div>
        </div>

        {/* ARS Info Box */}
        <div className="mt-8 bg-[#F5F5F5] rounded-xl px-5 py-4">
          <p className="text-xs text-text-gray leading-relaxed text-center">{t('ob_form_ars_info')}</p>
        </div>
      </div>

      <div className="px-5 pb-6 pt-3">
        <button onClick={() => setStep('ars')} disabled={!accountNumber || !holderName || accountNumber.length < 8}
          className={`w-full py-4 font-semibold text-[15px] rounded-xl ${
            accountNumber && holderName && accountNumber.length >= 8 ? 'bg-primary text-white' : 'bg-[#E0E0E0] text-white'
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
