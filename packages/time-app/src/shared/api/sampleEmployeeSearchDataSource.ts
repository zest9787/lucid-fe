import type { EmployeeSearchDataSource } from 'ui-common/config'
import { filterSampleEmployees } from './filterSampleEmployees'
import { sampleCompanyList, sampleOrgUnitsByCompany } from './sampleEmployeeSearchData'

export const sampleEmployeeSearchDataSource: EmployeeSearchDataSource = {
  getCompanies: async () => sampleCompanyList,
  getOrgUnits: async (companyCode) => sampleOrgUnitsByCompany[companyCode] ?? [],
  searchEmployees: async (params) => filterSampleEmployees(params),
}
