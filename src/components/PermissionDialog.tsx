import { Camera } from 'lucide-react'
import { Modal } from './Modal'
import { useT } from '../hooks/useT'

interface PermissionDialogProps {
  open: boolean
  onAllow: () => void
  onDeny: () => void
}

export function PermissionDialog({ open, onAllow, onDeny }: PermissionDialogProps) {
  const t = useT()

  return (
    <Modal open={open} onClose={onDeny}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Camera size={32} className="text-primary" />
        </div>
        <h3 className="text-base font-semibold text-text-dark text-center mb-2">
          {t('state_permission_title')}
        </h3>
        <p className="text-sm text-text-gray text-center mb-6">
          {t('state_permission_camera')}
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onDeny}
            className="flex-1 py-3 bg-gray-100 text-text-gray font-medium rounded-xl"
          >
            {t('state_permission_deny')}
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-3 bg-primary text-white font-medium rounded-xl"
          >
            {t('state_permission_allow')}
          </button>
        </div>
      </div>
    </Modal>
  )
}
