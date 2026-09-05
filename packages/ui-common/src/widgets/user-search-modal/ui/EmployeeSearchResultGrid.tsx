import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Empty } from 'antd'
import { useMemo } from 'react'
import type { EmployeeSearchItem } from '@entities/employee'
import '@shared/lib/ag-grid/registerCommunityModules'

type EmployeeSearchResultGridProps = {
  employees: EmployeeSearchItem[]
  loading?: boolean
  selectedEmployeeId?: string
  onSelect: (employee: EmployeeSearchItem) => void
}

const columns: ColDef<EmployeeSearchItem>[] = [
  { field: 'employeeNo', headerName: 'Employee No', minWidth: 120, flex: 0.8 },
  { field: 'name', headerName: 'Name', minWidth: 120, flex: 0.8 },
  { field: 'email', headerName: 'Email', minWidth: 220, flex: 1.4 },
  { field: 'orgUnitName', headerName: 'Department', minWidth: 160, flex: 1 },
  { field: 'position', headerName: 'Position', minWidth: 160, flex: 1 },
]

export function EmployeeSearchResultGrid({
  employees,
  loading = false,
  selectedEmployeeId,
  onSelect,
}: EmployeeSearchResultGridProps) {
  const defaultColDef = useMemo<ColDef<EmployeeSearchItem>>(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  )

  // Keep selection handling here so the modal can later swap in a multi-select grid.
  return (
    <div className="user-search-modal__grid ag-theme-quartz">
      <AgGridReact<EmployeeSearchItem>
        columnDefs={columns}
        defaultColDef={defaultColDef}
        getRowId={(params) => params.data.id}
        loading={loading}
        rowData={employees}
        rowHeight={42}
        rowSelection="single"
        rowClassRules={{
          'user-search-modal__row--selected': (params) =>
            params.data?.id === selectedEmployeeId,
        }}
        suppressCellFocus
        theme="legacy"
        onRowClicked={(event) => {
          if (event.data) {
            onSelect(event.data)
          }
        }}
      />
      {!loading && employees.length === 0 ? (
        <div className="user-search-modal__empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : null}
    </div>
  )
}
