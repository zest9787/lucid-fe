import type { UiCommonConfig } from 'ui-common/config'
import { filterSampleEmployees } from './filterSampleEmployees'
import { sampleCompanyList, sampleOrgUnitsByCompany } from './sampleEmployeeSearchData'

export const sampleUiCommonDataSource: UiCommonConfig = {
  employeeSearch: {
    getCompanies: async () => sampleCompanyList,
    getOrgUnits: async (companyCode) => sampleOrgUnitsByCompany[companyCode] ?? [],
    searchEmployees: async (params) => filterSampleEmployees(params),
  },
}
