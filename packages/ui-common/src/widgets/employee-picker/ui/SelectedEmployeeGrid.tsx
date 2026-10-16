import type { ColDef } from 'ag-grid-community'
import { CommonGrid } from '@shared/ui/common-grid'
import type { EmployeeSearchItem } from '@entities/employee'

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
  return (
    <div className="user-search-modal__grid ag-theme-quartz">
      <CommonGrid<EmployeeSearchItem>
        columnDefs={columns}
        getRowId={(params) => params.data.id}
        rowData={employees}
        suppressCellFocus
      />
    </div>
  )
}
