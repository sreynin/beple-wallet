import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { QrCode, Landmark, ChevronRight } from 'lucide-react'

export default function CoinDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { coins } = useStore()
  const t = useT()
  const coin = coins.find(c => c.id === id)

  if (!coin) return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white">
      <Header title={t('coin_detail')} />
      <div className="flex-1 flex items-center justify-center"><p className="text-text-gray">{t('coin_not_found')}</p></div>
    </div>
  )

  const recentHistory = [
    { title: '스타벅스 강남점', date: '2026.03.20 12:30', amount: `-5.50 ${coin.symbol}`, type: t('tx_payment') },
    { title: t('bipple_money') + ' ' + t('tx_charge'), date: '2026.03.19 15:45', amount: `-100.00 ${coin.symbol}`, type: t('tx_charge') },
    { title: 'ATM', date: '2026.03.18 09:20', amount: `-50.00 ${coin.symbol}`, type: t('tx_atm') },
  ]

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={`${coin.symbol} ${t('coin_detail')}`} />
      <div className="flex-1 overflow-y-auto">
        <div className={`mx-4 mt-3 rounded-2xl p-5 text-white ${
          coin.symbol === 'USDC' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
          coin.symbol === 'ETH' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
          'bg-gradient-to-br from-orange-500 to-orange-700'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-white/70">{coin.symbol}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{coin.source} {t('coin_connected')}</span>
          </div>
          <p className="text-2xl font-bold mt-1">{coin.balance.toFixed(coin.symbol === 'BTC' ? 4 : 2)} {coin.unit}</p>
          <p className="text-sm text-white/70 mt-1">≈ {coin.krwValue.toLocaleString()}{t('won')}</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => navigate('/payment-pin')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/15 rounded-xl active:bg-white/25">
              <QrCode size={16} /><span className="text-xs font-medium">{t('coin_pay')}</span>
            </button>
            <button onClick={() => navigate('/atm-scan')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/15 rounded-xl active:bg-white/25">
              <Landmark size={16} /><span className="text-xs font-medium">{t('coin_atm')}</span>
            </button>
          </div>
        </div>

        <div className="mx-4 mt-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-dark">{t('coin_history')}</h3>
            <span className="text-xs text-text-light">{t('all')}</span>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden">
            {recentHistory.map((item, i) => (
              <div key={i} className={`flex items-center px-4 py-3.5 ${i < recentHistory.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1"><p className="text-sm font-medium text-text-dark">{item.title}</p><p className="text-[10px] text-text-light mt-0.5">{item.date}</p></div>
                <div className="text-right"><p className="text-sm font-medium text-text-dark">{item.amount}</p><p className="text-[10px] text-text-light mt-0.5">{item.type}</p></div>
                <ChevronRight size={14} className="text-text-light ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
