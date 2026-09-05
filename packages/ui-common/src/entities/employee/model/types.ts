export type EmployeeSearchMode = 'S' | 'O'

export type EmployeeSearchParams = {
  companyCode: string
  searchMode: EmployeeSearchMode
  searchCond?: string
  orgUnitId?: string
}

export type EmployeeSearchItem = {
  id: string
  employeeNo: string
  name: string
  email: string
  companyCode: string
  orgUnitId: string
  orgUnitName: string
  position: string
}

export type UserSearchItem = EmployeeSearchItem
