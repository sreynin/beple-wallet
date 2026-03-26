import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Coins, Ban } from 'lucide-react'

export default function CryptoCheck() {
  const navigate = useNavigate()
  const { setHasCrypto } = useStore()
  const t = useT()

  const handleYes = () => {
    setHasCrypto(true)
    navigate('/kyc-start')
  }

  const handleNo = () => {
    setHasCrypto(false)
    navigate('/pin-setup', { state: { flow: 'signup' } })
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 px-6 pt-10">
        <h2 className="text-xl font-bold text-text-dark leading-snug whitespace-pre-line">{t('crypto_check_heading')}</h2>
        <p className="text-sm text-text-gray mt-2 mb-8">{t('crypto_check_desc')}</p>

        <div className="space-y-4">
          {/* YES - Has crypto */}
          <button onClick={handleYes}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-primary active:bg-primary/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Coins size={28} className="text-green-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('crypto_check_yes')}</p>
              <p className="text-xs text-text-gray mt-1">{t('crypto_check_yes_desc')}</p>
            </div>
          </button>

          {/* NO - No crypto */}
          <button onClick={handleNo}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-gray-400 active:bg-gray-50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Ban size={28} className="text-text-gray" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('crypto_check_no')}</p>
              <p className="text-xs text-text-gray mt-1">{t('crypto_check_no_desc')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
