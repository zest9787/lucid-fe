import { useEffect } from 'react'
import { Form } from 'antd'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'
import { searchConditionDataSource } from '../../../shared/api/searchConditionDataSource'
import type { SearchSelectOption } from '../../../shared/api/searchConditionDataSource'
import type { ConditionGridSearchParams, ConditionGridSearchValues } from './types'
import { useConditionGridSearchStore } from './conditionGridSearchStore'

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
  const {
    changePage,
    pagination,
    resetSearch,
    searchSequence,
    submittedValues,
    submitSearch,
  } = useConditionGridSearchStore(
    useShallow((state) => ({
      changePage: state.changePage,
      pagination: state.pagination,
      resetSearch: state.resetSearch,
      searchSequence: state.searchSequence,
      submittedValues: state.submittedValues,
      submitSearch: state.submitSearch,
    })),
  )
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
    resetSearch()
  }

  const handleSearch = (values: ConditionGridSearchValues) => {
    submitSearch(values)
  }

  const handlePageChange = (page: number, pageSize: number) => {
    changePage(page, pageSize)
  }

  return {
    companies,
    form,
    handleCompanyChange,
    handlePageChange,
    handleRefresh,
    handleSearch,
    initialValues: submittedValues ?? initialValues,
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
