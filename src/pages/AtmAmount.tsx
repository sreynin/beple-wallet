import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'

export default function AtmAmount() {
  const navigate = useNavigate()
  const { bippleMoney } = useStore()
  const t = useT()
  const [amount, setAmount] = useState('')
  const numAmount = parseInt(amount.replace(/,/g, '') || '0')
  const fee = 1300
  const total = numAmount + fee

  const handleKey = (key: string) => {
    if (key === 'del') setAmount(a => a.slice(0, -1))
    else if (key === '00') setAmount(a => a + '00')
    else setAmount(a => a + key)
  }

  const validate = () => {
    if (numAmount < 10000) { toast(t('atm_amount_min_error'), 'error'); return false }
    if (numAmount % 10000 !== 0) { toast(t('atm_amount_unit_error'), 'warning'); return false }
    if (numAmount > 300000) { toast(t('atm_amount_limit_error'), 'error'); return false }
    if (total > bippleMoney) { toast(t('atm_amount_over_error'), 'error'); return false }
    return true
  }

  const handleNext = () => { if (validate()) navigate('/atm-confirm', { state: { amount: numAmount } }) }

  const keys = ['1','2','3','4','5','6','7','8','9','00','0','del']

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('atm_amount_title')} />
      <div className="flex-1 px-6 pt-5">
        <p className="text-sm text-text-gray mb-1">{t('atm_amount_heading')}</p>
        <p className="text-xs text-text-light mb-4">{t('atm_amount_unit')}</p>
        <div className="text-right mb-2">
          <span className="text-3xl font-bold text-text-dark">{numAmount > 0 ? numAmount.toLocaleString() : '0'}</span>
          <span className="text-lg text-text-gray ml-1">{t('won')}</span>
        </div>
        {numAmount > 0 && numAmount % 10000 !== 0 && <p className="text-xs text-error text-right mb-2">{t('atm_amount_unit_error')}</p>}
        <div className="flex justify-between text-xs text-text-light mb-1">
          <span>{t('atm_amount_balance')}: {bippleMoney.toLocaleString()}{t('won')}</span>
          <span>{t('atm_amount_limit')}: 300,000{t('won')}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0 bg-gray-50 border-t border-border">
        {keys.map((key, i) => (
          <button key={i} onClick={() => key && handleKey(key)}
            className="h-14 flex items-center justify-center text-lg font-medium text-text-dark active:bg-gray-200 transition-colors">
            {key === 'del' ? '⌫' : key}
          </button>
        ))}
      </div>
      <div className="px-6 pb-6 pt-3">
        <button onClick={handleNext} disabled={numAmount < 10000}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${numAmount >= 10000 ? 'bg-green-500 text-white active:bg-green-600' : 'bg-gray-200 text-text-light'}`}>
          {t('next')}
        </button>
      </div>
    </div>
  )
}
