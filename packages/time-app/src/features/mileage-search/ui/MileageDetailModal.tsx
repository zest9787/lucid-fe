import { Alert, Button, Descriptions, Modal, Spin } from 'antd'
import type { DescriptionsProps } from 'antd'
import type { MileageSearchViewModel } from '../model/useMileageSearch'
import './MileageDetailModal.scss'

type MileageDetailModalProps = {
  model: MileageSearchViewModel['detailModal']
}

export function MileageDetailModal({ model }: MileageDetailModalProps) {
  const items: DescriptionsProps['items'] = model.detail
    ? [
        { key: 'employeeNo', label: '사번', children: model.detail.employeeNo },
        { key: 'name', label: '이름', children: model.detail.name },
        {
          key: 'companyCode',
          label: '회사코드',
          children: model.detail.companyCode,
        },
        { key: 'department', label: '부서', children: model.detail.department },
        { key: 'team', label: '팀', children: model.detail.team },
        { key: 'position', label: '직위', children: model.detail.position },
        { key: 'jobTitle', label: '직책', children: model.detail.jobTitle },
        { key: 'role', label: '롤', children: model.detail.role },
        { key: 'hireDate', label: '입사일', children: model.detail.hireDate },
        {
          key: 'email',
          label: '이메일',
          children: model.detail.email,
          span: 2,
        },
        {
          key: 'phone',
          label: '연락처',
          children: model.detail.phone,
          span: 2,
        },
      ]
    : []

  return (
    <Modal
      destroyOnHidden
      footer={<Button onClick={model.onClose}>닫기</Button>}
      onCancel={model.onClose}
      open={model.open}
      title="직원 상세"
      width={680}
    >
      {model.error ? (
        <Alert
          description="잠시 후 다시 시도해 주세요."
          message="상세 정보를 조회하지 못했습니다."
          showIcon
          type="error"
        />
      ) : (
        <Spin spinning={model.loading}>
          <div className="mileage-detail-modal__content">
            {model.detail && (
              <Descriptions bordered column={2} items={items} size="small" />
            )}
          </div>
        </Spin>
      )}
    </Modal>
  )
}
