import type { PaginationState } from '@shared/lib/pagination'

export type ConditionGridSearchValues = {
  companyCode?: string
  position?: string
  jobTitle?: string
  role?: string
}

export type ConditionGridRow = {
  id: string
  companyCode: string
  position: string
  jobTitle: string
  role: string
}

export type ConditionGridSearchParams = ConditionGridSearchValues & {
  page: number
  pageSize: number
}

export type ConditionGridSearchResult = {
  items: ConditionGridRow[]
  total: number
}

export type ConditionGridDetail = ConditionGridRow & {
  employeeNo: string
  name: string
  email: string
  department: string
  phone: string
  hireDate: string
}

export type ConditionGridSearchStore = {
  submittedValues: ConditionGridSearchValues | null
  pagination: PaginationState
  searchSequence: number
  selectedRowId: string | null
  submitSearch: (values: ConditionGridSearchValues) => void
  changePage: (page: number, pageSize: number) => void
  resetSearch: () => void
  openDetail: (rowId: string) => void
  closeDetail: () => void
}
