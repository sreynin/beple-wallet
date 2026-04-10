import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { PermissionDialog } from '../components/PermissionDialog'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Zap } from 'lucide-react'

export default function PaymentScan() {
  const navigate = useNavigate()
  const t = useT()
  const { cameraPermissionGranted, setCameraPermissionGranted } = useStore()

  const [scanning, setScanning] = useState(false)
  // Show dialog only if permission has never been granted before
  const [permissionAsked, setPermissionAsked] = useState(false)

  const doScan = () => {
    setScanning(true)
    setTimeout(() => { navigate('/payment-confirm', { state: { merchant: t('pay_scan_demo_merchant'), amount: 12500 } }) }, 1500)
  }

  const handleScan = () => {
    if (!cameraPermissionGranted) {
      // First time — ask for permission
      setPermissionAsked(true)
      return
    }
    // Already granted — go straight to scan
    doScan()
  }

  const handlePermissionAllow = () => {
    setPermissionAsked(false)
    // Persist so the dialog never shows again
    setCameraPermissionGranted(true)
    doScan()
  }

  const handlePermissionDeny = () => {
    setPermissionAsked(false)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-black animate-slide-in">
      <Header title={t('pay_scan_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-white text-sm mb-6">{t('pay_scan_guide')}</p>
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 bg-gray-800/50 rounded-2xl" />
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />
          {cameraPermissionGranted && (
            <div className="absolute left-4 right-4 h-0.5 bg-primary/80" style={{ animation: 'scanLine 2s linear infinite' }} />
          )}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center animate-pulse-slow">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="text-white text-lg">✓</span></div>
              </div>
            </div>
          )}
          {!cameraPermissionGranted && !scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/40 text-xs">{t('state_permission_camera')}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-8 mt-8">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Zap size={18} className="text-white" /></div>
            <span className="text-[10px] text-white/60">{t('pay_scan_flash')}</span>
          </button>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={handleScan} disabled={scanning} className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark disabled:opacity-50">
          {scanning ? t('pay_scan_scanning') : t('pay_scan_simulate')}
        </button>
        <button className="w-full py-3 text-white/50 text-xs mt-1">{t('pay_scan_manual')}</button>
      </div>

      <PermissionDialog
        open={permissionAsked}
        onAllow={handlePermissionAllow}
        onDeny={handlePermissionDeny}
      />
    </div>
  )
}
