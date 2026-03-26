import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'

export default function ChargeCoin() {
  const navigate = useNavigate()
  const { coins, chargeBippleMoney } = useStore()
  const t = useT()
  const [selectedCoin, setSelectedCoin] = useState(coins[0]?.id || '')
  const [amount, setAmount] = useState('')

  const coin = coins.find(c => c.id === selectedCoin)
  const numAmount = parseInt(amount.replace(/,/g, '') || '0')
  const fee = Math.floor(numAmount * 0.01)
  const finalAmount = numAmount - fee
  const coinNeeded = coin ? numAmount / coin.rate : 0

  const handleCharge = () => {
    if (coin && coinNeeded > coin.balance) {
      toast(t('state_coin_exceed'), 'error')
      return
    }
    chargeBippleMoney(finalAmount)
    navigate('/charge-complete', { state: { amount: finalAmount, method: `${coin?.symbol}` } })
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('charge_coin_title')} />
      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <p className="text-xs text-text-gray mb-2">{t('charge_coin_select')}</p>
        <div className="flex gap-2 mb-6">
          {coins.map(c => (
            <button key={c.id} onClick={() => setSelectedCoin(c.id)}
              className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${selectedCoin === c.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <p className={`text-sm font-semibold ${selectedCoin === c.id ? 'text-primary' : 'text-text-dark'}`}>{c.symbol}</p>
              <p className="text-[10px] text-text-gray mt-0.5">{t('charge_coin_held')}: {c.balance} {c.unit}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-gray mb-2">{t('charge_coin_amount')}</p>
        <div className="relative mb-3">
          <input type="text" value={numAmount > 0 ? numAmount.toLocaleString() : ''} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0" className="w-full text-right text-2xl font-bold text-text-dark py-3 border-b-2 border-primary focus:outline-none pr-8" />
          <span className="absolute right-0 bottom-4 text-base text-text-gray">{t('won')}</span>
        </div>
        {coin && numAmount > 0 && (
          <p className="text-xs text-text-light text-right mb-4">≈ {coinNeeded.toFixed(coin.symbol === 'BTC' ? 8 : 4)} {coin.symbol} {t('charge_coin_deduct')}</p>
        )}
        {numAmount > 0 && coin && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">{t('charge_coin_rate')}</span>
              <span className="text-text-dark">1 {coin.symbol} = {coin.rate.toLocaleString()}{t('won')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">{t('charge_coin_fee')}</span>
              <span className="text-error">-{fee.toLocaleString()}{t('won')}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
              <span className="text-text-dark">{t('charge_coin_final')}</span>
              <span className="text-primary">{finalAmount.toLocaleString()}{t('won')}</span>
            </div>
          </div>
        )}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-text-gray leading-relaxed whitespace-pre-line">{t('charge_coin_notice')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleCharge} disabled={numAmount < 1000}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${numAmount >= 1000 ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'}`}>
          {t('charge_coin_btn')}
        </button>
      </div>
    </div>
  )
}
