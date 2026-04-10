import { useState, useCallback } from 'react'
import { useT } from '../hooks/useT'
import { X } from 'lucide-react'

interface PinInputProps {
  title: string
  subtitle?: string
  error?: string
  onComplete: (pin: string) => void
  onClose?: () => void
  variant?: 'light' | 'dark'
}

export function PinInput({ title, subtitle, error, onComplete, onClose, variant = 'dark' }: PinInputProps) {
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

  const isDark = variant === 'dark'

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDark ? 'bg-[#1a2332]' : 'bg-white'}`}>
      {/* Close button */}
      {onClose && (
        <div className="flex justify-end px-4 pt-3">
          <button onClick={onClose} className={`p-1 rounded-full ${isDark ? 'active:bg-white/10' : 'active:bg-black/5'}`}>
            <X size={22} className={isDark ? 'text-white' : 'text-text-dark'} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <h2 className={`text-lg font-semibold text-center ${isDark ? 'text-white' : 'text-text-dark'}`}>{title}</h2>
        {subtitle && <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-text-gray'}`}>{subtitle}</p>}

        <div className="flex gap-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? isDark ? 'bg-white scale-110' : 'bg-primary scale-110'
                  : isDark ? 'bg-white/30' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4 animate-fade-in">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-0">
        {keys.map((key, i) => (
          <button
            key={i}
            onClick={() => key && handleKey(key)}
            disabled={!key}
            className={`h-16 flex items-center justify-center text-xl font-medium transition-colors
              ${key === '' ? 'cursor-default' : isDark ? 'active:bg-white/10' : 'active:bg-gray-100'}
              ${key === 'del'
                ? isDark ? 'text-white/60 text-base' : 'text-text-gray text-base'
                : isDark ? 'text-white' : 'text-text-dark'}
            `}
          >
            {key === 'del' ? t('pin_delete') : key}
          </button>
        ))}
      </div>
    </div>
  )
}
