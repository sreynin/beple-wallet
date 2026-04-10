import { useState, useEffect } from 'react'

interface FaceIdScreenProps {
  onComplete: () => void
  onCancel: () => void
}

export function FaceIdScreen({ onComplete, onCancel }: FaceIdScreenProps) {
  const [phase, setPhase] = useState<'scanning' | 'success'>('scanning')

  useEffect(() => {
    // Simulate FaceID scanning for 2s, then success, then proceed
    const successTimer = setTimeout(() => setPhase('success'), 2000)
    const completeTimer = setTimeout(() => onComplete(), 3000)

    return () => {
      clearTimeout(successTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      {/* Back button */}
      <div className="px-4 pt-3">
        <button onClick={onCancel} className="p-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Face icon */}
      <div className="flex justify-center mt-2">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-colors duration-500 ${
          phase === 'success' ? 'bg-green-500' : 'bg-[#1C1C1E]'
        }`}>
          {phase === 'success' ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="animate-bounce-in">
              <path d="M10 21l7 7 13-15" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className={phase === 'scanning' ? 'animate-pulse' : ''}>
              <path d="M6 14V8a4 4 0 014-4h6M28 4h6a4 4 0 014 4v6M6 30v6a4 4 0 004 4h6M28 40h6a4 4 0 004-4v-6" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="18" r="2" fill="#4ADE80"/>
              <circle cx="28" cy="18" r="2" fill="#4ADE80"/>
              <path d="M16 28c2 3 10 3 12 0" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M28 22c2 0 4 0 4-2" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-bold text-text-dark leading-snug">
          {phase === 'success' ? 'Face ID 인증 완료' : '거래승인번호\n6자리를 입력해 주세요'.split('\n').map((l, i) => <span key={i}>{l}<br/></span>)}
        </h2>
      </div>

      {/* Status message */}
      {phase === 'scanning' && (
        <div className="px-6 mt-3">
          <p className="text-sm text-primary animate-pulse">Face ID 인증 중...</p>
        </div>
      )}
      {phase === 'success' && (
        <div className="px-6 mt-3">
          <p className="text-sm text-green-500">인증이 완료되었습니다</p>
        </div>
      )}

      {/* PIN dashes */}
      <div className="flex justify-center gap-5 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-6 flex items-center justify-center">
            {phase === 'success'
              ? <div className="w-3 h-3 rounded-full bg-green-500" />
              : <div className="w-6 h-[2px] bg-gray-400" />
            }
          </div>
        ))}
      </div>

      {/* Bordered link */}
      <div className="flex justify-center mt-8">
        <button className="px-5 py-2.5 border border-gray-200 rounded-full text-[13px] text-text-gray">
          거래승인번호 없이 결제하기 &gt;
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset link */}
      <div className="flex justify-center mb-4">
        <button className="text-[13px] text-text-gray">거래승인번호 재설정 &gt;</button>
      </div>

      {/* Dimmed number pad (non-interactive during scan) */}
      <div className={`border-t border-gray-100 px-4 pb-4 pt-2 transition-opacity duration-300 ${
        phase === 'scanning' ? 'opacity-30 pointer-events-none' : 'opacity-30 pointer-events-none'
      }`}>
        <div className="grid grid-cols-4 gap-y-0">
          {['8','3','0','5','7','4','9','2','1','6','',''].map((num, i) => (
            <div key={i} className="py-3.5 text-center text-[22px] font-light text-text-dark">{num}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
