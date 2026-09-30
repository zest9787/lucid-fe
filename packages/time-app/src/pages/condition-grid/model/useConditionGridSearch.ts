import { useEffect, useState } from 'react'
import { Form } from 'antd'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { searchConditionDataSource } from '../../../shared/api/searchConditionDataSource'
import type { SearchSelectOption } from '../../../shared/api/searchConditionDataSource'
import type { ConditionGridSearchParams, ConditionGridSearchValues } from './types'

const initialPagination = {
  current: 1,
  pageSize: 5,
}

const initialValues: ConditionGridSearchValues = {
  position: '',
  jobTitle: '',
  role: '',
}

const jobTitleOptions: SearchSelectOption[] = [
  { label: 'ALL', value: '' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
]

export function useConditionGridSearch() {
  const [form] = Form.useForm<ConditionGridSearchValues>()
  const [submittedValues, setSubmittedValues] =
    useState<ConditionGridSearchValues | null>(null)
  const [pagination, setPagination] = useState(initialPagination)
  const [searchSequence, setSearchSequence] = useState(0)
  const companyCode = Form.useWatch('companyCode', form)

  const { data: companies = [], isFetching: isCompaniesFetching } = useQuery({
    queryKey: ['condition-grid', 'companies'],
    queryFn: searchConditionDataSource.getCompanies,
  })

  const { data: positions = [], isFetching: isPositionsFetching } = useQuery({
    enabled: Boolean(companyCode),
    queryKey: ['condition-grid', 'positions', companyCode],
    queryFn: () => searchConditionDataSource.getPositions(companyCode!),
  })

  const { data: roles = [], isFetching: isRolesFetching } = useQuery({
    enabled: Boolean(companyCode),
    queryKey: ['condition-grid', 'roles', companyCode],
    queryFn: () => searchConditionDataSource.getRoles(companyCode!),
  })

  const searchParams: ConditionGridSearchParams | null = submittedValues
    ? {
        ...submittedValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    : null

  const {
    data: searchResult = { items: [], total: 0 },
    isFetching: isSearchFetching,
  } = useQuery({
    enabled: Boolean(searchParams),
    placeholderData: keepPreviousData,
    queryKey: ['condition-grid', 'search', searchParams, searchSequence],
    queryFn: () => searchConditionDataSource.search(searchParams!),
  })

  useEffect(() => {
    const firstCompanyCode = companies[0]?.value

    if (firstCompanyCode && !form.getFieldValue('companyCode')) {
      form.setFieldValue('companyCode', firstCompanyCode)
    }
  }, [companies, form])

  const handleCompanyChange = () => {
    form.setFieldsValue({ position: '', role: '' })
  }

  const handleRefresh = () => {
    form.setFieldsValue({
      ...initialValues,
      companyCode: companies[0]?.value,
    })
    setSubmittedValues(null)
    setPagination(initialPagination)
  }

  const handleSearch = (values: ConditionGridSearchValues) => {
    setSubmittedValues(values)
    setPagination((current) => ({ ...current, current: 1 }))
    setSearchSequence((current) => current + 1)
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((current) => ({
      current: current.pageSize === pageSize ? page : 1,
      pageSize,
    }))
  }

  return {
    companies,
    form,
    handleCompanyChange,
    handlePageChange,
    handleRefresh,
    handleSearch,
    initialValues,
    isCompaniesFetching,
    isPositionsFetching,
    isRolesFetching,
    isSearchFetching,
    jobTitleOptions,
    positions,
    rowData: searchResult.items,
    roles,
    pagination: {
      ...pagination,
      total: searchResult.total,
    },
  }
}
