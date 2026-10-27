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
  const canSave = selectedIds.length > 0 || deletedIds.length > 0

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
    onSuccess: async ({ results }) => {
      const resultById = new Map(results.map((result) => [result.id, result]))
      const successIdSet = new Set(
        results
          .filter((result) => result.resultCode === 'SUCCESS')
          .map((result) => result.id),
      )
      const successCount = successIdSet.size
      const failureCount = results.length - successCount

      setRows((currentRows) =>
        currentRows.map((row) => {
          const result = resultById.get(row.id)

          return result
            ? {
                ...row,
                resultCode: result.resultCode,
                resultMessage: result.message,
              }
            : row
        }),
      )
      setChangedIds((currentIds) => currentIds.filter((id) => !successIdSet.has(id)))
      setDeletedIds([])
      if (failureCount > 0) {
        message.warning(`성공 ${successCount}건, 실패 ${failureCount}건입니다.`)
      } else {
        message.success(`${successCount}건을 저장했습니다.`)
      }
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
    const nextRow = {
      ...changedRow,
      resultCode: undefined,
      resultMessage: undefined,
    }
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === changedRow.id ? nextRow : row)),
    )
    setChangedIds((currentIds) =>
      currentIds.includes(changedRow.id) ? currentIds : [...currentIds, changedRow.id],
    )
  }

  const save = () => {
    if (!canSave) {
      message.warning('저장할 행을 선택하세요.')
      return
    }

    const selectedIdSet = new Set(selectedIds)
    const selectedRows = rows.filter((row) => selectedIdSet.has(row.id))
    const hasInvalidRow = selectedRows.some(
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

    saveMutation.mutate({
      deletedIds,
      rows: selectedRows,
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
      canSave,
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
