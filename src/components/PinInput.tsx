import { useState, useCallback } from 'react'
import { useT } from '../hooks/useT'

interface PinInputProps {
  title: string
  subtitle?: string
  error?: string
  onComplete: (pin: string) => void
  onClose?: () => void
}

export function PinInput({ title, subtitle, error, onComplete, onClose }: PinInputProps) {
  const [pin, setPin] = useState('')
  const t = useT()

  const handleKey = useCallback((key: string) => {
    if (key === 'del') {
      setPin(p => p.slice(0, -1))
    } else if (pin.length < 6) {
      const next = pin + key
      setPin(next)
      if (next.length === 6) {
        setTimeout(() => {
          onComplete(next)
          setPin('')
        }, 200)
      }
    }
  }, [pin, onComplete])

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* X close */}
      <div className="flex justify-end px-4 pt-2">
        {onClose ? (
          <button onClick={onClose} className="p-1">
            <span className="text-xl leading-none text-text-gray">&times;</span>
          </button>
        ) : <div className="h-8" />}
      </div>

      {/* Title + dots */}
      <div className="flex flex-col items-center mt-6 px-8">
        <h2 className="text-lg font-bold text-text-dark text-center leading-snug whitespace-pre-line">{title}</h2>
        {subtitle && <p className="text-xs text-text-gray mt-2">{subtitle}</p>}

        <div className="flex gap-3 mt-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < pin.length ? 'bg-text-dark' : 'bg-gray-300'
            }`} />
          ))}
        </div>

        {error && (
          <p className="text-error text-sm mt-3 animate-fade-in">{error}</p>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Number pad */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-3 gap-y-1">
          {keys.map((key, i) => (
            <button key={i}
              onClick={() => key && handleKey(key)}
              disabled={!key}
              className={`py-4 text-center text-xl select-none ${
                key === '' ? '' : 'active:bg-gray-50 rounded-lg'
              } ${key === 'del' ? 'text-sm text-text-gray font-normal' : 'text-text-dark font-light'}`}>
              {key === 'del' ? t('pin_delete') : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
