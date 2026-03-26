import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { PinInput } from '../components/PinInput'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle, Loader2 } from 'lucide-react'

type Step = 'confirm' | 'pin' | 'processing' | 'done'

export default function AtmConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bippleMoney, withdrawAtm, pin } = useStore()
  const t = useT()
  const { amount = 50000 } = (location.state as any) || {}
  const fee = 1300
  const total = amount + fee
  const [step, setStep] = useState<Step>('confirm')
  const [pinError, setPinError] = useState('')

  const handlePinComplete = (input: string) => {
    if (input === pin || pin === '') {
      setStep('processing')
      setTimeout(() => { withdrawAtm(amount); setStep('done') }, 2000)
    } else {
      setPinError(t('atm_pin_error'))
      setTimeout(() => setPinError(''), 2000)
    }
  }

  if (step === 'pin') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('atm_pin_title')} onBack={() => setStep('confirm')} />
      <PinInput title={t('atm_pin_enter')} subtitle={t('atm_pin_secure')} error={pinError} onComplete={handlePinComplete} />
    </div>
  )

  if (step === 'processing') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center animate-fade-in">
      <Loader2 size={56} className="text-green-500 animate-spin mb-4" />
      <p className="text-base font-semibold text-text-dark">{t('atm_processing')}</p>
      <p className="text-sm text-text-gray mt-1">{t('atm_processing_sub')}</p>
    </div>
  )

  if (step === 'done') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={72} className="text-green-500" strokeWidth={1.5} /></div>
        <h2 className="text-xl font-bold text-text-dark mt-6 mb-1">{t('atm_done_title')}</h2>
        <p className="text-sm text-text-gray">{t('atm_done_msg')}</p>
        <div className="w-full mt-8 bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('atm_done_amount')}</span><span className="text-text-dark font-bold">{amount.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('atm_done_fee')}</span><span className="text-text-dark">{fee.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between border-t border-border pt-2"><span className="text-text-gray">{t('atm_done_balance')}</span><span className="text-primary font-bold">{bippleMoney.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('atm_done_datetime')}</span><span className="text-text-dark text-xs">{new Date().toLocaleString('ko-KR')}</span></div>
        </div>
        <button className="mt-4 text-xs text-text-gray underline">{t('atm_done_issue')}</button>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => navigate('/home', { replace: true })} className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl">{t('atm_done_home')}</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('atm_confirm_title')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-6">{t('atm_confirm_heading')}</h2>
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('atm_confirm_amount')}</span><span className="text-text-dark font-bold text-lg">{amount.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('atm_confirm_fee')}</span><span className="text-text-dark">{fee.toLocaleString()}{t('won')}</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-3"><span className="text-text-dark">{t('atm_confirm_total')}</span><span className="text-error">{total.toLocaleString()}{t('won')}</span></div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-text-gray leading-relaxed whitespace-pre-line">{t('atm_confirm_notice')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('pin')} className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl active:bg-green-600">{t('atm_confirm_btn')}</button>
      </div>
    </div>
  )
}
