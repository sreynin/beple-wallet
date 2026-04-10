import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { CheckCircle } from 'lucide-react'

export default function ChargeComplete() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bippleMoney } = useStore()
  const t = useT()
  const { amount = 0, method = '', fromOnboarding = false } = (location.state as any) || {}

  useEffect(() => {
    toast(t('state_charge_success'), 'success')
  }, [])

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={72} className="text-green-500" strokeWidth={1.5} /></div>
        <h2 className="text-xl font-bold text-text-dark mt-6 mb-2">{t('charge_complete_title')}</h2>
        <p className="text-sm text-text-gray">{t('charge_complete_msg')}</p>
        <p className="text-3xl font-bold text-primary mt-6">+{amount.toLocaleString()}{t('won')}</p>
        <div className="w-full mt-8 bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('charge_complete_method')}</span><span className="text-text-dark font-medium">{method}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('charge_complete_after')}</span><span className="text-primary font-bold">{bippleMoney.toLocaleString()}{t('won')}</span></div>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => navigate(fromOnboarding ? '/pin-setup' : '/home', { replace: true, state: fromOnboarding ? { flow: 'signup' } : undefined })} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('charge_complete_home')}</button>
        <button onClick={() => navigate('/history')} className="w-full py-3 text-primary text-sm font-medium">{t('charge_complete_history')}</button>
      </div>
    </div>
  )
}
