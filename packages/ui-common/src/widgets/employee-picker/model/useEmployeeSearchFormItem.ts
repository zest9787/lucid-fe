import { Form } from 'antd'
import { useState } from 'react'
import type { EmployeeSearchItem } from '@entities/employee'
import type { EmployeeSearchFormItemProps, EmployeeSearchFormValues } from './types'

/** 자동완성/모달 선택 결과를 부모 Form의 회사·사번·사원명 필드와 연결한다. */
export function useEmployeeSearchFormItem({
  onCompanyChange,
  onSelect,
}: Pick<EmployeeSearchFormItemProps, 'onCompanyChange' | 'onSelect'>) {
  const form = Form.useFormInstance<EmployeeSearchFormValues>()
  const companyCode = Form.useWatch('companyCode', form)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const applyEmployee = (employee: EmployeeSearchItem) => {
    form.setFieldsValue({ employeeName: employee.name, employeeNo: employee.employeeNo })
    onSelect?.(employee)
  }

  const selectFromModal = (employee: EmployeeSearchItem) => {
    if (employee.companyCode !== companyCode) {
      // 회사 변경에 따른 부모의 연관 필드 초기화를 먼저 수행한 뒤 선택값을 적용한다.
      onCompanyChange?.()
      form.setFieldValue('companyCode', employee.companyCode)
    }
    applyEmployee(employee)
    setIsModalOpen(false)
  }

  return {
    companyCode,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    clearEmployeeName: () => form.setFieldValue('employeeName', ''),
    applyEmployee,
    selectFromModal,
  }
}
