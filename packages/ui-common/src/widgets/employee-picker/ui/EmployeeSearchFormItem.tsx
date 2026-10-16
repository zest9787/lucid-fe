import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space } from 'antd'
import { EmployeeAutoComplete } from '@features/employee-search'
import { useEmployeePopupWidth } from '../lib/useEmployeePopupWidth'
import { useEmployeeSearchFormItem } from '../model/useEmployeeSearchFormItem'
import type { EmployeeSearchFormItemProps } from '../model/types'
import { UserSearchModal } from './UserSearchModal'
import './EmployeeSearchFormItem.scss'

export function EmployeeSearchFormItem({
  label = '사원',
  minimumEnglishKeywordLength,
  minimumKoreanKeywordLength,
  minimumNumericKeywordLength,
  onCompanyChange,
  onSelect,
}: EmployeeSearchFormItemProps) {
  const model = useEmployeeSearchFormItem({ onCompanyChange, onSelect })
  const { compactRef, popupWidth } = useEmployeePopupWidth()

  return (
    <>
      <Form.Item
        className="common-search-form__field employee-search-form-item"
        label={label}
      >
        <Space.Compact ref={compactRef}>
          <Form.Item name="employeeNo" noStyle>
            <EmployeeAutoComplete
              className="employee-search-form-item__number"
              companyCode={model.companyCode}
              minimumEnglishKeywordLength={minimumEnglishKeywordLength}
              minimumKoreanKeywordLength={minimumKoreanKeywordLength}
              minimumNumericKeywordLength={minimumNumericKeywordLength}
              popupMatchSelectWidth={popupWidth}
              onChange={model.clearEmployeeName}
              onSelect={model.applyEmployee}
            />
          </Form.Item>
          <Form.Item name="employeeName" noStyle>
            <Input
              className="employee-search-form-item__name"
              placeholder="사원명"
              readOnly
            />
          </Form.Item>
          <Button htmlType="button" icon={<SearchOutlined />} onClick={model.openModal} />
        </Space.Compact>
      </Form.Item>
      <UserSearchModal
        open={model.isModalOpen}
        onCancel={model.closeModal}
        onSelect={model.selectFromModal}
      />
    </>
  )
}
