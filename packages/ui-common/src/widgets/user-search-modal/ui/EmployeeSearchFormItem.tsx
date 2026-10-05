import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space } from 'antd'
import { useState } from 'react'
import type { EmployeeSearchItem } from '@entities/employee'
import { EmployeeAutoComplete } from './EmployeeAutoComplete'
import { UserSearchModal } from './UserSearchModal'
import './EmployeeSearchFormItem.scss'

type EmployeeSearchFormValues = {
  companyCode?: string
  employeeName?: string
  employeeNo?: string
}

type EmployeeSearchFormItemProps = {
  label?: string
  onCompanyChange?: () => void
  onSelect?: (employee: EmployeeSearchItem) => void
}

export function EmployeeSearchFormItem({
  label = '사원',
  onCompanyChange,
  onSelect,
}: EmployeeSearchFormItemProps) {
  const form = Form.useFormInstance<EmployeeSearchFormValues>()
  const companyCode = Form.useWatch('companyCode', form)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const applyEmployee = (employee: EmployeeSearchItem) => {
    form.setFieldsValue({
      employeeName: employee.name,
      employeeNo: employee.employeeNo,
    })
    onSelect?.(employee)
  }

  return (
    <>
      <Form.Item
        className="common-search-form__field employee-search-form-item"
        label={label}
      >
        <Space.Compact>
          <Form.Item name="employeeNo" noStyle>
            <EmployeeAutoComplete
              className="employee-search-form-item__number"
              companyCode={companyCode}
              onChange={() => form.setFieldValue('employeeName', '')}
              onSelect={applyEmployee}
            />
          </Form.Item>
          <Form.Item name="employeeName" noStyle>
            <Input
              className="employee-search-form-item__name"
              placeholder="사원명"
              readOnly
            />
          </Form.Item>
          <Button
            htmlType="button"
            icon={<SearchOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            사원검색
          </Button>
        </Space.Compact>
      </Form.Item>
      <UserSearchModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSelect={(employee) => {
          if (employee.companyCode !== companyCode) {
            onCompanyChange?.()
            form.setFieldValue('companyCode', employee.companyCode)
          }
          applyEmployee(employee)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
