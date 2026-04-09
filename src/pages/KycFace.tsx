import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react'

type FaceState = 'ready' | 'scanning' | 'done' | 'failed'

export default function KycFace() {
  const navigate = useNavigate()
  const t = useT()
  const [state, setState] = useState<FaceState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [matchScore, setMatchScore] = useState(0)

  const handleStart = () => {
    setState('scanning')
    let score = 0
    const scoreTimer = setInterval(() => {
      score += Math.random() * 8 + 2
      if (score > 95) score = 97
      setMatchScore(Math.floor(score))
    }, 200)

    setTimeout(() => {
      clearInterval(scoreTimer)
      const willFail = Math.random() < 0.2
      if (willFail) {
        setMatchScore(42)
        setFailCount(c => c + 1)
        setState('failed')
        toast(t('kyc_face_fail_msg'), 'error')
      } else {
        setMatchScore(97)
        setState('done')
        setTimeout(() => navigate('/kyc-verify'), 800)
      }
    }, 2500)
  }

  const handleRetry = () => {
    setState('ready')
    setMatchScore(0)
  }

  // === Failed State ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-fade-in">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white ml-3">{t('kyc_face_title')}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-[200px] h-[260px] mb-6">
          <svg viewBox="0 0 200 260" className="w-full h-full">
            <ellipse cx="100" cy="130" rx="90" ry="120" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="8 4" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/80 flex items-center justify-center">
              <AlertCircle size={32} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-red-500/20 rounded-xl px-4 py-3 mb-4 w-full">
          <p className="text-red-400 text-sm text-center whitespace-pre-line">{t('kyc_face_fail_msg')}</p>
        </div>
        <div className="w-full space-y-2 mb-4">
          {[t('kyc_face_tip_light'), t('kyc_face_tip_clear'), t('kyc_face_tip_straight')].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <span className="text-white/60 text-xs">{tip}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-8">
        <button onClick={handleRetry} className="w-full py-3.5 bg-[#2663eb] text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <RotateCcw size={18} />{t('kyc_face_retry')}
        </button>
      </div>
    </div>
  )

  // === Camera View ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#1f1f1f] animate-slide-in">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white ml-3">{t('kyc_face_title')}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-5">
        {/* Face Guide Oval */}
        <div className="relative w-[200px] h-[260px] mt-10">
          {/* Oval guide frame (dashed) */}
          <svg viewBox="0 0 200 260" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#555" />
                <stop offset="100%" stopColor="#333" />
              </radialGradient>
            </defs>
            {/* Oval border */}
            <ellipse cx="100" cy="130" rx="90" ry="120" fill="none"
              stroke={state === 'done' ? '#22c55e' : state === 'scanning' ? '#eab308' : '#666'}
              strokeWidth="3"
              strokeDasharray={state === 'ready' ? '8 4' : 'none'}
            />
          </svg>

          {/* Face placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] opacity-40">
              <defs>
                <radialGradient id="headGrad" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#888" />
                  <stop offset="100%" stopColor="#555" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="45" r="30" fill="url(#headGrad)" />
              <ellipse cx="60" cy="95" rx="35" ry="22" fill="url(#headGrad)" />
            </svg>
          </div>

          {/* Scanning line */}
          {state === 'scanning' && (
            <div className="absolute inset-0 overflow-hidden rounded-[50%]">
              <div className="absolute left-0 right-0 h-1 bg-yellow-400/60" style={{ animation: 'scanLine 1.5s linear infinite' }} />
            </div>
          )}

          {/* Score during scanning */}
          {state === 'scanning' && matchScore > 0 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-mono text-xs font-bold">{matchScore}%</span>
            </div>
          )}

          {/* Done checkmark */}
          {state === 'done' && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/80 flex items-center justify-center animate-bounce-in">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-auto mb-4 text-center">
          <p className="text-white text-base font-semibold">
            {state === 'scanning' ? t('kyc_face_scanning') :
             state === 'done' ? t('kyc_face_done') :
             '정면을 응시해주세요'}
          </p>
          <p className="text-[#999] text-[13px] mt-2">
            {state === 'scanning' ? t('kyc_face_matching') :
             state === 'done' ? t('kyc_face_done_sub') :
             'Look straight ahead'}
          </p>
        </div>

        {/* Done score */}
        {state === 'done' && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/50 text-xs">{t('kyc_face_score')}:</span>
            <span className="text-green-400 font-mono text-sm font-bold">{matchScore}%</span>
          </div>
        )}

        {/* Fail count */}
        {failCount > 0 && state === 'ready' && (
          <p className="text-amber-400 text-xs mb-2">⚠ {failCount} {t('attempt_count')}</p>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-5 pb-8">
        {state === 'ready' && (
          <button onClick={handleStart} className="w-full py-3.5 bg-[#2663eb] text-white font-semibold rounded-xl text-base active:bg-[#1d4fc7] transition-colors">
            {failCount > 0 ? t('kyc_face_retry') : t('kyc_face_start')}
          </button>
        )}
        {state === 'scanning' && (
          <div className="w-full py-3.5 bg-white/10 text-white/60 font-semibold rounded-xl text-center text-base">
            {t('kyc_face_processing')}
          </div>
        )}
      </div>
    </div>
  )
}
