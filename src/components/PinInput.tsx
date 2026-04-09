import { useState, useCallback } from 'react'
import { useT } from '../hooks/useT'

interface PinInputProps {
  title: string
  subtitle?: string
  error?: string
  onComplete: (pin: string) => void
  /** When provided, a Face ID button appears in the bottom-left key slot */
  onFaceId?: () => void
}

// Inline Face ID SVG icon — matches iOS Face ID symbol style
function FaceIdIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Corner brackets */}
      <path d="M4 12 V5 Q5 4 12 4" />
      <path d="M28 4 Q35 4 36 5 V12" />
      <path d="M36 28 V35 Q35 36 28 36" />
      <path d="M12 36 Q5 36 4 35 V28" />
      {/* Eyes */}
      <line x1="15" y1="16" x2="15" y2="19" />
      <line x1="25" y1="16" x2="25" y2="19" />
      {/* Nose */}
      <path d="M20 17 L20 23" />
      {/* Smile */}
      <path d="M14 26 Q20 31 26 26" />
    </svg>
  )
}

export function PinInput({ title, subtitle, error, onComplete, onFaceId }: PinInputProps) {
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

  // Key layout: bottom-left slot is FaceID (or empty if not provided)
  const keys = ['1','2','3','4','5','6','7','8','9','faceid','0','del']

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
        {keys.map((key, i) => {
          // Face ID slot
          if (key === 'faceid') {
            return (
              <button
                key={i}
                onClick={onFaceId}
                disabled={!onFaceId}
                aria-label={t('pin_faceid_use')}
                className={`h-16 flex items-center justify-center transition-colors
                  ${onFaceId ? 'text-text-dark active:bg-gray-200' : 'cursor-default text-transparent'}
                `}
              >
                {onFaceId && <FaceIdIcon size={28} />}
              </button>
            )
          }

          return (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className={`h-16 flex items-center justify-center text-xl font-medium transition-colors active:bg-gray-200
                ${key === 'del' ? 'text-text-gray text-base' : 'text-text-dark'}
              `}
            >
              {key === 'del' ? t('pin_delete') : key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
