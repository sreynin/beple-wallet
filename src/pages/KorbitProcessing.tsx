import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw } from 'lucide-react'
import { Header } from '../components/Header'
import { useT } from '../hooks/useT'
import { useStore } from '../store/useStore'
import { KORBIT_WALLET_CONNECT_URL } from '../constants'

type TimelineStatus = 'done' | 'active' | 'pending'

type KorbitAsset = {
  symbol: string
  name: string
  balance: number
  rate: number
}

type LocationState = {
  asset: KorbitAsset
  qty: number
  estimatedKrw: number
}

function clampToNonNegativeInteger(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.floor(n))
}

export default function KorbitProcessing() {
  const navigate = useNavigate()
  const location = useLocation()
  const t = useT()
  const { chargeBippleMoney } = useStore()

  const state = (location.state || {}) as Partial<LocationState>
  const estimatedKrw = clampToNonNegativeInteger(state.estimatedKrw)

  type Phase = 'redirect' | 'fake' | 'timeline'
  const [phase, setPhase] = useState<Phase>('redirect')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (phase !== 'timeline') return
    const intervalId = window.setInterval(() => setTick(v => v + 1), 550)
    return () => window.clearInterval(intervalId)
  }, [phase])

  useEffect(() => {
    if (phase !== 'timeline') return
    if (estimatedKrw <= 0) return
    if (tick < 6) return
    chargeBippleMoney(estimatedKrw)
    navigate('/charge-complete', {
      replace: true,
      state: { amount: estimatedKrw, method: 'Korbit' },
    })
  }, [phase, chargeBippleMoney, estimatedKrw, navigate, tick])

  useEffect(() => {
    if (phase !== 'redirect') return
    const id = window.setTimeout(() => setPhase('fake'), 900)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'fake') return

    const tryOpenKorbit = () => {
      if (!KORBIT_WALLET_CONNECT_URL) return
      if (KORBIT_WALLET_CONNECT_URL.includes('undefined')) return
      if (KORBIT_WALLET_CONNECT_URL.includes('help.payprotocol.io')) return
      try {
        window.location.href = KORBIT_WALLET_CONNECT_URL
      } catch {
        // If deep-link fails, we still run the simulation and recover via visibility change.
      }
    }

    const goBackToTimeline = () => {
      setTick(0)
      setPhase('timeline')
    }

    // Try to open Korbit app (real deep link if configured).
    tryOpenKorbit()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') goBackToTimeline()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onVisibility)

    const fallbackId = window.setTimeout(goBackToTimeline, 15000)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onVisibility)
      window.clearTimeout(fallbackId)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'timeline') return
    setTick(0)
  }, [phase])

  const timeline = useMemo(() => {
    const requestStatus: TimelineStatus = tick >= 2 ? 'done' : 'active'
    const processingStatus: TimelineStatus =
      tick >= 4 ? 'done' : tick >= 2 ? 'active' : 'pending'
    const completeStatus: TimelineStatus = tick >= 6 ? 'done' : 'pending'

    return [
      {
        id: 'request',
        title: t('korbit_process_step_request_title'),
        desc: t('korbit_process_step_request_desc'),
        status: requestStatus,
      },
      {
        id: 'processing',
        title: t('korbit_process_step_processing_title'),
        desc: t('korbit_process_step_processing_desc'),
        status: processingStatus,
      },
      {
        id: 'complete',
        title: t('korbit_process_step_complete_title'),
        desc: t('korbit_process_step_complete_desc'),
        status: completeStatus,
      },
    ] as const
  }, [t, tick])

  if (phase === 'redirect') {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
        <Header title={t('korbit_process_title')} showBack={false} />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center text-center">
          <Loader2 size={48} className="text-primary animate-spin mb-4" />
          <h2 className="text-base font-bold text-text-dark">{t('korbit_redirecting')}</h2>
          <p className="text-xs text-text-gray mt-1 whitespace-pre-line">{t('korbit_redirecting_sub')}</p>
        </div>
      </div>
    )
  }

  if (phase === 'fake') {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
        <Header title={t('korbit_app_fake_title')} showBack={false} />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary text-3xl font-extrabold">K</span>
          </div>
          <Loader2 size={28} className="text-primary animate-spin mb-2" />
          <p className="text-sm font-semibold text-text-dark">{t('korbit_app_fake_desc')}</p>
          <p className="text-[11px] text-text-light mt-2">{t('korbit_redirecting_sub')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('korbit_process_title')} showBack={false} />

      <div className="flex-1 px-6 pt-6">
        <div className="relative pl-8">
          <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-border" />

          <div className="space-y-8">
            {timeline.map(item => {
              const isActive = item.status === 'active'
              const isDone = item.status === 'done'

              const markerClass = isDone
                ? 'w-9 h-9 rounded-xl border-2 border-transparent bg-green-600'
                : isActive
                  ? 'w-9 h-9 rounded-xl border-2 border-primary bg-gray-100 flex items-center justify-center'
                  : 'w-9 h-9 rounded-xl border-2 bg-gray-100 border-border'

              const titleClass = isActive
                ? 'text-base font-semibold text-primary'
                : isDone
                  ? 'text-base font-semibold text-green-700'
                  : 'text-base font-semibold text-text-gray'

              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-8 flex justify-center pt-0.5">
                    <div className={markerClass}>
                      {isActive ? (
                        <Loader2
                          size={18}
                          className="text-primary animate-spin"
                          style={{ animationDuration: '2s' }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={titleClass}>{item.title}</p>
                    <p className="text-xs text-text-gray leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="mt-8 flex items-center justify-center gap-2 text-sm text-primary"
            onClick={() => setTick(0)}
          >
            <RefreshCw size={14} />
            <span>{t('korbit_process_refresh')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

