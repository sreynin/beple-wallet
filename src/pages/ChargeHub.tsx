import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { MaintenanceModal } from '../components/MaintenanceModal'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Landmark, Globe, BarChart3, Wrench } from 'lucide-react'

export default function ChargeHub() {
  const navigate = useNavigate()
  const { userType } = useStore()
  const t = useT()
  const [maintenanceModal, setMaintenanceModal] = useState(false)
  const isForeigner = userType === 'foreigner'

  const korbitMaintenance = false

  const allOptions = [
    { icon: BarChart3, label: t('charge_korbit'), desc: t('charge_korbit_desc'), path: '/charge-korbit', badge: null, maintenance: korbitMaintenance, domesticOnly: true },
    { icon: Globe, label: t('charge_triplea'), desc: t('charge_triplea_desc'), path: '/charge-triplea', badge: null, maintenance: false, domesticOnly: false },
    { icon: Landmark, label: t('charge_bank'), desc: t('charge_bank_desc'), path: '/charge-bank', badge: null, maintenance: false, domesticOnly: true },
  ]

  // Foreigners only see Direct Transfer Crypto
  const options = isForeigner ? allOptions.filter(o => !o.domesticOnly) : allOptions

  const handleOptionClick = (opt: typeof options[0]) => {
    if (opt.maintenance) {
      setMaintenanceModal(true)
      return
    }
    navigate(opt.path)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('charge_title')} />
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <p className="text-base font-semibold text-text-dark mb-1 px-1">{t('charge_select')}</p>
        <p className="text-xs text-text-gray mb-5 px-1">{t('charge_select_desc')}</p>
        <div className="space-y-2">
          {options.map(opt => (
            <button key={opt.label} onClick={() => handleOptionClick(opt)}
              className={`w-full flex items-center gap-4 bg-white p-4 rounded-2xl transition-colors ${
                opt.maintenance ? 'opacity-60' : 'active:bg-gray-50'
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                opt.maintenance ? 'bg-gray-100' : 'bg-primary/5'
              }`}>
                {opt.maintenance
                  ? <Wrench size={24} className="text-text-light" />
                  : <opt.icon size={24} className="text-primary" />
                }
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${opt.maintenance ? 'text-text-light' : 'text-text-dark'}`}>{opt.label}</span>
                  {opt.maintenance ? (
                    <span className="text-[9px] font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded-full">{t('state_maintenance_title')}</span>
                  ) : opt.badge ? (
                    <span className="text-[9px] font-bold text-white bg-error px-1.5 py-0.5 rounded-full">{opt.badge}</span>
                  ) : null}
                </div>
                <p className={`text-xs mt-0.5 ${opt.maintenance ? 'text-text-light' : 'text-text-gray'}`}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <MaintenanceModal
        open={maintenanceModal}
        onClose={() => setMaintenanceModal(false)}
      />
    </div>
  )
}
