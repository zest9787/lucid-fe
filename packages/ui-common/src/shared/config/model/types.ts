import type { CompanyListResponse } from '@entities/company'
import type { EmployeeSearchItem, EmployeeSearchParams } from '@entities/employee'
import type { OrgUnit } from '@entities/org-unit'

export type EmployeeSearchDataSource = {
  getCompanies: () => Promise<CompanyListResponse>
  getOrgUnits: (companyCode: string) => Promise<OrgUnit[]>
  searchEmployees: (params: EmployeeSearchParams) => Promise<EmployeeSearchItem[]>
}

export type UiCommonConfig = {
  employeeSearch: EmployeeSearchDataSource
}
