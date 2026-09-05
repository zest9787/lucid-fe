import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Empty } from 'antd'
import { useMemo } from 'react'
import type { EmployeeSearchItem } from '@entities/employee'
import '@shared/lib/ag-grid/registerCommunityModules'

type SelectedEmployeeGridProps = {
  employees: EmployeeSearchItem[]
}

const columns: ColDef<EmployeeSearchItem>[] = [
  { field: 'employeeNo', headerName: 'Employee No', minWidth: 120, flex: 0.8 },
  { field: 'name', headerName: 'Name', minWidth: 120, flex: 0.8 },
  { field: 'orgUnitName', headerName: 'Department', minWidth: 160, flex: 1 },
  { field: 'position', headerName: 'Position', minWidth: 140, flex: 0.9 },
]

export function SelectedEmployeeGrid({ employees }: SelectedEmployeeGridProps) {
  const defaultColDef = useMemo<ColDef<EmployeeSearchItem>>(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  )

  return (
    <div className="user-search-modal__grid ag-theme-quartz">
      <AgGridReact<EmployeeSearchItem>
        columnDefs={columns}
        defaultColDef={defaultColDef}
        getRowId={(params) => params.data.id}
        rowData={employees}
        rowHeight={42}
        suppressCellFocus
        theme="legacy"
      />
      {employees.length === 0 ? (
        <div className="user-search-modal__empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : null}
    </div>
  )
}
