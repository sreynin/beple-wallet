import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { CheckCircle, Store } from 'lucide-react'

export default function PaymentConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bippleMoney, payBippleMoney } = useStore()
  const t = useT()
  const { merchant = 'Merchant', amount = 0 } = (location.state as any) || {}
  const [done, setDone] = useState(false)

  const handlePay = () => {
    if (bippleMoney < amount) {
      toast(t('state_coin_exceed'), 'error')
      return
    }
    payBippleMoney(amount, merchant)
    toast(t('state_payment_success'), 'success')
    setDone(true)
  }

  if (done) return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={72} className="text-green-500" strokeWidth={1.5} /></div>
        <h2 className="text-xl font-bold text-text-dark mt-6 mb-1">{t('pay_done_title')}</h2>
        <p className="text-sm text-text-gray">{merchant}</p>
        <p className="text-3xl font-bold text-text-dark mt-4">{amount.toLocaleString()}{t('won')}</p>
        <p className="text-xs text-text-gray mt-2">{t('pay_done_msg')}</p>
        <div className="w-full mt-8 bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_done_datetime')}</span><span className="text-text-dark">{new Date().toLocaleString('ko-KR')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_done_approval')}</span><span className="text-text-dark">{String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_done_method')}</span><span className="text-text-dark">{t('bipple_money')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_done_balance')}</span><span className="text-primary font-bold">{bippleMoney.toLocaleString()}{t('won')}</span></div>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => navigate('/home', { replace: true })} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('pay_done_home')}</button>
        <button onClick={() => navigate('/history')} className="w-full py-3 text-primary text-sm font-medium">{t('pay_done_receipt')}</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('pay_confirm_title')} />
      <div className="flex-1 px-6 pt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4"><Store size={32} className="text-green-600" /></div>
          <p className="text-lg font-bold text-text-dark">{merchant}</p>
        </div>
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-text-dark">{amount.toLocaleString()}<span className="text-xl">{t('won')}</span></p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_confirm_method')}</span><span className="text-text-dark font-medium">{t('bipple_money')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_confirm_balance')}</span><span className="text-text-dark">{bippleMoney.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('pay_confirm_after')}</span><span className="text-primary font-medium">{(bippleMoney - amount).toLocaleString()}{t('won')}</span></div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handlePay} disabled={bippleMoney < amount}
          className={`w-full py-4 font-semibold rounded-xl ${bippleMoney >= amount ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'}`}>
          {bippleMoney >= amount ? t('pay_confirm_btn') : t('pay_confirm_insufficient')}
        </button>
      </div>
    </div>
  )
}
