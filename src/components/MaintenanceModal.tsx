import { Wrench } from 'lucide-react'
import { Modal } from './Modal'
import { useT } from '../hooks/useT'

interface MaintenanceModalProps {
  open: boolean
  onClose: () => void
  onRetry?: () => void
}

export function MaintenanceModal({ open, onClose, onRetry }: MaintenanceModalProps) {
  const t = useT()

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Wrench size={32} className="text-text-gray" />
        </div>
        <h3 className="text-base font-semibold text-text-dark text-center mb-2">
          {t('state_maintenance_title')}
        </h3>
        <p className="text-sm text-text-gray text-center whitespace-pre-line mb-6">
          {t('state_maintenance_msg')}
        </p>
        <button
          onClick={onRetry || onClose}
          className="w-full py-3 bg-primary text-white font-medium rounded-xl"
        >
          {t('state_maintenance_retry')}
        </button>
      </div>
    </Modal>
  )
}
