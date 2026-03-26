import { useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { CheckCircle } from 'lucide-react'

export default function Receipt() {
  const { id } = useParams()
  const { transactions } = useStore()
  const t = useT()
  const tx = transactions.find(t => t.id === id)

  if (!tx) return <div className="p-8 text-center text-text-gray">{t('error')}</div>

  const isPayment = tx.type === 'payment'

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('receipt_title')} />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex flex-col items-center mb-6">
            <CheckCircle size={48} className="text-green-500 mb-3" />
            <p className="text-lg font-bold text-text-dark">
              {isPayment ? t('receipt_payment_done') : tx.type === 'charge' ? t('receipt_charge_done') : t('receipt_atm_done')}
            </p>
          </div>
          <div className="text-center mb-6">
            <p className={`text-3xl font-bold ${tx.amount > 0 ? 'text-primary' : 'text-text-dark'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}{t('won')}
            </p>
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            {isPayment && (
              <div className="flex justify-between">
                <span className="text-sm text-text-gray">{t('receipt_merchant')}</span>
                <span className="text-sm font-medium text-text-dark">{tx.title}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-text-gray">{t('receipt_datetime')}</span>
              <span className="text-sm font-medium text-text-dark">{tx.date} {tx.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-gray">{t('receipt_approval')}</span>
              <span className="text-sm font-medium text-text-dark">{String(parseInt(tx.id.replace('-', '').slice(-8), 10) || 0).padStart(8, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-gray">{t('receipt_method')}</span>
              <span className="text-sm font-medium text-text-dark">{t('bipple_money')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-gray">{t('receipt_balance')}</span>
              <span className="text-sm font-medium text-text-dark">{tx.balance.toLocaleString()}{t('won')}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-gray">{t('receipt_settlement')}</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{t('receipt_settlement_status')}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-text-light text-center mt-4">{t('receipt_notice')}</p>
      </div>
    </div>
  )
}
