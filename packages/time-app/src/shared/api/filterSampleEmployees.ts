import type { EmployeeSearchItem, EmployeeSearchParams } from 'ui-common'
import { sampleEmployees } from './sampleEmployeeSearchData'

export function filterSampleEmployees(
  params: EmployeeSearchParams,
): EmployeeSearchItem[] {
  return sampleEmployees.filter((employee) => {
    const matchesCompany = employee.companyCode === params.companyCode
    const matchesOrgUnit =
      params.searchMode !== 'O' || employee.orgUnitId === params.orgUnitId
    const matchesKeyword =
      params.searchMode !== 'S' ||
      [employee.name, employee.email, employee.employeeNo, employee.position]
        .join(' ')
        .toLowerCase()
        .includes((params.searchCond ?? '').toLowerCase())

    return matchesCompany && matchesOrgUnit && matchesKeyword
  })
}
