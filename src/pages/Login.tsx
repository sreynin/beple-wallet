import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Wallet, UserPlus } from 'lucide-react'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const t = useT()

  const handleSocialLogin = (method: 'google' | 'apple') => {
    login(method)
    navigate('/terms')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
          <Wallet size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark mb-1">{t('login_title')}</h1>
        <p className="text-sm text-text-gray mb-10">{t('login_subtitle')}</p>

        <div className="w-full space-y-3">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-white border-2 border-border rounded-xl active:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="font-medium text-text-dark">{t('login_google')}</span>
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-black text-white rounded-xl active:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <span className="font-medium">{t('login_apple')}</span>
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-light">{t('login_or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign Up */}
          <button
            onClick={() => navigate('/signup')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-primary/5 border-2 border-primary/20 rounded-xl active:bg-primary/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus size={18} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium text-primary block">{t('login_signup')}</span>
              <span className="text-[10px] text-text-gray">{t('login_signup_desc')}</span>
            </div>
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-text-light px-10 pb-6">
        {t('login_agree')}
      </p>
    </div>
  )
}
