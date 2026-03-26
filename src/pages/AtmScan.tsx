import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { PermissionDialog } from '../components/PermissionDialog'
import { useT } from '../hooks/useT'

export default function AtmScan() {
  const navigate = useNavigate()
  const t = useT()
  const [scanning, setScanning] = useState(false)
  const [permissionAsked, setPermissionAsked] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const handleScan = () => {
    if (!permissionGranted) {
      setPermissionAsked(true)
      return
    }
    setScanning(true)
    setTimeout(() => navigate('/atm-amount'), 1500)
  }

  const handlePermissionAllow = () => {
    setPermissionAsked(false)
    setPermissionGranted(true)
    setScanning(true)
    setTimeout(() => navigate('/atm-amount'), 1500)
  }

  const handlePermissionDeny = () => {
    setPermissionAsked(false)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-black animate-slide-in">
      <Header title={t('atm_scan_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-white text-sm mb-6">{t('atm_scan_guide')}</p>
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 bg-gray-800/50 rounded-2xl" />
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-xl" />
          {permissionGranted && (
            <div className="absolute left-4 right-4 h-0.5 bg-green-400/80" style={{ animation: 'scanLine 2s linear infinite' }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center"><div className="text-5xl opacity-30">🏧</div></div>
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-lg">✓</span></div>
              </div>
            </div>
          )}
          {!permissionGranted && !scanning && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-white/40 text-xs text-center px-4">{t('state_permission_camera')}</p>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={handleScan} disabled={scanning} className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl active:bg-green-600 disabled:opacity-50">
          {scanning ? t('atm_scan_scanning') : t('atm_scan_simulate')}
        </button>
        <button className="w-full py-3 text-white/50 text-xs mt-1">{t('atm_scan_manual')}</button>
      </div>

      <PermissionDialog
        open={permissionAsked}
        onAllow={handlePermissionAllow}
        onDeny={handlePermissionDeny}
      />
    </div>
  )
}
