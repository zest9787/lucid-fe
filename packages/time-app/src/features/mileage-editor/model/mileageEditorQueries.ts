import { queryOptions } from '@tanstack/react-query'
import { mileageEditorApi } from '../api/mileageEditorApi'
import type { MileageEditorSearchValues } from './types'

export const mileageEditorQueries = {
  companies: () =>
    queryOptions({
      queryKey: ['mileage-editor', 'companies'] as const,
      queryFn: mileageEditorApi.getCompanies,
    }),
  rows: (params: MileageEditorSearchValues | null) =>
    queryOptions({
      queryKey: ['mileage-editor', 'rows', params] as const,
      queryFn: () => mileageEditorApi.getRows(params!),
    }),
}
