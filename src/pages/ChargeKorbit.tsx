import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { ExternalLink, Loader2, CheckCircle, Smartphone, Shield, Key, Check } from 'lucide-react'
import { MOCK_RATES } from '../constants'

type Step = 'connect' | 'guide'
  | 'kb-loading' | 'kb-guide' | 'kb-account' | 'kb-terms' | 'kb-code' | 'kb-password' | 'kb-done'
  | 'connected' | 'select' | 'confirm'

// Korbit assets fetched via API after OAuth (simulated)
const korbitAssets = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.042, rate: MOCK_RATES.BTC },
  { symbol: 'ETH', name: 'Ethereum', balance: 1.52, rate: MOCK_RATES.ETH },
  { symbol: 'XRP', name: 'Ripple', balance: 5000, rate: MOCK_RATES.XRP },
]

export default function ChargeKorbit() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromOnboarding = (location.state as any)?.fromOnboarding === true
  const { korbitConnected, connectKorbit } = useStore()
  const t = useT()
  const [step, setStep] = useState<Step>(korbitConnected ? 'select' : 'connect')
  const [asset, setAsset] = useState(korbitAssets[0])
  const [qty, setQty] = useState('')
  const numQty = parseFloat(qty || '0')
  const estimatedKrw = Math.floor(numQty * asset.rate)

  const handleStartAuth = () => {
    navigate('/coins', { state: { from: fromOnboarding ? 'onboarding' : 'korbit-charge' } })
  }

  const handleOpenKorbitApp = () => {
    setStep('kb-loading')
    setTimeout(() => setStep('kb-guide'), 1500)
  }

  // ===== Step: Connect (intro) =====
  if (step === 'connect') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_connect_title')} />
      <div className="flex-1 px-6 pt-8 overflow-y-auto">
        {/* Korbit Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold text-text-dark mb-2">{t('korbit_connect_heading')}</h2>
        <p className="text-center text-sm text-text-gray whitespace-pre-line mb-8">{t('korbit_connect_desc')}</p>

        {/* Notes */}
        <div className="w-full bg-gray-50 rounded-xl p-5 space-y-3 text-sm text-text-gray">
          <p>• {t('korbit_connect_note1')}</p>
          <p>• {t('korbit_connect_note2')}</p>
          <p>• {t('korbit_connect_note3')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleStartAuth} className="w-full py-4 bg-[#2563EB] text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-[#1d4fc7]">
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

  // ===== Korbit App Simulation (full multi-step) =====
  const isKbStep = step.startsWith('kb-')
  const kbStepNum = step === 'kb-loading' ? 0 : step === 'kb-guide' ? 1 : step === 'kb-account' ? 2 : step === 'kb-terms' ? 3 : step === 'kb-code' ? 4 : step === 'kb-password' ? 5 : step === 'kb-done' ? 6 : -1

  if (isKbStep) return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-[#0a1628] animate-fade-in">
      {/* Korbit app header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a2a44]">
        {kbStepNum > 1 && (
          <button onClick={() => {
            if (step === 'kb-account') setStep('kb-guide')
            else if (step === 'kb-terms') setStep('kb-account')
            else if (step === 'kb-code') setStep('kb-terms')
            else if (step === 'kb-password') setStep('kb-code')
          }} className="text-gray-400 text-sm">‹</button>
        )}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
          </svg>
          <span className="text-white font-bold text-sm">Korbit</span>
        </div>
        <div className="w-4" />
      </div>

      {/* Step progress inside Korbit app */}
      {kbStepNum >= 1 && kbStepNum <= 5 && (
        <div className="flex gap-1 px-5 pt-3">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`flex-1 h-1 rounded-full ${n <= kbStepNum ? 'bg-[#0052FF]' : 'bg-[#1a2a44]'}`} />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 pt-5 overflow-y-auto">

        {/* 0. Loading */}
        {step === 'kb-loading' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-[#0052FF] flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
                <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
              </svg>
            </div>
            <Loader2 size={24} className="text-[#0052FF] animate-spin mb-4" />
            <p className="text-white text-sm">{t('korbit_connecting')}</p>
          </div>
        )}

        {/* 1. 연동 Guide */}
        {step === 'kb-guide' && (
          <div className="animate-fade-in">
            <h3 className="text-white text-base font-bold mb-2">{t('korbit_auth_guide_title')}</h3>
            <p className="text-gray-400 text-xs mb-5">{t('korbit_auth_guide_desc')}</p>
            <div className="space-y-3">
              {[
                { icon: Shield, label: t('korbit_auth_step1'), desc: t('korbit_auth_step1_desc') },
                { icon: Key, label: t('korbit_auth_step2'), desc: t('korbit_auth_step2_desc') },
                { icon: CheckCircle, label: t('korbit_auth_step3'), desc: t('korbit_auth_step3_desc') },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#111d33] rounded-xl">
                  <s.icon size={18} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{s.label}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 계좌 연결 안내 */}
        {step === 'kb-account' && (
          <div className="animate-fade-in">
            <h3 className="text-white text-base font-bold mb-2">{t('kb_account_title')}</h3>
            <p className="text-gray-400 text-xs mb-5">{t('kb_account_desc')}</p>
            <div className="bg-[#111d33] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{t('kb_account_email')}</span>
                <span className="text-white text-sm">user@korbit.co.kr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{t('kb_account_level')}</span>
                <span className="text-[#0052FF] text-sm font-medium">Level 2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{t('kb_account_bank')}</span>
                <span className="text-white text-sm">신한은행 110-***-***901</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. 이용 동의 */}
        {step === 'kb-terms' && (
          <div className="animate-fade-in">
            <h3 className="text-white text-base font-bold mb-2">{t('kb_terms_title')}</h3>
            <p className="text-gray-400 text-xs mb-5">{t('kb_terms_desc')}</p>
            <div className="space-y-2">
              {[
                { label: t('kb_terms_api'), checked: true },
                { label: t('kb_terms_data'), checked: true },
                { label: t('kb_terms_trade'), checked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#111d33] rounded-xl">
                  <div className="w-5 h-5 rounded bg-[#0052FF] flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-300 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 인증 코드 확인 */}
        {step === 'kb-code' && (
          <div className="animate-fade-in">
            <h3 className="text-white text-base font-bold mb-2">{t('kb_code_title')}</h3>
            <p className="text-gray-400 text-xs mb-6">{t('kb_code_desc')}</p>
            <div className="flex justify-center gap-3 mb-6">
              {['3','8','2','7','1','5'].map((d, i) => (
                <div key={i} className="w-10 h-12 rounded-lg bg-[#111d33] border border-[#0052FF]/50 flex items-center justify-center">
                  <span className="text-white text-lg font-bold font-mono">{d}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-[10px]">{t('kb_code_sent')}</p>
          </div>
        )}

        {/* 5. 비밀번호 입력 */}
        {step === 'kb-password' && (
          <div className="animate-fade-in">
            <h3 className="text-white text-base font-bold mb-2">{t('kb_password_title')}</h3>
            <p className="text-gray-400 text-xs mb-6">{t('kb_password_desc')}</p>
            <div className="bg-[#111d33] rounded-xl p-4 mb-4">
              <p className="text-gray-500 text-xs mb-2">{t('kb_password_label')}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#0052FF]" />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#111d33] rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-2">2FA (OTP)</p>
              <div className="flex gap-2">
                {['4','9','1','0','7','3'].map((d, i) => (
                  <span key={i} className="text-white font-mono font-bold">{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. 인증 완료 */}
        {step === 'kb-done' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-bounce-in">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <p className="text-white font-bold text-base">{t('kb_done_title')}</p>
            <p className="text-gray-500 text-xs mt-2">{t('kb_done_desc')}</p>
          </div>
        )}
      </div>

      {/* Bottom button */}
      {kbStepNum >= 1 && (
        <div className="px-6 pb-8 pt-4">
          <button onClick={() => {
            if (step === 'kb-guide') setStep('kb-account')
            else if (step === 'kb-account') setStep('kb-terms')
            else if (step === 'kb-terms') setStep('kb-code')
            else if (step === 'kb-code') setStep('kb-password')
            else if (step === 'kb-password') {
              setStep('kb-done')
              connectKorbit()
              setTimeout(() => setStep('connected'), 1500)
            }
            else if (step === 'kb-done') setStep('connected')
          }}
            className="w-full py-4 bg-[#0052FF] text-white font-semibold rounded-xl active:bg-[#0040CC]">
            {step === 'kb-done' ? t('confirm') : t('next')}
          </button>
        </div>
      )}
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
        <button onClick={() => fromOnboarding ? navigate('/terms') : setStep('select')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
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
          <p className={`text-xs ${numQty > asset.balance ? 'text-error font-medium' : 'text-text-light'}`}>{t('korbit_select_available')}: {asset.balance} {asset.symbol}</p>
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
        <button onClick={() => setStep('confirm')} disabled={numQty <= 0 || numQty > asset.balance}
          className={`w-full py-4 font-semibold rounded-xl ${numQty > 0 && numQty <= asset.balance ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('korbit_select_next')}</button>
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
