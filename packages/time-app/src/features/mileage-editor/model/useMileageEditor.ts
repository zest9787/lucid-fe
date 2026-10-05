import { useEffect, useState } from 'react'
import { App, Form } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mileageEditorApi } from '../api/mileageEditorApi'
import { mileageEditorQueries } from './mileageEditorQueries'
import type { MileageEditorRow, MileageEditorSearchValues } from './types'

const initialValues: MileageEditorSearchValues = {
  employeeName: '',
  employeeNo: '',
}

export function useMileageEditor() {
  const { message } = App.useApp()
  const [form] = Form.useForm<MileageEditorSearchValues>()
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<MileageEditorRow[]>([])
  const [changedIds, setChangedIds] = useState<string[]>([])
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isRowsFetching, setIsRowsFetching] = useState(false)
  const dirty = changedIds.length > 0 || deletedIds.length > 0

  const { data: companies = [], isFetching: isCompaniesFetching } = useQuery(
    mileageEditorQueries.companies(),
  )
  useEffect(() => {
    const firstCompanyCode = companies[0]?.value

    if (firstCompanyCode && !form.getFieldValue('companyCode')) {
      form.setFieldValue('companyCode', firstCompanyCode)
    }
  }, [companies, form])

  const saveMutation = useMutation({
    mutationFn: mileageEditorApi.saveRows,
    onSuccess: async ({ savedCount }) => {
      message.success(`${savedCount}건을 저장했습니다.`)
      setChangedIds([])
      setDeletedIds([])
      await queryClient.invalidateQueries({ queryKey: ['mileage-editor', 'rows'] })
    },
    onError: () => {
      message.error('저장 중 오류가 발생했습니다.')
    },
  })

  const reset = () => {
    form.resetFields()
    form.setFieldsValue({
      ...initialValues,
      companyCode: companies[0]?.value,
    })
    setRows([])
    setChangedIds([])
    setDeletedIds([])
    setSelectedIds([])
  }

  const search = async (values: MileageEditorSearchValues) => {
    setIsRowsFetching(true)

    try {
      const nextRows = await queryClient.fetchQuery(mileageEditorQueries.rows(values))
      setRows(nextRows)
      setChangedIds([])
      setDeletedIds([])
      setSelectedIds([])
    } catch {
      message.error('조회 중 오류가 발생했습니다.')
    } finally {
      setIsRowsFetching(false)
    }
  }

  const addRow = () => {
    const companyCode = form.getFieldValue('companyCode') ?? ''
    const id = `NEW-${crypto.randomUUID()}`

    setRows((currentRows) => [
      {
        id,
        companyCode,
        department: '',
        effectiveDate: new Date().toISOString().slice(0, 10),
        employeeNo: '',
        mileage: 0,
        name: '',
        team: '',
        status: 'Pending',
        year: new Date().getFullYear(),
      },
      ...currentRows,
    ])
    setChangedIds((currentIds) => [...currentIds, id])
  }

  const deleteRows = () => {
    if (selectedIds.length === 0) {
      message.warning('삭제할 행을 선택하세요.')
      return
    }

    const selectedIdSet = new Set(selectedIds)
    setDeletedIds((currentIds) => [
      ...currentIds,
      ...selectedIds.filter((id) => !id.startsWith('NEW-')),
    ])
    setRows((currentRows) => currentRows.filter((row) => !selectedIdSet.has(row.id)))
    setChangedIds((currentIds) => currentIds.filter((id) => !selectedIdSet.has(id)))
    setSelectedIds([])
  }

  const changeRow = (changedRow: MileageEditorRow) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === changedRow.id ? { ...changedRow } : row)),
    )
    setChangedIds((currentIds) =>
      currentIds.includes(changedRow.id) ? currentIds : [...currentIds, changedRow.id],
    )
  }

  const save = () => {
    const hasInvalidRow = rows.some(
      (row) =>
        !row.companyCode ||
        !row.employeeNo.trim() ||
        !row.name.trim() ||
        !row.effectiveDate ||
        !row.status ||
        !Number.isFinite(Number(row.mileage)),
    )

    if (hasInvalidRow) {
      message.error('회사코드, 사원번호, 사원명, 상태, 적용일과 Mileage를 확인하세요.')
      return
    }

    const changedIdSet = new Set(changedIds)
    saveMutation.mutate({
      deletedIds,
      rows: rows.filter((row) => changedIdSet.has(row.id)),
    })
  }

  return {
    form: {
      form,
      initialValues,
      companies,
      loading: isCompaniesFetching || isRowsFetching,
      onCompanyChange: () => form.setFieldsValue({ employeeName: '', employeeNo: '' }),
      onReset: reset,
      onSearch: search,
    },
    grid: {
      dirty,
      loading: isRowsFetching,
      rows,
      saving: saveMutation.isPending,
      selectedIds,
      onAdd: addRow,
      onDelete: deleteRows,
      onRowChange: changeRow,
      onSave: save,
      onSelectionChange: setSelectedIds,
    },
  }
}

export type MileageEditorViewModel = ReturnType<typeof useMileageEditor>
