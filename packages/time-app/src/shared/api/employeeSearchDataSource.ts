import type {
  CompanyListResponse,
  EmployeeSearchItem,
  EmployeeSearchParams,
  OrgUnit,
} from 'ui-common'
import type { EmployeeSearchDataSource } from 'ui-common/config'
import { httpClient } from './httpClient'

export const employeeSearchDataSource: EmployeeSearchDataSource = {
  getCompanies: async () => {
    const { data } = await httpClient.get<CompanyListResponse>('/companies')

    return data
  },
  getOrgUnits: async (companyCode) => {
    const { data } = await httpClient.get<OrgUnit[]>('/org-units', {
      params: { companyCode },
    })

    return data
  },
  searchEmployees: async (params: EmployeeSearchParams) => {
    const { data } = await httpClient.get<EmployeeSearchItem[]>('/employees', {
      params,
    })

    return data
  },
}
