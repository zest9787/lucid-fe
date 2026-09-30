import { httpClient } from './httpClient'
import type {
  ConditionGridSearchParams,
  ConditionGridSearchResult,
} from '../../pages/condition-grid/model/types'

export type SearchSelectOption = {
  value: string
  label: string
}

type CompanyOptionResponse = {
  companyCode: string
  companyText: string
}

type PositionOptionResponse = {
  positionCode: string
  positionText: string
}

type RoleOptionResponse = {
  roleCode: string
  roleText: string
}

const allOption: SearchSelectOption = { value: '', label: 'ALL' }

const withAllOption = (options: SearchSelectOption[]): SearchSelectOption[] => [
  allOption,
  ...options.filter((option) => option.value !== allOption.value),
]

const isConditionGridSearchResult = (
  value: unknown,
): value is ConditionGridSearchResult => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const result = value as Partial<ConditionGridSearchResult>

  return Array.isArray(result.items) && typeof result.total === 'number'
}

const toCompanyOptions = (companies: CompanyOptionResponse[]): SearchSelectOption[] =>
  companies.map((company) => ({
    value: company.companyCode,
    label: company.companyText,
  }))

const toPositionOptions = (positions: PositionOptionResponse[]): SearchSelectOption[] =>
  positions.map((position) => ({
    value: position.positionCode,
    label: position.positionText,
  }))

const toRoleOptions = (roles: RoleOptionResponse[]): SearchSelectOption[] =>
  roles.map((role) => ({
    value: role.roleCode,
    label: role.roleText,
  }))

export const searchConditionDataSource = {
  getCompanies: async () => {
    const { data } = await httpClient.get<{ companies: CompanyOptionResponse[] }>(
      '/companies',
    )

    return toCompanyOptions(data.companies)
  },
  getPositions: async (companyCode: string) => {
    const { data } = await httpClient.get<PositionOptionResponse[]>('/positions', {
      params: { companyCode },
    })

    return withAllOption(toPositionOptions(data))
  },
  getRoles: async (companyCode: string) => {
    const { data } = await httpClient.get<RoleOptionResponse[]>('/roles', {
      params: { companyCode },
    })

    return withAllOption(toRoleOptions(data))
  },
  search: async (params: ConditionGridSearchParams) => {
    const { data } = await httpClient.get<unknown>('/employees', {
      params,
    })

    if (!isConditionGridSearchResult(data)) {
      throw new Error('검색 API 응답 형식이 올바르지 않습니다.')
    }

    return data
  },
}
