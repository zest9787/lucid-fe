import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { ComponentRef } from 'react'
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
  minimumEnglishKeywordLength?: number
  minimumKoreanKeywordLength?: number
  minimumNumericKeywordLength?: number
  onCompanyChange?: () => void
  onSelect?: (employee: EmployeeSearchItem) => void
}

export function EmployeeSearchFormItem({
  label = '사원',
  minimumEnglishKeywordLength,
  minimumKoreanKeywordLength,
  minimumNumericKeywordLength,
  onCompanyChange,
  onSelect,
}: EmployeeSearchFormItemProps) {
  const form = Form.useFormInstance<EmployeeSearchFormValues>()
  const companyCode = Form.useWatch('companyCode', form)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const compactRef = useRef<ComponentRef<typeof Space.Compact>>(null)
  const [popupWidth, setPopupWidth] = useState<number>()

  useEffect(() => {
    const compact = compactRef.current?.nativeElement
    const employeeNo = compact?.querySelector<HTMLElement>(
      '.employee-search-form-item__number',
    )
    const employeeName = compact?.querySelector<HTMLElement>(
      '.employee-search-form-item__name',
    )

    if (!employeeNo || !employeeName) {
      return
    }

    const updatePopupWidth = () => {
      const width =
        employeeNo.getBoundingClientRect().width +
        employeeName.getBoundingClientRect().width

      if (width > 0) {
        setPopupWidth(width)
      }
    }

    const observer = new ResizeObserver(updatePopupWidth)
    observer.observe(employeeNo)
    observer.observe(employeeName)
    updatePopupWidth()

    return () => observer.disconnect()
  }, [])

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
        <Space.Compact ref={compactRef}>
          <Form.Item name="employeeNo" noStyle>
            <EmployeeAutoComplete
              className="employee-search-form-item__number"
              companyCode={companyCode}
              minimumEnglishKeywordLength={minimumEnglishKeywordLength}
              minimumKoreanKeywordLength={minimumKoreanKeywordLength}
              minimumNumericKeywordLength={minimumNumericKeywordLength}
              popupMatchSelectWidth={popupWidth}
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
            onClick={() => setIsModalOpen(true)}/>
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
