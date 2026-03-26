import { useState, useCallback } from 'react'
import { useT } from '../hooks/useT'

interface PinInputProps {
  title: string
  subtitle?: string
  error?: string
  onComplete: (pin: string) => void
}

export function PinInput({ title, subtitle, error, onComplete }: PinInputProps) {
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">
        <h2 className="text-lg font-semibold text-text-dark text-center">{title}</h2>
        {subtitle && <p className="text-sm text-text-gray mt-1">{subtitle}</p>}

        <div className="flex gap-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                i < pin.length ? 'bg-primary scale-110' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-error text-sm mt-4 animate-fade-in">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-0 bg-gray-50 border-t border-border">
        {keys.map((key, i) => (
          <button
            key={i}
            onClick={() => key && handleKey(key)}
            disabled={!key}
            className={`h-16 flex items-center justify-center text-xl font-medium transition-colors
              ${key === '' ? 'cursor-default' : 'active:bg-gray-200'}
              ${key === 'del' ? 'text-text-gray text-base' : 'text-text-dark'}
            `}
          >
            {key === 'del' ? t('pin_delete') : key}
          </button>
        ))}
      </div>
    </div>
  )
}
