import { useNavigate, useLocation } from 'react-router-dom'
import { Home, FileText, Settings } from 'lucide-react'
import { useT } from '../hooks/useT'

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const t = useT()

  const tabs = [
    { path: '/home', label: t('home'), icon: Home },
    { path: '/history', label: t('history'), icon: FileText },
    { path: '/settings', label: t('settings'), icon: Settings },
  ]

  return (
    <div className="sticky bottom-0 bg-white border-t border-border flex z-50">
      {tabs.map(tab => {
        const active = location.pathname.startsWith(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${active ? 'text-primary' : 'text-text-light'}`}
          >
            <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
