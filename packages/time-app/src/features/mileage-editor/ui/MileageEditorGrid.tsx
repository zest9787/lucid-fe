import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Calendar, Input, Select, Space, Tag, Typography } from 'antd'
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community'
import type { CustomCellEditorProps } from 'ag-grid-react'
import { CommonGrid, ConfirmModal } from 'ui-common'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { MileageEditorViewModel } from '../model/useMileageEditor'
import type { MileageEditorRow } from '../model/types'
import './MileageEditorGrid.scss'

type MileageEditorGridProps = {
  editorType?: 'ag-grid' | 'antd'
  model: MileageEditorViewModel['grid']
}

function AntdInputCellEditor({
  onValueChange,
  stopEditing,
  value,
}: CustomCellEditorProps<MileageEditorRow, string | number>) {
  return (
    <Input
      autoFocus
      className="mileage-editor-grid__antd-input"
      value={value ?? ''}
      onChange={(event) => onValueChange(event.target.value)}
      onPressEnter={() => stopEditing()}
    />
  )
}

function AntdSelectCellEditor({
  onValueChange,
  stopEditing,
  value,
}: CustomCellEditorProps<MileageEditorRow, string>) {
  return (
    <Select
      autoFocus
      className="mileage-editor-grid__antd-select"
      defaultOpen
      options={['Pending', 'Approved', 'Rejected'].map((status) => ({
        label: status,
        value: status,
      }))}
      value={value}
      onChange={(nextValue) => {
        onValueChange(nextValue)
        stopEditing()
      }}
    />
  )
}

function AntdCalendarCellEditor({
  onValueChange,
  stopEditing,
  value,
}: CustomCellEditorProps<MileageEditorRow, string>) {
  return (
    <div className="mileage-editor-grid__calendar-editor">
      <Calendar
        fullscreen={false}
        value={value ? dayjs(value) : undefined}
        onSelect={(date) => {
          onValueChange(date.format('YYYY-MM-DD'))
          stopEditing()
        }}
      />
    </div>
  )
}

const createColumns = (editorType: 'ag-grid' | 'antd'): ColDef<MileageEditorRow>[] => [
  { field: 'companyCode', headerName: 'Company Code', minWidth: 140 },
  { field: 'employeeNo', headerName: 'Employee No', minWidth: 140 },
  { field: 'name', headerName: 'Name', minWidth: 150 },
  { field: 'department', headerName: 'Department', minWidth: 160 },
  { field: 'team', headerName: 'Team', minWidth: 170 },
  {
    cellEditor: editorType === 'antd' ? AntdSelectCellEditor : 'agSelectCellEditor',
    cellEditorParams:
      editorType === 'antd' ? undefined : { values: ['Pending', 'Approved', 'Rejected'] },
    field: 'status',
    headerName: 'Approval Status (Select)',
    minWidth: 150,
  },
  {
    cellEditor: editorType === 'antd' ? AntdCalendarCellEditor : 'agDateStringCellEditor',
    cellEditorPopup: editorType === 'antd',
    field: 'effectiveDate',
    headerName: 'Effective Date (Calendar)',
    minWidth: 190,
  },
  {
    field: 'year',
    headerName: 'Year',
    minWidth: 110,
    valueParser: ({ newValue }) => Number(newValue),
  },
  {
    field: 'mileage',
    headerName: 'Mileage',
    minWidth: 140,
    valueFormatter: ({ value }) => Number(value ?? 0).toLocaleString(),
    valueParser: ({ newValue }) => Number(newValue),
  },
  {
    editable: false,
    field: 'resultCode',
    headerName: 'Status',
    minWidth: 260,
    cellRenderer: ({ data }: { data?: MileageEditorRow }) => {
      if (!data?.resultCode) {
        return null
      }

      return (
        <Space size={6}>
          <Tag color={data.resultCode === 'SUCCESS' ? 'success' : 'error'}>
            {data.resultCode === 'SUCCESS' ? '성공' : '실패'}
          </Tag>
          {data.resultCode === 'FAIL' ? (
            <Typography.Text type="danger">{data.resultMessage}</Typography.Text>
          ) : null}
        </Space>
      )
    },
  },
]

export function MileageEditorGrid({
  editorType = 'ag-grid',
  model,
}: MileageEditorGridProps) {
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
  const columns = useMemo(() => {
    const nextColumns = createColumns(editorType)

    if (editorType === 'antd') {
      nextColumns.forEach((column) => {
        if (!column.cellEditor) {
          column.cellEditor = AntdInputCellEditor
        }
      })
    }

    return nextColumns
  }, [editorType])
  const defaultColDef = useMemo<ColDef<MileageEditorRow>>(
    () => ({
      editable: true,
      flex: 1,
    }),
    [],
  )

  return (
    <section
      className={`mileage-editor-grid ${
        editorType === 'antd' ? 'mileage-editor-grid--antd' : ''
      }`}
    >
      <header className="mileage-editor-grid__toolbar">
        <Space>
          <Button icon={<PlusOutlined />} onClick={model.onAdd}>
            추가
          </Button>
          <Button
            danger
            disabled={model.selectedIds.length === 0}
            icon={<DeleteOutlined />}
            onClick={model.onDelete}
          >
            삭제
          </Button>
          <Button
            disabled={!model.canSave}
            icon={<SaveOutlined />}
            loading={model.saving}
            type="primary"
            onClick={() => setIsSaveConfirmOpen(true)}
          >
            저장
          </Button>
        </Space>
        <Space>
          {model.dirty ? <Tag color="orange">저장되지 않은 변경사항</Tag> : null}
          <Typography.Text type="secondary">
            총 {model.rows.length.toLocaleString()}건
          </Typography.Text>
        </Space>
      </header>
      <div className="mileage-editor-grid__table ag-theme-quartz">
        <CommonGrid<MileageEditorRow>
          columnDefs={columns}
          defaultColDef={defaultColDef}
          getRowId={(params) => params.data.id}
          loading={model.loading}
          rowData={model.rows}
          rowSelection={{
            mode: 'multiRow',
            checkboxes: true,
            enableSelectionWithoutKeys: true,
            headerCheckbox: true,
          }}
          selectionColumnDef={{ maxWidth: 52, pinned: 'left' }}
          stopEditingWhenCellsLoseFocus
          suppressColumnVirtualisation
          onCellValueChanged={(event: CellValueChangedEvent<MileageEditorRow>) => {
            if (event.data) {
              model.onRowChange(event.data)
            }
          }}
          onSelectionChanged={(event) => {
            model.onSelectionChange(event.api.getSelectedRows().map((row) => row.id))
          }}
        />
      </div>
      <ConfirmModal
        confirmLoading={model.saving}
        open={isSaveConfirmOpen}
        title="저장 확인"
        onCancel={() => setIsSaveConfirmOpen(false)}
        onConfirm={() => {
          setIsSaveConfirmOpen(false)
          model.onSave()
        }}
      >
        <Typography.Text>
          {model.selectedIds.length > 0
            ? `선택한 ${model.selectedIds.length.toLocaleString()}개 행의 변경사항을 저장하시겠습니까?`
            : '삭제한 데이터의 변경사항을 저장하시겠습니까?'}
        </Typography.Text>
      </ConfirmModal>
    </section>
  )
}
