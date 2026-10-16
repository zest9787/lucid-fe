import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Tooltip, Typography } from 'antd'
import { useMemo } from 'react'
import type { MultiUserSearchModalProps } from '../model/types'
import { useEmployeePicker } from '../model/useEmployeePicker'
import { EmployeePickerModal } from './EmployeePickerModal'
import { EmployeeSearchResultGrid } from './EmployeeSearchResultGrid'
import { SelectedEmployeeGrid } from './SelectedEmployeeGrid'

export function MultiUserSearchModal({
  open,
  title,
  onCancel,
  onSelect,
}: MultiUserSearchModalProps) {
  const model = useEmployeePicker(open)
  const selectedEmployeeIds = useMemo(
    () => model.selectedEmployees.map(({ id }) => id),
    [model.selectedEmployees],
  )

  return (
    <EmployeePickerModal
      open={open}
      title={title}
      onCancel={onCancel}
      model={model}
      canSelect={model.selectedEmployees.length > 0}
      onSelect={() => onSelect(model.selectedEmployees)}
      searchResult={
        <div className="user-search-modal__transfer">
          <EmployeeSearchResultGrid
            employees={model.employees}
            loading={model.loading.employees}
            selectedEmployeeIds={selectedEmployeeIds}
            selectionMode="multiple"
            onSelectionChange={model.selectResults}
          />
          <Tooltip title="Add selected employees">
            <Button
              className="user-search-modal__transfer-button"
              disabled={model.activeEmployees.length === 0}
              icon={<ArrowRightOutlined />}
              shape="circle"
              type="primary"
              onClick={model.addSelectedEmployees}
            />
          </Tooltip>
        </div>
      }
      selectionPanel={
        <section className="user-search-modal__selected-panel">
          <Typography.Title level={5}>Selected Users</Typography.Title>
          <SelectedEmployeeGrid employees={model.selectedEmployees} />
        </section>
      }
      description={
        model.selectedEmployees.length > 0
          ? `${model.selectedEmployees.length} employee(s) selected.`
          : 'Select employees from the search result and add them.'
      }
    />
  )
}
