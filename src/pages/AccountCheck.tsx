import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Landmark, Globe, ShieldCheck, CreditCard } from 'lucide-react'

export default function AccountCheck() {
  const navigate = useNavigate()
  const { setUserType } = useStore()
  const t = useT()

  const handleYes = () => {
    setUserType('domestic')
    navigate('/login')
  }

  const handleNo = () => {
    setUserType('foreigner')
    navigate('/kyc-start')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 px-6 pt-10">
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line">{t('account_check_heading')}</h2>
        <p className="text-sm text-text-gray mt-2 mb-8">{t('account_check_desc')}</p>

        <div className="space-y-4">
          {/* YES - Korean bank */}
          <button onClick={handleYes}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-primary active:bg-primary/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Landmark size={28} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('account_check_yes')}</p>
              <p className="text-xs text-text-gray mt-1">{t('account_check_yes_desc')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <ShieldCheck size={10} />{t('account_check_yes_auth')}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-light">
                  <CreditCard size={10} />2,000,000 KRW
                </span>
              </div>
            </div>
          </button>

          {/* NO - Foreigner */}
          <button onClick={handleNo}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-green-500 active:bg-green-50/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Globe size={28} className="text-green-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('account_check_no')}</p>
              <p className="text-xs text-text-gray mt-1">{t('account_check_no_desc')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-green-600">
                  <ShieldCheck size={10} />{t('account_check_no_auth')}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-light">
                  <CreditCard size={10} />1,000,000 KRW
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
