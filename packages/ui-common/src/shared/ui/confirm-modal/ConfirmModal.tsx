import { Modal } from 'antd'
import type { ButtonProps } from 'antd'
import type { ReactNode } from 'react'

export type ConfirmModalProps = {
  cancelText?: ReactNode
  children: ReactNode
  confirmButtonProps?: ButtonProps
  confirmLoading?: boolean
  confirmText?: ReactNode
  open: boolean
  title?: ReactNode
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  cancelText = '취소',
  children,
  confirmButtonProps,
  confirmLoading = false,
  confirmText = '확인',
  open,
  title = '확인',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      cancelText={cancelText}
      centered
      destroyOnHidden
      okButtonProps={{ ...confirmButtonProps, loading: confirmLoading }}
      okText={confirmText}
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      {children}
    </Modal>
  )
}
