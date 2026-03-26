import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'info' | 'success' | 'error' | 'warning'

let showToastFn: (msg: string, type?: ToastType) => void = () => {}

export function toast(msg: string, type: ToastType = 'info') {
  showToastFn(msg, type)
}

const typeStyles: Record<ToastType, { bg: string; Icon: typeof Info }> = {
  info:    { bg: 'bg-gray-800',  Icon: Info },
  success: { bg: 'bg-green-600', Icon: CheckCircle },
  error:   { bg: 'bg-red-600',   Icon: AlertCircle },
  warning: { bg: 'bg-amber-500', Icon: AlertTriangle },
}

export function ToastProvider() {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    showToastFn = (msg: string, t: ToastType = 'info') => {
      setMessage(msg)
      setType(t)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
  }, [])

  if (!visible) return null

  const style = typeStyles[type]
  const Icon = style.Icon

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] animate-fade-in">
      <div className={`${style.bg} text-white text-sm px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 max-w-[320px]`}>
        <Icon size={16} className="flex-shrink-0" />
        <span className="whitespace-pre-line">{message}</span>
      </div>
    </div>
  )
}
