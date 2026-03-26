import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { CreditCard, TrendingUp, Megaphone, Gift } from 'lucide-react'

const icons = {
  payment: CreditCard,
  charge: TrendingUp,
  notice: Megaphone,
  event: Gift,
}

export default function Notifications() {
  const { notifications, markNotificationRead } = useStore()
  const t = useT()

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('notif_title')} />
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-sm text-text-gray">{t('notif_empty')}</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {notifications.map(notif => {
              const Icon = icons[notif.type]
              return (
                <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50 border border-primary/10'}`}>
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-gray-100' : 'bg-primary/10'}`}>
                      <Icon size={18} className={notif.read ? 'text-text-gray' : 'text-primary'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-dark">{notif.title}</span>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-error flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-text-gray mt-1 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-text-light mt-1.5">{notif.date}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
