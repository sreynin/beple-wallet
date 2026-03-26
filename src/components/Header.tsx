import { useNavigate } from 'react-router-dom'
import { ChevronLeft, X } from 'lucide-react'

interface HeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
  showClose?: boolean
  right?: React.ReactNode
}

export function Header({ title, onBack, showBack = true, showClose, right }: HeaderProps) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-40 border-b border-border">
      <div className="w-10">
        {showBack && (
          <button onClick={handleBack} className="p-1 -ml-1 active:bg-gray-100 rounded-full">
            {showClose ? <X size={22} /> : <ChevronLeft size={22} />}
          </button>
        )}
      </div>
      <h1 className="text-[15px] font-semibold text-text-dark flex-1 text-center">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  )
}
