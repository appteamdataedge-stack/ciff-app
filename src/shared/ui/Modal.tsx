import type { ReactNode } from 'react'
import Button from './Button'

function Modal({ open, isOpen, title, children, onClose, onConfirm, confirmText = 'OK' }: {
  open?: boolean
  isOpen?: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
}) {
  const isModalOpen = open || isOpen
  if (!isModalOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-4 py-3 border-b font-medium">{title}</div>
        <div className="p-4 text-sm text-gray-700">{children}</div>
        <div className="px-4 py-3 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
        </div>
      </div>
    </div>
  )
}

export default Modal


