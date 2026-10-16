import type { ColDef, RowSelectionOptions } from 'ag-grid-community'
import { CommonGrid } from '@shared/ui/common-grid'
import { useMemo } from 'react'
import type { EmployeeSearchItem } from '@entities/employee'

type EmployeeSearchResultGridProps = {
  employees: EmployeeSearchItem[]
  loading?: boolean
  selectedEmployeeId?: string
  selectedEmployeeIds?: string[]
  selectionMode?: 'single' | 'multiple'
  onSelect?: (employee: EmployeeSearchItem) => void
  onSelectionChange?: (employees: EmployeeSearchItem[]) => void
}

const columns: ColDef<EmployeeSearchItem>[] = [
  { field: 'employeeNo', headerName: 'Employee No', minWidth: 120, flex: 0.8 },
  { field: 'name', headerName: 'Name', minWidth: 120, flex: 0.8 },
  { field: 'email', headerName: 'Email', minWidth: 220, flex: 1.4 },
  { field: 'orgUnitName', headerName: 'Department', minWidth: 160, flex: 1 },
  { field: 'position', headerName: 'Position', minWidth: 160, flex: 1 },
]

// 기존 행 클릭 선택 동작을 유지하면서 AG Grid의 객체형 선택 설정을 사용한다.
const rowSelectionOptions = {
  single: {
    mode: 'singleRow',
    checkboxes: false,
    enableClickSelection: true,
  },
  multiple: {
    mode: 'multiRow',
    checkboxes: false,
    headerCheckbox: false,
    enableClickSelection: true,
    enableSelectionWithoutKeys: true,
  },
} satisfies Record<'single' | 'multiple', RowSelectionOptions<EmployeeSearchItem>>

export function EmployeeSearchResultGrid({
  employees,
  loading = false,
  selectedEmployeeId,
  selectedEmployeeIds = [],
  selectionMode = 'single',
  onSelect,
  onSelectionChange,
}: EmployeeSearchResultGridProps) {
  const selectedEmployeeIdSet = useMemo(
    () => new Set(selectedEmployeeIds),
    [selectedEmployeeIds],
  )
  return (
    <div className="user-search-modal__grid ag-theme-quartz">
      <CommonGrid<EmployeeSearchItem>
        columnDefs={columns}
        getRowId={(params) => params.data.id}
        loading={loading}
        rowData={employees}
        rowSelection={rowSelectionOptions[selectionMode]}
        rowClassRules={{
          'user-search-modal__row--selected': (params) =>
            params.data
              ? params.data.id === selectedEmployeeId ||
                selectedEmployeeIdSet.has(params.data.id)
              : false,
        }}
        suppressCellFocus
        onRowClicked={(event) => {
          if (event.data && onSelect) {
            onSelect(event.data)
          }
        }}
        onSelectionChanged={(event) => {
          onSelectionChange?.(event.api.getSelectedRows())
        }}
      />
    </div>
  )
}
