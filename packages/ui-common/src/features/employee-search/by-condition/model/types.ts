import type { CompanySearchMode } from '@entities/company'

export type EmployeeConditionSearchValues = {
  companyCode: string
  searchCond?: string
}

export type EmployeeConditionSearchSubmit = EmployeeConditionSearchValues & {
  companySearchMode: CompanySearchMode
}
