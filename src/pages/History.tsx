import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, type Transaction } from '../store/useStore'
import { useT } from '../hooks/useT'
import { BottomNav } from '../components/BottomNav'
import { SlidersHorizontal, ChevronRight, X, SearchX } from 'lucide-react'
import { BottomSheet } from '../components/BottomSheet'

type TxType = 'all' | 'charge' | 'payment' | 'atm' | 'fee'
type TxStatus = 'all' | 'completed' | 'pending' | 'failed'
type PayMethod = 'all' | 'bipple' | 'coin'
type Period = '1w' | '1m' | '3m' | '6m'

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('.').map(Number)
  return new Date(y, m - 1, d)
}

const periodDays: Record<Period, number> = { '1w': 7, '1m': 30, '3m': 90, '6m': 180 }

export default function History() {
  const navigate = useNavigate()
  const { transactions } = useStore()
  const t = useT()

  const [filterOpen, setFilterOpen] = useState(false)
  // Applied filters
  const [period, setPeriod] = useState<Period>('1m')
  const [typeFilter, setTypeFilter] = useState<TxType>('all')
  const [statusFilter, setStatusFilter] = useState<TxStatus>('all')
  const [methodFilter, setMethodFilter] = useState<PayMethod>('all')
  // Draft filters (in bottom sheet before applying)
  const [dPeriod, setDPeriod] = useState<Period>(period)
  const [dType, setDType] = useState<TxType>(typeFilter)
  const [dStatus, setDStatus] = useState<TxStatus>(statusFilter)
  const [dMethod, setDMethod] = useState<PayMethod>(methodFilter)

  const hasActiveFilter = typeFilter !== 'all' || statusFilter !== 'all' || methodFilter !== 'all'

  const filtered = useMemo(() => {
    const cutoff = daysAgo(periodDays[period])
    const cutoffDate = parseDate(cutoff)
    return transactions.filter((tx: Transaction) => {
      if (parseDate(tx.date) < cutoffDate) return false
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false
      if (methodFilter !== 'all' && tx.paymentMethod !== methodFilter) return false
      return true
    })
  }, [transactions, period, typeFilter, statusFilter, methodFilter])

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = []
    acc[tx.date].push(tx)
    return acc
  }, {})

  const openFilter = () => {
    setDPeriod(period); setDType(typeFilter); setDStatus(statusFilter); setDMethod(methodFilter)
    setFilterOpen(true)
  }

  const applyFilter = () => {
    setPeriod(dPeriod); setTypeFilter(dType); setStatusFilter(dStatus); setMethodFilter(dMethod)
    setFilterOpen(false)
  }

  const resetFilter = () => {
    setDPeriod('1m'); setDType('all'); setDStatus('all'); setDMethod('all')
  }

  const clearFilters = () => {
    setPeriod('1m'); setTypeFilter('all'); setStatusFilter('all'); setMethodFilter('all')
  }

  const statusColor = (s: string) =>
    s === 'completed' ? 'text-green-600 bg-green-50' :
    s === 'pending' ? 'text-yellow-600 bg-yellow-50' :
    'text-error bg-red-50'

  const statusLabel = (s: string) =>
    s === 'completed' ? t('hist_status_completed') :
    s === 'pending' ? t('hist_status_pending') :
    t('hist_status_failed')

  const typeLabel = (tp: string) =>
    tp === 'payment' ? t('tx_payment') : tp === 'charge' ? t('tx_charge') :
    tp === 'atm' ? t('tx_atm') : tp === 'fee' ? t('tx_fee') : t('tx_exchange')

  const periods: { key: Period; label: string }[] = [
    { key: '1w', label: t('hist_1week') }, { key: '1m', label: t('hist_1month') },
    { key: '3m', label: t('hist_3month') }, { key: '6m', label: t('hist_6month') },
  ]

  const types: { key: TxType; label: string }[] = [
    { key: 'all', label: t('all') }, { key: 'charge', label: t('hist_charge') },
    { key: 'payment', label: t('hist_payment') }, { key: 'atm', label: t('hist_atm') },
  ]

  const statuses: { key: TxStatus; label: string }[] = [
    { key: 'all', label: t('hist_status_all') }, { key: 'completed', label: t('hist_status_completed') },
    { key: 'pending', label: t('hist_status_pending') }, { key: 'failed', label: t('hist_status_failed') },
  ]

  const methods: { key: PayMethod; label: string }[] = [
    { key: 'all', label: t('hist_method_all') }, { key: 'bipple', label: t('hist_method_bipple') },
    { key: 'coin', label: t('hist_method_coin') },
  ]

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray">
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-border">
        <h1 className="text-[15px] font-semibold text-text-dark">{t('hist_title')}</h1>
        <button onClick={openFilter} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${
          hasActiveFilter ? 'bg-primary text-white' : 'bg-gray-50 text-text-gray'
        }`}>
          <SlidersHorizontal size={14} />
          <span>{t('hist_filter')}</span>
        </button>
      </div>

      {/* Active filter indicator */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 px-5 py-2 bg-primary/5 border-b border-primary/10">
          <span className="text-xs text-primary font-medium flex-1">{t('hist_active_filters')}</span>
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary">
            <X size={12} />{t('hist_reset')}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <SearchX size={48} className="text-text-light mb-3" />
            <p className="text-sm text-text-gray">{t('hist_no_results')}</p>
            <p className="text-xs text-text-light mt-1">{t('hist_no_results_desc')}</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date} className="mb-4">
              <p className="text-xs font-medium text-text-gray mb-2 px-1">{date}</p>
              <div className="bg-white rounded-2xl overflow-hidden">
                {txs.map((tx, i) => (
                  <button key={tx.id} onClick={() => navigate(`/receipt/${tx.id}`)}
                    className={`w-full flex items-center px-4 py-3.5 active:bg-gray-50 ${i < txs.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      tx.type === 'charge' ? 'bg-blue-50 text-primary' : tx.type === 'payment' ? 'bg-red-50 text-error' :
                      tx.type === 'atm' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-text-gray'
                    }`}>{tx.type === 'charge' ? '+' : tx.type === 'payment' ? '-' : tx.type === 'atm' ? 'A' : 'F'}</div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-text-dark truncate">{tx.title}</p>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColor(tx.status)}`}>
                          {statusLabel(tx.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-text-light">{tx.time}</span>
                        <span className="text-[10px] text-text-light">·</span>
                        <span className="text-[10px] text-text-light">{typeLabel(tx.type)}</span>
                        <span className="text-[10px] text-text-light">·</span>
                        <span className="text-[10px] text-text-light">{tx.paymentMethod === 'coin' ? t('hist_method_coin') : t('hist_method_bipple')}</span>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className={`text-sm font-semibold ${tx.status === 'failed' ? 'text-text-light line-through' : tx.amount > 0 ? 'text-primary' : 'text-text-dark'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}{t('won')}
                      </p>
                      <p className="text-[10px] text-text-light mt-0.5">{tx.balance.toLocaleString()}{t('won')}</p>
                    </div>
                    <ChevronRight size={14} className="text-text-light ml-1 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)}>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-dark">{t('hist_filter_title')}</h3>
            <button onClick={resetFilter} className="text-xs text-primary font-medium">{t('hist_reset')}</button>
          </div>

          {/* Period */}
          <p className="text-xs font-medium text-text-gray mb-2">{t('hist_period')}</p>
          <div className="flex gap-2 mb-5">
            {periods.map(p => (
              <button key={p.key} onClick={() => setDPeriod(p.key)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${dPeriod === p.key ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Type */}
          <p className="text-xs font-medium text-text-gray mb-2">{t('hist_type')}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {types.map(tp => (
              <button key={tp.key} onClick={() => setDType(tp.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${dType === tp.key ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
                {tp.label}
              </button>
            ))}
          </div>

          {/* Status */}
          <p className="text-xs font-medium text-text-gray mb-2">{t('hist_status')}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {statuses.map(s => (
              <button key={s.key} onClick={() => setDStatus(s.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${dStatus === s.key ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <p className="text-xs font-medium text-text-gray mb-2">{t('hist_method')}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {methods.map(m => (
              <button key={m.key} onClick={() => setDMethod(m.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${dMethod === m.key ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
                {m.label}
              </button>
            ))}
          </div>

          <button onClick={applyFilter} className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl">
            {t('hist_search_btn')}
          </button>
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  )
}
