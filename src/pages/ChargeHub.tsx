import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { MaintenanceModal } from '../components/MaintenanceModal'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Landmark, Globe, BarChart3, Wrench, ChevronRight } from 'lucide-react'

export default function ChargeHub() {
  const navigate = useNavigate()
  const { userType } = useStore()
  const t = useT()
  const [maintenanceModal, setMaintenanceModal] = useState(false)
  const isForeigner = userType === 'foreigner'

  const korbitMaintenance = false

  const allOptions = [
    { icon: BarChart3, label: t('charge_korbit'), desc: t('charge_korbit_desc'), path: '/charge-korbit', badge: null, maintenance: korbitMaintenance, domesticOnly: true, section: 'domestic' },
    { icon: Landmark, label: t('charge_bank'), desc: t('charge_bank_desc'), path: '/charge-bank', badge: null, maintenance: false, domesticOnly: true, section: 'domestic' },
    { icon: Globe, label: t('charge_triplea'), desc: t('charge_triplea_desc'), path: '/charge-triplea', badge: null, maintenance: false, domesticOnly: false, section: 'foreign' },
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
      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        <p className="text-[22px] font-bold text-text-dark mb-1">{t('charge_select')}</p>
        <div className="space-y-5 mt-4">
          {(isForeigner ? ['foreign'] : ['domestic', 'foreign']).map(section => {
            const sectionOptions = options.filter(opt => opt.section === section)
            if (sectionOptions.length === 0) return null
            return (
              <div key={section}>
                <p className="text-xs text-text-gray mb-2">
                  {section === 'domestic' ? t('usertype_domestic').split(' ')[0] : t('usertype_foreigner').split(' ')[0]}
                </p>
                <div className="space-y-2.5">
                  {sectionOptions.map(opt => (
                    <button key={opt.label} onClick={() => handleOptionClick(opt)}
                      className={`w-full flex items-center gap-3 bg-white p-4 rounded-2xl border transition-colors ${
                        opt.maintenance
                          ? 'opacity-60 border-border'
                          : 'border-[#D8E0F5] active:bg-gray-50'
                      }`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        opt.maintenance ? 'bg-gray-100' : 'bg-[#F3F5F9]'
                      }`}>
                        {opt.maintenance
                          ? <Wrench size={18} className="text-text-light" />
                          : <opt.icon size={18} className="text-[#4B5563]" />
                        }
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-base ${opt.maintenance ? 'text-text-light' : 'text-text-dark'}`}>{opt.label}</span>
                          {opt.maintenance ? (
                            <span className="text-[9px] font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded-full">{t('state_maintenance_title')}</span>
                          ) : opt.badge ? (
                            <span className="text-[9px] font-bold text-white bg-error px-1.5 py-0.5 rounded-full">{opt.badge}</span>
                          ) : null}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${opt.maintenance ? 'text-text-light' : 'text-text-gray'}`}>{opt.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-text-light" />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[11px] text-text-gray mt-6 mb-3">{t('charge_select_desc')}</p>
      </div>

      <MaintenanceModal
        open={maintenanceModal}
        onClose={() => setMaintenanceModal(false)}
      />
    </div>
  )
}
