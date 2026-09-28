import { httpClient } from './httpClient'
import { sampleCompanyList } from './sampleEmployeeSearchData'

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

const samplePositionsByCompany: Record<string, SearchSelectOption[]> = {
  'COM-001': [
    { value: 'FE', label: 'Frontend Engineer' },
    { value: 'PO', label: 'Product Owner' },
  ],
  'COM-002': [
    { value: 'BE', label: 'Backend Engineer' },
    { value: 'AE', label: 'Account Executive' },
  ],
}

const sampleRolesByCompany: Record<string, SearchSelectOption[]> = {
  'COM-001': [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MEMBER', label: 'Member' },
  ],
  'COM-002': [
    { value: 'MANAGER', label: 'Manager' },
    { value: 'VIEWER', label: 'Viewer' },
  ],
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
    try {
      const { data } = await httpClient.get<{ companies: CompanyOptionResponse[] }>(
        '/companies',
      )

      return toCompanyOptions(data.companies)
    } catch {
      return toCompanyOptions(sampleCompanyList.companies)
    }
  },
  getPositions: async (companyCode: string) => {
    try {
      const { data } = await httpClient.get<PositionOptionResponse[]>('/positions', {
        params: { companyCode },
      })

      return withAllOption(toPositionOptions(data))
    } catch {
      return withAllOption(samplePositionsByCompany[companyCode] ?? [])
    }
  },
  getRoles: async (companyCode: string) => {
    try {
      const { data } = await httpClient.get<RoleOptionResponse[]>('/roles', {
        params: { companyCode },
      })

      return withAllOption(toRoleOptions(data))
    } catch {
      return withAllOption(sampleRolesByCompany[companyCode] ?? [])
    }
  },
}
