import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

const initialData = {
  surname: 'SMITH',
  givenName: 'JOHN',
  birthDate: '1990.05.15',
  passportNo: 'M12345678',
  nationality: 'United States',
}

export default function KycConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setKycData, updateProfile } = useStore()
  const t = useT()
  const [form, setForm] = useState(initialData)

  const incomingState = location.state as { captured?: string[]; docType?: string } | null

  const handleSubmit = () => {
    // Save to KYC data
    setKycData(form)
    // Sync passport info to profile
    updateProfile({
      name: `${form.givenName} ${form.surname}`,
      passportNo: form.passportNo,
      nationality: form.nationality,
      birthDate: form.birthDate,
    })
    navigate('/kyc-passport', {
      state: {
        captured: incomingState?.captured || ['front'],
        docType: incomingState?.docType || 'passport',
      }
    })
  }

  const fields: { key: keyof typeof form; labelKey: Parameters<typeof t>[0]; placeholder: string; disabled?: boolean }[] = [
    { key: 'surname', labelKey: 'kyc_surname', placeholder: 'SMITH' },
    { key: 'givenName', labelKey: 'kyc_given_name', placeholder: 'JOHN' },
    { key: 'birthDate', labelKey: 'kyc_birth', placeholder: 'YYYY.MM.DD' },
    { key: 'passportNo', labelKey: 'kyc_passport_no', placeholder: 'M12345678' },
    { key: 'nationality', labelKey: 'kyc_nationality', placeholder: 'Country', disabled: true },
  ]

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('kyc_confirm_title')} />

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-text-dark mb-1">{t('kyc_confirm_heading')}</h2>
        <p className="text-sm text-text-gray mb-6 whitespace-pre-line">{t('kyc_confirm_desc')}</p>

        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-text-gray mb-1.5 block">{t(field.labelKey)}</label>
              <input
                type="text"
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark
                  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                  disabled:opacity-60 disabled:bg-gray-100 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 rounded-xl p-3">
          <p className="text-[10px] text-primary leading-relaxed whitespace-pre-line">{t('kyc_confirm_notice')}</p>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button onClick={handleSubmit} className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark">
          {t('next')}
        </button>
      </div>
    </div>
  )
}
