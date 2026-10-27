import type { CompanyListResponse } from 'ui-common'
import { httpClient } from '../../../shared/api'
import type {
  MileageEditorRow,
  MileageEditorSearchValues,
  SaveMileageRowsRequest,
  SaveMileageRowsResponse,
} from '../model/types'

export const mileageEditorApi = {
  getCompanies: async () => {
    const { data } = await httpClient.get<CompanyListResponse>('/companies')

    return data.companies.map((company) => ({
      label: company.companyText,
      value: company.companyCode,
    }))
  },
  getRows: async (params: MileageEditorSearchValues) => {
    const { data } = await httpClient.get<{ items: MileageEditorRow[] }>(
      '/mileage-records',
      {
        params: {
          companyCode: params.companyCode,
          employeeNo: params.employeeNo,
        },
      },
    )

    return data.items
  },
  saveRows: async (request: SaveMileageRowsRequest) => {
    const { data } = await httpClient.post<SaveMileageRowsResponse>(
      '/mileage-records/batch',
      request,
    )

    return data
  },
}
