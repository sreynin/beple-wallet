import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { CHARGE_MIN, CHARGE_MAX_DOMESTIC, CHARGE_MAX_FOREIGNER } from '../constants'

export default function ChargeBank() {
  const navigate = useNavigate()
  const { bippleMoney, bankAccounts, chargeBippleMoney, userType } = useStore()
  const defaultBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0]
  const t = useT()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const chargeMax = userType === 'foreigner' ? CHARGE_MAX_FOREIGNER : CHARGE_MAX_DOMESTIC
  const numAmount = parseInt(amount.replace(/,/g, '') || '0')
  const afterBalance = bippleMoney + numAmount

  const addAmount = (val: number) => setAmount(String(Math.min(numAmount + val, chargeMax)))

  const handleCharge = () => {
    if (numAmount < CHARGE_MIN) { toast(t('charge_bank_min'), 'error'); return }
    if (numAmount > chargeMax) { toast(`${t('charge_bank_notice').split('\n')[1]}`, 'error'); return }
    if (loading) return
    setLoading(true)
    chargeBippleMoney(numAmount)
    navigate('/charge-complete', { state: { amount: numAmount, method: t('charge_bank') } })
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('charge_bank_title')} />
      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-text-gray mb-1">{t('charge_bank_account')}</p>
          <p className="text-sm font-semibold text-text-dark">
            {defaultBank ? `${defaultBank.bankName} ${defaultBank.accountNumber}` : t('charge_bank_no_account')}
          </p>
        </div>
        <p className="text-xs text-text-gray mb-2">{t('charge_bank_amount')}</p>
        <div className="relative mb-2">
          <input type="text" value={numAmount > 0 ? numAmount.toLocaleString() : ''} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0" className="w-full text-right text-3xl font-bold text-text-dark py-3 border-b-2 border-primary focus:outline-none pr-8" />
          <span className="absolute right-0 bottom-4 text-lg text-text-gray">{t('won')}</span>
        </div>
        <p className="text-xs text-text-light text-right mb-4">{t('charge_bank_after')}: {afterBalance.toLocaleString()}{t('won')}</p>
        <div className="flex gap-2 mb-6">
          {[10000, 50000, 100000].map(val => (
            <button key={val} onClick={() => addAmount(val)}
              className="flex-1 py-2.5 bg-gray-50 rounded-lg text-xs font-medium text-text-gray active:bg-gray-100">
              +{(val / 10000).toFixed(0)}万
            </button>
          ))}
          <button onClick={() => setAmount('2000000')}
            className="flex-1 py-2.5 bg-gray-50 rounded-lg text-xs font-medium text-text-gray active:bg-gray-100">{t('charge_bank_full')}</button>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-text-gray whitespace-pre-line">{t('charge_bank_notice')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleCharge} disabled={numAmount < 10000}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${numAmount >= 10000 ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'}`}>
          {t('charge_bank_btn')}
        </button>
      </div>
    </div>
  )
}
