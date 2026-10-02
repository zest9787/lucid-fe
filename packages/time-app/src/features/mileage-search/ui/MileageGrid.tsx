import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Pagination } from 'antd'
import { useMemo } from 'react'
import '@shared/lib/ag-grid/registerCommunityModules'
import type { MileageSearchViewModel } from '../model/useMileageSearch'
import type { MileageRow } from '../model/types'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import './MileageGrid.scss'

type MileageGridProps = {
  model: MileageSearchViewModel['grid']
}

const summarizedColumns: ColDef<MileageRow>[] = [
  {
    field: 'companyCode',
    headerName: 'Company Code',
    minWidth: 160,
    flex: 1,
  },
  {
    field: 'position',
    headerName: 'Position',
    minWidth: 180,
    flex: 1,
  },
  { field: 'jobTitle', headerName: 'Job Title', minWidth: 140, flex: 1 },
  { field: 'role', headerName: 'Role', minWidth: 160, flex: 1 },
]

const isSameDetailGroup = (rowA: MileageRow | undefined, rowB: MileageRow | undefined) =>
  rowA?.department === rowB?.department &&
  rowA?.team === rowB?.team &&
  rowA?.user === rowB?.user

const detailColumns: ColDef<MileageRow>[] = [
  {
    field: 'department',
    headerName: 'Department',
    minWidth: 180,
    flex: 1,
    spanRows: ({ nodeA, nodeB }) => isSameDetailGroup(nodeA?.data, nodeB?.data),
  },
  {
    field: 'team',
    headerName: 'Team',
    minWidth: 180,
    flex: 1,
    spanRows: ({ nodeA, nodeB }) => isSameDetailGroup(nodeA?.data, nodeB?.data),
  },
  {
    field: 'user',
    headerName: 'User',
    minWidth: 160,
    flex: 1,
    spanRows: ({ nodeA, nodeB }) => isSameDetailGroup(nodeA?.data, nodeB?.data),
  },
  { field: 'year', headerName: 'Year', minWidth: 120, flex: 1 },
  {
    field: 'mileage',
    headerName: 'Mileage',
    minWidth: 150,
    flex: 1,
    valueFormatter: ({ value }) => Number(value ?? 0).toLocaleString(),
  },
]

export function MileageGrid({ model }: MileageGridProps) {
  const defaultColDef = useMemo<ColDef<MileageRow>>(
    () => ({
      filter: true,
      resizable: true,
      sortable: true,
    }),
    [],
  )

  return (
    <>
      <section className="mileage-grid ag-theme-quartz">
        <AgGridReact<MileageRow>
          columnDefs={model.viewType === 'D' ? detailColumns : summarizedColumns}
          defaultColDef={defaultColDef}
          enableCellSpan
          getRowId={(params) => params.data.id}
          loading={model.loading}
          onRowClicked={(event) => {
            if (event.data) {
              model.onRowClick(event.data.employeeId ?? event.data.id)
            }
          }}
          rowData={model.rows}
          rowHeight={42}
          suppressCellFocus
          theme="legacy"
        />
      </section>
      <div className="mileage-grid-pagination">
        <Pagination
          current={model.pagination.current}
          onChange={model.onPageChange}
          pageSize={model.pagination.pageSize}
          pageSizeOptions={[5, 10, 20]}
          showSizeChanger
          showTotal={(total) => `총 ${total}건`}
          total={model.pagination.total}
        />
      </div>
    </>
  )
}
