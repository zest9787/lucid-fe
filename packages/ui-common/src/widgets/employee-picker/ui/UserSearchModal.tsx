import type { UserSearchModalProps } from '../model/types'
import { useEmployeePicker } from '../model/useEmployeePicker'
import { EmployeePickerModal } from './EmployeePickerModal'
import { EmployeeSearchResultGrid } from './EmployeeSearchResultGrid'

export function UserSearchModal({
  open,
  title,
  onCancel,
  onSelect,
}: UserSearchModalProps) {
  const model = useEmployeePicker(open)
  const selectedEmployee = model.activeEmployees[0]

  return (
    <EmployeePickerModal
      open={open}
      title={title}
      onCancel={onCancel}
      model={model}
      canSelect={Boolean(selectedEmployee)}
      onSelect={() => {
        if (selectedEmployee) onSelect(selectedEmployee)
      }}
      searchResult={
        <EmployeeSearchResultGrid
          employees={model.employees}
          loading={model.loading.employees}
          selectedEmployeeId={selectedEmployee?.id}
          onSelect={(employee) => model.selectResults([employee])}
        />
      }
      description={
        selectedEmployee
          ? `${selectedEmployee.name} / ${selectedEmployee.orgUnitName}`
          : 'Select an employee from the grid.'
      }
    />
  )
}
