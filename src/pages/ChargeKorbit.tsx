import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { ExternalLink, Loader2, CheckCircle, Smartphone, Shield, Key, Check } from 'lucide-react'
import { MOCK_RATES } from '../constants'

type Step = 'connect' | 'guide' | 'korbit-app' | 'korbit-approve' | 'korbit-done' | 'connected' | 'select' | 'confirm'

// Korbit assets fetched via API after OAuth (simulated)
const korbitAssets = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.042, rate: MOCK_RATES.BTC },
  { symbol: 'ETH', name: 'Ethereum', balance: 1.52, rate: MOCK_RATES.ETH },
  { symbol: 'XRP', name: 'Ripple', balance: 5000, rate: MOCK_RATES.XRP },
]

export default function ChargeKorbit() {
  const navigate = useNavigate()
  const { korbitConnected, connectKorbit } = useStore()
  const t = useT()
  const [step, setStep] = useState<Step>(korbitConnected ? 'select' : 'connect')
  const [asset, setAsset] = useState(korbitAssets[0])
  const [qty, setQty] = useState('')
  const numQty = parseFloat(qty || '0')
  const estimatedKrw = Math.floor(numQty * asset.rate)

  const handleStartAuth = () => {
    setStep('guide')
  }

  const handleOpenKorbitApp = () => {
    // Simulate: open Korbit app → approve → done
    setStep('korbit-app')
    setTimeout(() => setStep('korbit-approve'), 1500)
    setTimeout(() => {
      setStep('korbit-done')
      connectKorbit()
    }, 4000)
    setTimeout(() => setStep('connected'), 5500)
  }

  // ===== Step: Connect (intro) =====
  if (step === 'connect') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_connect_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-[#0052FF] flex items-center justify-center mb-6 shadow-lg shadow-[#0052FF]/20">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
            <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
          </svg>
        </div>
        <h2 className="text-center text-lg font-bold text-text-dark mb-2">{t('korbit_connect_heading')}</h2>
        <p className="text-center text-sm text-text-gray mb-6 whitespace-pre-line">{t('korbit_connect_desc')}</p>
        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-text-gray">
          <p>• {t('korbit_connect_note1')}</p>
          <p>• {t('korbit_connect_note2')}</p>
          <p>• {t('korbit_connect_note3')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleStartAuth} className="w-full py-4 bg-[#0052FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-[#0040CC]">
          <ExternalLink size={18} />{t('korbit_connect_btn')}
        </button>
      </div>
    </div>
  )

  // ===== Step: Guide (OAuth process explanation) =====
  if (step === 'guide') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_connect_title')} onBack={() => setStep('connect')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-base font-bold text-text-dark mb-1">{t('korbit_auth_guide_title')}</h2>
        <p className="text-xs text-text-gray mb-6">{t('korbit_auth_guide_desc')}</p>

        {/* OAuth steps */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-[#0052FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">{t('korbit_auth_step1')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('korbit_auth_step1_desc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">{t('korbit_auth_step2')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('korbit_auth_step2_desc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Key size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">{t('korbit_auth_step3')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('korbit_auth_step3_desc')}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-text-gray">{t('korbit_auth_note')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleOpenKorbitApp}
          className="w-full py-4 bg-[#0052FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-[#0040CC]">
          <Smartphone size={18} />
          {t('korbit_auth_open_app')}
        </button>
      </div>
    </div>
  )

  // ===== Korbit App Simulation (3 screens) =====
  if (step === 'korbit-app' || step === 'korbit-approve' || step === 'korbit-done') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#0a1628] animate-fade-in">
      {/* Korbit app header */}
      <div className="flex items-center justify-center py-4 border-b border-[#1a2a44]">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="mr-2">
          <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
        </svg>
        <span className="text-white font-bold text-sm">Korbit</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Loading Korbit app */}
        {step === 'korbit-app' && (
          <div className="animate-fade-in text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0052FF] flex items-center justify-center mb-6 mx-auto">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
                <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
              </svg>
            </div>
            <Loader2 size={24} className="text-[#0052FF] animate-spin mx-auto mb-4" />
            <p className="text-white text-sm">{t('korbit_connecting')}</p>
            <p className="text-gray-500 text-xs mt-1">{t('korbit_auth_waiting')}</p>
          </div>
        )}

        {/* Approve screen */}
        {step === 'korbit-approve' && (
          <div className="animate-fade-in w-full">
            <div className="bg-[#111d33] rounded-2xl p-6 mb-4">
              <h3 className="text-white text-base font-bold text-center mb-4">API Access Request</h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#0052FF] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-xs text-center mb-4">
                <span className="text-white font-medium">Beple Wallet</span> requests access to your Korbit account
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Check size={14} className="text-green-400" />
                  <span>View account balance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Check size={14} className="text-green-400" />
                  <span>Place sell orders</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Check size={14} className="text-green-400" />
                  <span>Withdraw KRW to linked bank</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 py-3 bg-[#1a2a44] text-gray-400 font-medium rounded-xl text-center text-sm">Deny</div>
              <div className="flex-1 py-3 bg-[#0052FF] text-white font-semibold rounded-xl text-center text-sm flex items-center justify-center gap-1.5">
                <Loader2 size={14} className="animate-spin" />
                Approve
              </div>
            </div>
          </div>
        )}

        {/* Approved */}
        {step === 'korbit-done' && (
          <div className="animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 mx-auto animate-bounce-in">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <p className="text-white font-bold text-base">Approved</p>
            <p className="text-gray-500 text-xs mt-2">{t('korbit_connecting_sub')}</p>
          </div>
        )}
      </div>
    </div>
  )

  // ===== Step: Connected success (first time only) =====
  if (step === 'connected') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('korbit_auth_success')}</p>
        <p className="text-sm text-text-gray mt-1">{t('korbit_auth_success_desc')}</p>
        <div className="mt-4 bg-[#0052FF]/5 rounded-xl p-4 w-full flex items-center gap-3">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M6 6h4.5v12H6V6z" fill="#0052FF"/><path d="M12 6l6 6-6 6V6z" fill="#0052FF"/>
          </svg>
          <p className="text-sm font-semibold text-text-dark">Korbit</p>
          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-auto">{t('otp_verified')}</span>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => setStep('select')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
      </div>
    </div>
  )

  // ===== Step: Select asset to sell (via Korbit API) =====
  if (step === 'select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_select_title')} />
      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <p className="text-xs text-text-gray mb-3">{t('korbit_select_asset')}</p>
        <div className="space-y-2 mb-6">
          {korbitAssets.map(a => (
            <button key={a.symbol} onClick={() => setAsset(a)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${asset.symbol === a.symbol ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${a.symbol === 'BTC' ? 'bg-orange-500' : a.symbol === 'ETH' ? 'bg-purple-500' : 'bg-gray-500'}`}>{a.symbol[0]}</div>
              <div className="text-left flex-1"><p className="font-semibold text-sm text-text-dark">{a.name} ({a.symbol})</p><p className="text-xs text-text-gray">{t('charge_coin_held')}: {a.balance} {a.symbol}</p></div>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-gray mb-2">{t('korbit_select_qty')}</p>
        <div className="flex items-center gap-2 mb-2">
          <input type="text" value={qty} onChange={e => setQty(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0"
            className="flex-1 text-right text-xl font-bold py-3 border-b-2 border-primary focus:outline-none" />
          <span className="text-sm text-text-gray font-medium">{asset.symbol}</span>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-xs text-text-light">{t('korbit_select_available')}: {asset.balance} {asset.symbol}</p>
          <button onClick={() => setQty(String(asset.balance))} className="text-xs text-primary font-medium">{t('korbit_select_max')}</button>
        </div>
        {numQty > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex justify-between text-sm"><span className="text-text-gray">{t('korbit_select_estimate')}</span><span className="text-primary font-bold">≈ {estimatedKrw.toLocaleString()} {t('won')}</span></div>
            <p className="text-[10px] text-text-light mt-1">{t('korbit_select_notice')}</p>
          </div>
        )}
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('confirm')} disabled={numQty <= 0}
          className={`w-full py-4 font-semibold rounded-xl ${numQty > 0 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('korbit_select_next')}</button>
      </div>
    </div>
  )

  // ===== Step: Confirm sell =====
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_confirm_title')} onBack={() => setStep('select')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-5">{t('korbit_confirm_heading')}</h2>
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_asset')}</span><span className="text-text-dark font-medium">{asset.symbol} ({asset.name})</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_qty')}</span><span className="text-text-dark font-medium">{numQty} {asset.symbol}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_price')}</span><span className="text-text-dark">{asset.rate.toLocaleString()} KRW</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-3"><span className="text-text-dark">{t('korbit_confirm_amount')}</span><span className="text-primary">{estimatedKrw.toLocaleString()} {t('won')}</span></div>
        </div>
        <div className="mt-4 bg-yellow-50 rounded-xl p-3">
          <p className="text-[11px] text-yellow-700 leading-relaxed whitespace-pre-line">{t('korbit_confirm_agree')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => navigate('/charge-korbit-processing', { state: { asset, qty: numQty, estimatedKrw } })}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl"
        >
          {t('korbit_confirm_btn')}
        </button>
      </div>
    </div>
  )
}
