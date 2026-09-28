import { useEffect } from 'react'
import { Form } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { searchConditionDataSource } from '../../../shared/api/searchConditionDataSource'
import type { SearchSelectOption } from '../../../shared/api/searchConditionDataSource'
import type { ConditionGridSearchValues } from './types'

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
  }

  const handleSearch = (values: ConditionGridSearchValues) => {
    form.setFieldsValue(values)
  }

  return {
    companies,
    form,
    handleCompanyChange,
    handleRefresh,
    handleSearch,
    initialValues,
    isCompaniesFetching,
    isPositionsFetching,
    isRolesFetching,
    jobTitleOptions,
    positions,
    roles,
  }
}
