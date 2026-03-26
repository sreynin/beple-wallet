import { useState } from 'react'
import { Header } from '../components/Header'
import { useStore, type BankAccount } from '../store/useStore'
import { useT } from '../hooks/useT'
import { BottomSheet } from '../components/BottomSheet'
import { toast } from '../components/Toast'
import { CheckCircle, Loader2, Phone, Plus, Star, Trash2, Check } from 'lucide-react'

type Step = 'list' | 'bank-select' | 'form' | 'terms' | 'ars' | 'verifying' | 'done'

const banks = [
  { id: 'shinhan', name: '신한은행', icon: '🏦' },
  { id: 'kb', name: '국민은행', icon: '🏛️' },
  { id: 'woori', name: '우리은행', icon: '🏗️' },
  { id: 'hana', name: '하나은행', icon: '🏢' },
  { id: 'nh', name: '농협은행', icon: '🌾' },
  { id: 'ibk', name: 'IBK기업은행', icon: '🏭' },
  { id: 'kakao', name: '카카오뱅크', icon: '💬' },
  { id: 'toss', name: '토스뱅크', icon: '📱' },
]

export default function SettingsAccount() {
  const { bankAccounts, addBankAccount, removeBankAccount, setDefaultBank } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('list')
  const [removeId, setRemoveId] = useState<string | null>(null)
  const removeAccount = bankAccounts.find(b => b.id === removeId)

  // Registration flow state
  const [selBank, setSelBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [arsCode] = useState(String(Math.floor(Math.random() * 90 + 10)))

  const startRegister = () => {
    setSelBank(''); setAccountNumber(''); setHolderName(''); setIsDefault(false); setTermsChecked(false)
    setStep('bank-select')
  }

  const handleRemove = () => {
    if (removeId) { removeBankAccount(removeId); setRemoveId(null); toast(t('account_removed')) }
  }

  const handleSetDefault = (id: string) => {
    setDefaultBank(id)
    toast(t('account_set_default_done'))
  }

  const handleComplete = () => {
    const bank = banks.find(b => b.id === selBank)
    if (bank) {
      addBankAccount({
        bankName: bank.name,
        accountNumber: accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3'),
        holderName,
        isDefault: isDefault || bankAccounts.length === 0,
      })
    }
    setStep('done')
  }

  // === Bank Select ===
  if (step === 'bank-select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('account_register_title')} onBack={() => setStep('list')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('account_bank_select')}</h2>
        <p className="text-xs text-text-gray mb-5">{t('account_bank_select_desc')}</p>
        <div className="grid grid-cols-2 gap-2">
          {banks.map(bank => (
            <button key={bank.id} onClick={() => setSelBank(bank.id)}
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${
                selBank === bank.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
              <span className="text-xl">{bank.icon}</span>
              <span className={`text-xs font-medium ${selBank === bank.id ? 'text-primary' : 'text-text-dark'}`}>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('form')} disabled={!selBank}
          className={`w-full py-4 font-semibold rounded-xl ${selBank ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Account Form ===
  if (step === 'form') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('account_register_title')} onBack={() => setStep('bank-select')} />
      <div className="flex-1 px-6 pt-6">
        <div className="flex items-center gap-2.5 mb-5 bg-gray-50 rounded-xl p-3">
          <span className="text-xl">{banks.find(b => b.id === selBank)?.icon}</span>
          <span className="text-sm font-medium text-text-dark">{banks.find(b => b.id === selBank)?.name}</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('account_number')}</label>
            <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder={t('account_number_placeholder')} maxLength={14}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('account_holder')}</label>
            <input type="text" value={holderName} onChange={e => setHolderName(e.target.value)}
              placeholder={t('account_holder_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <button onClick={() => setIsDefault(!isDefault)}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isDefault ? 'bg-primary' : 'bg-gray-200'}`}>
              {isDefault && <Check size={12} className="text-white" strokeWidth={3} />}
            </button>
            <span className="text-sm text-text-dark">{t('account_set_default')}</span>
          </label>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('terms')} disabled={!accountNumber || !holderName || accountNumber.length < 8}
          className={`w-full py-4 font-semibold rounded-xl ${accountNumber && holderName && accountNumber.length >= 8 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('next')}
        </button>
      </div>
    </div>
  )

  // === Terms ===
  if (step === 'terms') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_account_terms')} onBack={() => setStep('form')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-4">{t('settings_account_terms')}</h2>
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
          <button onClick={() => setTermsChecked(!termsChecked)}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${termsChecked ? 'bg-primary' : 'bg-gray-200'}`}>
            {termsChecked && <Check size={12} className="text-white" strokeWidth={3} />}
          </button>
          <span className="text-sm text-text-dark">[{t('terms_required')}] {t('settings_account_terms_check')}</span>
        </label>
        <div className="mt-3 bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
          <p className="text-[10px] text-text-gray leading-relaxed">{t('terms_service_content')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('ars')} disabled={!termsChecked}
          className={`w-full py-4 font-semibold rounded-xl ${termsChecked ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === ARS ===
  if (step === 'ars') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_account_ars')} onBack={() => setStep('terms')} />
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
        <button onClick={() => { setStep('verifying'); setTimeout(handleComplete, 2500) }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('settings_account_ars_btn')}</button>
      </div>
    </div>
  )

  // === Verifying ===
  if (step === 'verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('settings_account_ars_verifying')}</p>
    </div>
  )

  // === Done ===
  if (step === 'done') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('settings_account_done')}</p>
        <p className="text-sm text-text-gray mt-1">{t('settings_account_done_msg')}</p>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl">{banks.find(b => b.id === selBank)?.icon}</span>
            <div>
              <p className="text-sm font-semibold text-text-dark">{banks.find(b => b.id === selBank)?.name}</p>
              <p className="text-xs text-text-gray">{accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3')} · {holderName}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => setStep('list')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('confirm')}</button>
      </div>
    </div>
  )

  // === Main List ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('settings_account_title')} />
      <div className="flex-1 overflow-y-auto p-4">
        {bankAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-4xl mb-3">🏦</p>
            <p className="text-sm text-text-gray">{t('settings_account_empty')}</p>
            <button onClick={startRegister} className="mt-4 px-6 py-2.5 bg-primary text-white text-sm rounded-xl font-medium">{t('settings_account_add')}</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {bankAccounts.map((account, i) => (
              <div key={account.id} className={`px-4 py-4 ${i < bankAccounts.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><span className="text-lg">🏦</span></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-text-dark">{account.bankName}</p>
                      {account.isDefault && (
                        <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{t('account_default_badge')}</span>
                      )}
                    </div>
                    <p className="text-xs text-text-gray mt-0.5">{account.accountNumber} · {account.holderName}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 ml-13">
                  {!account.isDefault && (
                    <button onClick={() => handleSetDefault(account.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-lg">
                      <Star size={12} />{t('account_default_badge')}
                    </button>
                  )}
                  <button onClick={() => setRemoveId(account.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-error text-xs font-medium rounded-lg">
                    <Trash2 size={12} />{t('account_remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={startRegister} className="w-full mt-3 flex items-center justify-center gap-2 bg-white rounded-2xl p-4 active:bg-gray-50">
          <Plus size={18} className="text-primary" /><span className="text-sm font-medium text-primary">{t('settings_account_add')}</span>
        </button>
      </div>

      {/* Remove Confirm */}
      <BottomSheet open={!!removeId} onClose={() => setRemoveId(null)}>
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold text-text-dark text-center mb-2">{t('account_remove_confirm')}</h3>
          <p className="text-sm text-text-gray text-center mb-1">{removeAccount?.bankName} {removeAccount?.accountNumber}</p>
          <p className="text-xs text-text-gray text-center mb-6">{t('account_remove_confirm_desc')}</p>
          <div className="flex gap-3">
            <button onClick={() => setRemoveId(null)} className="flex-1 py-3.5 bg-gray-100 text-text-gray font-medium rounded-xl">{t('cancel')}</button>
            <button onClick={handleRemove} className="flex-1 py-3.5 bg-error text-white font-medium rounded-xl">{t('account_remove')}</button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
