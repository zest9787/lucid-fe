import { Modal, Typography } from 'antd'
import type { ReactNode } from 'react'
import { EmployeeSearchConditionForm, OrgUnitSearchTree } from '@features/employee-search'
import type { EmployeePickerModalProps } from '../model/types'
import type { EmployeePickerModel } from '../model/useEmployeePicker'
import './UserSearchModal.scss'

type Props = EmployeePickerModalProps & {
  model: EmployeePickerModel
  canSelect: boolean
  onSelect: () => void
  searchResult: ReactNode
  selectionPanel?: ReactNode
  description: ReactNode
}

/** 공통 모달 외형과 검색 UI. 선택 방식에 따른 결과 영역은 각 모달에서 구성한다. */
export function EmployeePickerModal({
  open,
  title = 'Employee Search',
  onCancel,
  model,
  canSelect,
  onSelect,
  searchResult,
  selectionPanel,
  description,
}: Props) {
  const isMultiple = selectionPanel != null
  const handleClose = () => {
    model.resetAll()
    onCancel()
  }

  return (
    <Modal
      centered
      destroyOnHidden
      open={open}
      title={title}
      width={isMultiple ? 1440 : 1120}
      onCancel={handleClose}
      onOk={onSelect}
      cancelText="Cancel"
      okText="Select"
      okButtonProps={{ disabled: !canSelect }}
      afterOpenChange={(visible) => {
        // 부모가 open을 직접 변경해 닫은 경우에도 다음 열기를 위한 상태를 정리한다.
        if (!visible) model.resetAll()
      }}
    >
      <section
        className={`user-search-modal${isMultiple ? ' user-search-modal--multi' : ''}`}
      >
        <EmployeeSearchConditionForm
          companies={model.companies}
          companySearchMode={model.companySearchMode}
          initialCompanyCode={model.companyCode}
          loading={model.loading.companies}
          onCompanyChange={model.changeCompany}
          onReset={model.resetSearch}
          onSearch={model.searchByCondition}
        />
        <div
          className={`user-search-modal__body${isMultiple ? ' user-search-modal__body--multi' : ''}`}
        >
          <aside className="user-search-modal__org-panel">
            <Typography.Title level={5}>Department</Typography.Title>
            <OrgUnitSearchTree
              key={model.companyCode ?? ''}
              loading={model.loading.orgUnits}
              orgUnits={model.orgUnits}
              selectedOrgUnitId={model.selectedOrgUnitId}
              onSelectOrgUnit={model.searchByOrgUnit}
            />
          </aside>
          <section className="user-search-modal__result-panel">
            <Typography.Title level={5}>Search Result</Typography.Title>
            {searchResult}
          </section>
          {selectionPanel}
        </div>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </section>
    </Modal>
  )
}
