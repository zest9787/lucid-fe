import { useEffect } from 'react'
import { Form } from 'antd'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'
import { mileageQueries } from './mileageQueries'
import { useMileageSearchStore } from './mileageSearchStore'
import type {
  MileageSearchOption,
  MileageSearchParams,
  MileageSearchValues,
} from './types'

const initialValues: MileageSearchValues = {
  position: '',
  jobTitle: '',
  role: '',
  type: 'S',
}

const jobTitleOptions: MileageSearchOption[] = [
  { label: 'ALL', value: '' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
]

const viewTypeOptions: MileageSearchOption[] = [
  { label: 'Summarized View', value: 'S' },
  { label: 'Detail View', value: 'D' },
]

export function useMileageSearch() {
  const [form] = Form.useForm<MileageSearchValues>()
  const queryClient = useQueryClient()
  const {
    changePage,
    closeDetail,
    openDetail,
    pagination,
    resetSearch,
    selectedRowId,
    submittedValues,
    submitSearch,
  } = useMileageSearchStore(
    useShallow((state) => ({
      changePage: state.changePage,
      closeDetail: state.closeDetail,
      openDetail: state.openDetail,
      pagination: state.pagination,
      resetSearch: state.resetSearch,
      selectedRowId: state.selectedRowId,
      submittedValues: state.submittedValues,
      submitSearch: state.submitSearch,
    })),
  )
  const companyCode = Form.useWatch('companyCode', form)

  const { data: companies = [], isFetching: isCompaniesFetching } = useQuery(
    mileageQueries.companies(),
  )

  const { data: positions = [], isFetching: isPositionsFetching } = useQuery({
    ...mileageQueries.positions(companyCode ?? ''),
    enabled: Boolean(companyCode),
  })

  const { data: roles = [], isFetching: isRolesFetching } = useQuery({
    ...mileageQueries.roles(companyCode ?? ''),
    enabled: Boolean(companyCode),
  })

  const searchParams: MileageSearchParams | null = submittedValues
    ? {
        ...submittedValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    : null

  const { data: searchResult = { items: [], total: 0 }, isFetching: isSearchFetching } =
    useQuery({
      ...mileageQueries.search(searchParams),
      enabled: Boolean(searchParams),
      placeholderData: keepPreviousData,
    })

  const {
    data: detail,
    isError: isDetailError,
    isFetching: isDetailFetching,
  } = useQuery({
    ...mileageQueries.detail(selectedRowId),
    enabled: Boolean(selectedRowId),
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

  const handleReset = () => {
    form.resetFields()
    form.setFieldsValue({
      ...initialValues,
      companyCode: companies[0]?.value,
    })
    resetSearch()
  }

  const handleSearch = async (values: MileageSearchValues) => {
    const params: MileageSearchParams = {
      ...values,
      page: 1,
      pageSize: pagination.pageSize,
    }

    submitSearch(values)

    try {
      await queryClient.fetchQuery(mileageQueries.search(params))
    } catch {
      // The active query exposes the API error state to the page.
    }
  }

  return {
    searchForm: {
      form,
      initialValues: submittedValues ?? initialValues,
      options: {
        companies,
        positions,
        roles,
        jobTitles: jobTitleOptions,
        viewTypes: viewTypeOptions,
      },
      loading: {
        companies: isCompaniesFetching,
        positions: isPositionsFetching,
        roles: isRolesFetching,
        search: isSearchFetching,
      },
      onCompanyChange: handleCompanyChange,
      onReset: handleReset,
      onSearch: handleSearch,
    },
    grid: {
      viewType: submittedValues?.type ?? initialValues.type,
      rows: searchResult.items,
      pagination: {
        ...pagination,
        total: searchResult.total,
      },
      loading: isSearchFetching,
      onPageChange: changePage,
      onRowClick: openDetail,
    },
    detailModal: {
      detail,
      error: isDetailError,
      loading: isDetailFetching,
      open: Boolean(selectedRowId),
      onClose: closeDetail,
    },
  }
}

export type MileageSearchViewModel = ReturnType<typeof useMileageSearch>
