import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { toast } from '../components/Toast'
import { Camera, ShieldCheck, ShieldX, User, Globe } from 'lucide-react'

const loginMethodLabels: Record<string, { ko: string; en: string; zh: string; color: string }> = {
  google: { ko: 'Google 계정', en: 'Google Account', zh: 'Google账户', color: 'bg-red-50 text-red-600' },
  apple: { ko: 'Apple 계정', en: 'Apple Account', zh: 'Apple账户', color: 'bg-gray-100 text-gray-800' },
  korbit: { ko: 'Korbit 계정', en: 'Korbit Account', zh: 'Korbit账户', color: 'bg-blue-50 text-[#0052FF]' },
  email: { ko: '이메일 계정', en: 'Email Account', zh: '邮箱账户', color: 'bg-orange-50 text-orange-600' },
  phone: { ko: '휴대폰 인증', en: 'Phone', zh: '手机验证', color: 'bg-green-50 text-green-600' },
  passport: { ko: '여권 인증', en: 'Passport', zh: '护照验证', color: 'bg-green-50 text-green-600' },
}

export default function Profile() {
  const { profile, updateProfile, isKycComplete, loginMethod, language, userType } = useStore()
  const t = useT()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  const changed = name !== profile.name || email !== profile.email || phone !== profile.phone

  const handleSave = () => {
    updateProfile({ name, email, phone })
    toast(t('profile_saved'))
  }

  // Foreigners use passport KYC, not phone verification — override login method label
  const effectiveLoginMethod = (userType === 'foreigner' && isKycComplete) ? 'passport' : loginMethod
  const methodInfo = effectiveLoginMethod ? loginMethodLabels[effectiveLoginMethod] : null
  const methodLabel = methodInfo ? methodInfo[language as 'ko' | 'en' | 'zh'] || methodInfo.en : ''

  const maskResidenceId = (id: string) => {
    if (!id || id.length < 8) return id
    return id.slice(0, 8) + '******'
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('profile_title')} />

      <div className="flex-1 overflow-y-auto">
        {/* Avatar + Info */}
        <div className="bg-white px-6 pt-6 pb-5 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
              {profile.name[0] || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm active:bg-gray-50">
              <Camera size={13} className="text-text-gray" />
            </button>
          </div>
          <p className="text-base font-bold text-text-dark">{profile.name}</p>
          <p className="text-xs text-text-gray mt-0.5">{profile.email}</p>

          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            {/* User type badge */}
            {userType && (
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                userType === 'domestic'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600'
              }`}>
                {userType === 'domestic' ? <User size={11} /> : <Globe size={11} />}
                {userType === 'domestic' ? t('profile_domestic') : t('profile_foreigner')}
              </span>
            )}

            {/* Login method badge */}
            {methodInfo && (
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${methodInfo.color}`}>
                {loginMethod === 'korbit' && (
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" className="flex-shrink-0">
                    <path d="M6 6h4.5v12H6V6z" fill="currentColor"/><path d="M12 6l6 6-6 6V6z" fill="currentColor"/>
                  </svg>
                )}
                {methodLabel}
              </span>
            )}

            {/* KYC badge */}
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${
              isKycComplete ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
            }`}>
              {isKycComplete ? <><ShieldCheck size={11} />{t('profile_kyc_verified')}</> : <><ShieldX size={11} />{t('profile_kyc_not')}</>}
            </span>
          </div>
        </div>

        {/* Basic Info (editable) */}
        <div className="p-4">
          <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('profile_basic_info')}</p>
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('profile_name')}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('profile_email')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('profile_phone')}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            {/* Login method (read-only) */}
            {methodInfo && (
              <div>
                <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('profile_login_method')}</label>
                <div className="px-4 py-3 bg-gray-100 border border-border rounded-xl text-sm text-text-dark flex items-center gap-2">
                  {loginMethod === 'korbit' && (
                    <div className="w-5 h-5 rounded bg-[#0052FF] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none">
                        <path d="M6 6h4.5v12H6V6z" fill="white"/><path d="M12 6l6 6-6 6V6z" fill="white"/>
                      </svg>
                    </div>
                  )}
                  {loginMethod === 'google' && (
                    <svg viewBox="0 0 24 24" width="16" height="16" className="flex-shrink-0">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {loginMethod === 'apple' && <span className="text-base">🍎</span>}
                  {loginMethod === 'email' && <span className="text-base">✉️</span>}
                  {loginMethod === 'phone' && <span className="text-base">📱</span>}
                  <span>{methodLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Type Info */}
        {userType && (
          <div className="px-4 pb-4">
            <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('profile_type_info')}</p>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-text-gray">{t('profile_usertype')}</span>
                <span className={`flex items-center gap-1.5 text-sm font-medium ${
                  userType === 'domestic' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {userType === 'domestic' ? <User size={14} /> : <Globe size={14} />}
                  {userType === 'domestic' ? t('profile_domestic') : t('profile_foreigner')}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-text-gray">{t('profile_charging_method')}</span>
                <span className="text-sm text-text-dark">
                  {userType === 'domestic' ? t('profile_domestic_charge') : t('profile_foreigner_charge')}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-text-gray">{t('profile_charge_limit')}</span>
                <span className="text-sm font-medium text-text-dark">
                  {userType === 'foreigner' ? '1,000,000 KRW' : '2,000,000 KRW'}
                </span>
              </div>

              {/* Domestic: Residence ID */}
              {userType === 'domestic' && profile.residenceId && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-gray">{t('profile_residence_id')}</span>
                  <span className="text-sm font-mono text-text-dark">{maskResidenceId(profile.residenceId)}</span>
                </div>
              )}

              {/* Domestic: Real-name verification status */}
              {userType === 'domestic' && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-text-gray">{t('profile_realname_verified')}</span>
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <ShieldCheck size={14} />
                    {t('confirm')}
                  </span>
                </div>
              )}

              {/* Foreigner: description */}
              {userType === 'foreigner' && (
                <div className="py-2">
                  <p className="text-xs text-text-gray">{t('profile_foreigner_desc')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KYC Info (read-only, shown only after KYC for foreigners) */}
        {isKycComplete && userType === 'foreigner' && (profile.passportNo || profile.nationality) && (
          <div className="px-4 pb-4">
            <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('profile_kyc_info')}</p>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              {profile.passportNo && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-gray">{t('profile_passport')}</span>
                  <span className="text-sm font-mono text-text-dark">{profile.passportNo}</span>
                </div>
              )}
              {profile.nationality && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-gray">{t('profile_nationality')}</span>
                  <span className="text-sm text-text-dark">{profile.nationality}</span>
                </div>
              )}
              {profile.birthDate && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-text-gray">{t('profile_birthdate')}</span>
                  <span className="text-sm text-text-dark">{profile.birthDate}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={handleSave}
          disabled={!changed}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${
            changed ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}
        >
          {t('profile_save')}
        </button>
      </div>
    </div>
  )
}
