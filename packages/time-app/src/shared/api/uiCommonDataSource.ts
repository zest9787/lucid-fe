import type {
  CompanyListResponse,
  EmployeeSearchItem,
  EmployeeSearchParams,
  OrgUnit,
} from 'ui-common'
import type { UiCommonConfig } from 'ui-common/config'
import { filterSampleEmployees } from './filterSampleEmployees'
import { httpClient } from './httpClient'
import { sampleCompanyList, sampleOrgUnitsByCompany } from './sampleEmployeeSearchData'

export const uiCommonDataSource: UiCommonConfig = {
  employeeSearch: {
    getCompanies: async () => {
      try {
        const { data } = await httpClient.get<CompanyListResponse>('/companies')

        return data
      } catch {
        return sampleCompanyList
      }
    },
    getOrgUnits: async (companyCode: string) => {
      try {
        const { data } = await httpClient.get<OrgUnit[]>('/org-units', {
          params: { companyCode },
        })

        return data
      } catch {
        return sampleOrgUnitsByCompany[companyCode] ?? []
      }
    },
    searchEmployees: async (params: EmployeeSearchParams) => {
      try {
        const { data } = await httpClient.get<EmployeeSearchItem[]>('/employees', {
          params,
        })

        return data
      } catch {
        return filterSampleEmployees(params)
      }
    },
  },
}
