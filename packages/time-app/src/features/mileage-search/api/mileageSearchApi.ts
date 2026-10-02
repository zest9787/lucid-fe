import { httpClient } from '../../../shared/api'
import type {
  MileageDetail,
  MileageSearchOption,
  MileageSearchParams,
  MileageSearchResult,
} from '../model/types'

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

const allOption: MileageSearchOption = { value: '', label: 'ALL' }

const withAllOption = (options: MileageSearchOption[]): MileageSearchOption[] => [
  allOption,
  ...options.filter((option) => option.value !== allOption.value),
]

const isMileageSearchResult = (value: unknown): value is MileageSearchResult => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const result = value as Partial<MileageSearchResult>

  return Array.isArray(result.items) && typeof result.total === 'number'
}

const isMileageDetail = (value: unknown): value is MileageDetail => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const detail = value as Partial<MileageDetail>

  return typeof detail.id === 'string' && typeof detail.name === 'string'
}

export const mileageSearchApi = {
  getCompanies: async () => {
    const { data } = await httpClient.get<{ companies: CompanyOptionResponse[] }>(
      '/companies',
    )

    return data.companies.map((company) => ({
      value: company.companyCode,
      label: company.companyText,
    }))
  },
  getPositions: async (companyCode: string) => {
    const { data } = await httpClient.get<PositionOptionResponse[]>('/positions', {
      params: { companyCode },
    })

    return withAllOption(
      data.map((position) => ({
        value: position.positionCode,
        label: position.positionText,
      })),
    )
  },
  getRoles: async (companyCode: string) => {
    const { data } = await httpClient.get<RoleOptionResponse[]>('/roles', {
      params: { companyCode },
    })

    return withAllOption(
      data.map((role) => ({
        value: role.roleCode,
        label: role.roleText,
      })),
    )
  },
  search: async (params: MileageSearchParams) => {
    const { data } = await httpClient.get<unknown>('/employees', { params })

    if (!isMileageSearchResult(data)) {
      throw new Error('검색 API 응답 형식이 올바르지 않습니다.')
    }

    return data
  },
  getDetail: async (rowId: string) => {
    const { data } = await httpClient.get<unknown>(
      `/employees/${encodeURIComponent(rowId)}`,
    )

    if (!isMileageDetail(data)) {
      throw new Error('상세 API 응답 형식이 올바르지 않습니다.')
    }

    return data
  },
}
