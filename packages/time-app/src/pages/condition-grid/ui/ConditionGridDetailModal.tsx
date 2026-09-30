import { Alert, Button, Descriptions, Modal, Spin } from 'antd'
import type { DescriptionsProps } from 'antd'
import type { ConditionGridDetail } from '../model/types'

type ConditionGridDetailModalProps = {
  detail?: ConditionGridDetail
  loading: boolean
  open: boolean
  error: boolean
  onClose: () => void
}

export function ConditionGridDetailModal({
  detail,
  loading,
  open,
  error,
  onClose,
}: ConditionGridDetailModalProps) {
  const items: DescriptionsProps['items'] = detail
    ? [
        { key: 'employeeNo', label: '사번', children: detail.employeeNo },
        { key: 'name', label: '이름', children: detail.name },
        { key: 'companyCode', label: '회사코드', children: detail.companyCode },
        { key: 'department', label: '부서', children: detail.department },
        { key: 'position', label: '직위', children: detail.position },
        { key: 'jobTitle', label: '직책', children: detail.jobTitle },
        { key: 'role', label: '롤', children: detail.role },
        { key: 'hireDate', label: '입사일', children: detail.hireDate },
        { key: 'email', label: '이메일', children: detail.email, span: 2 },
        { key: 'phone', label: '연락처', children: detail.phone, span: 2 },
      ]
    : []

  return (
    <Modal
      destroyOnHidden
      footer={<Button onClick={onClose}>닫기</Button>}
      onCancel={onClose}
      open={open}
      title="직원 상세"
      width={680}
    >
      {error ? (
        <Alert
          description="잠시 후 다시 시도해 주세요."
          message="상세 정보를 조회하지 못했습니다."
          showIcon
          type="error"
        />
      ) : (
        <Spin spinning={loading}>
          <div className="condition-grid-detail-modal__content">
            {detail && <Descriptions bordered column={2} items={items} size="small" />}
          </div>
        </Spin>
      )}
    </Modal>
  )
}
