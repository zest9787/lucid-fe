import { queryOptions } from '@tanstack/react-query'
import { mileageSearchApi } from '../api/mileageSearchApi.ts'
import type { MileageSearchParams } from './types'

export const mileageQueries = {
  companies: () =>
    queryOptions({
      queryKey: ['mileage', 'companies'] as const,
      queryFn: mileageSearchApi.getCompanies,
    }),
  positions: (companyCode: string) =>
    queryOptions({
      queryKey: ['mileage', 'positions', companyCode] as const,
      queryFn: () => mileageSearchApi.getPositions(companyCode),
    }),
  roles: (companyCode: string) =>
    queryOptions({
      queryKey: ['mileage', 'roles', companyCode] as const,
      queryFn: () => mileageSearchApi.getRoles(companyCode),
    }),
  search: (params: MileageSearchParams | null) =>
    queryOptions({
      queryKey: ['mileage', 'search', params] as const,
      queryFn: () => mileageSearchApi.search(params!),
    }),
  detail: (rowId: string | null) =>
    queryOptions({
      queryKey: ['mileage', 'detail', rowId] as const,
      queryFn: () => mileageSearchApi.getDetail(rowId!),
    }),
}
