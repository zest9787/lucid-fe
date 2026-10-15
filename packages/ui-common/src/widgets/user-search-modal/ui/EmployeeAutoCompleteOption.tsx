import { UserOutlined } from '@ant-design/icons'
import type { EmployeeSearchItem } from '@entities/employee'
import { EmployeeOptionRow } from './EmployeeAutoComplete.styles'

type EmployeeAutoCompleteOptionProps = {
  employee: EmployeeSearchItem
}

export function EmployeeAutoCompleteOption({
  employee,
}: EmployeeAutoCompleteOptionProps) {
  const description = [employee.orgUnitName, employee.position]
    .filter(Boolean)
    .join(' · ')

  return (
    <EmployeeOptionRow>
      <span className="employee-option__avatar" aria-hidden="true">
        <UserOutlined />
      </span>
      <div className="employee-option__body">
        <div className="employee-option__heading">
          <span className="employee-option__name">{employee.name}</span>
          <span className="employee-option__number">{employee.employeeNo}</span>
        </div>
        <span className="employee-option__description" title={description}>
          {description}
        </span>
      </div>
    </EmployeeOptionRow>
  )
}
