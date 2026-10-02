import type { PaginationState } from '@shared/lib/pagination'

export type MileageViewType = 'S' | 'D'

export type MileageRow = {
  id: string
  companyCode: string
  position: string
  jobTitle: string
  role: string
  employeeNo?: string
  name?: string
  email?: string
  department?: string
  team?: string
  user?: string
  year?: number
  mileage?: number
  employeeId?: string
  phone?: string
  hireDate?: string
}

export type MileageDetail = MileageRow & {
  employeeNo: string
  name: string
  email: string
  department: string
  team: string
  phone: string
  hireDate: string
}

export type MileageSearchResult = {
  items: MileageRow[]
  total: number
}

export type MileageSearchOption = {
  value: string
  label: string
}

export type MileageSearchValues = {
  companyCode?: string
  position?: string
  jobTitle?: string
  role?: string
  type: MileageViewType
}

export type MileageSearchParams = MileageSearchValues & {
  page: number
  pageSize: number
}

export type MileageSearchStore = {
  submittedValues: MileageSearchValues | null
  pagination: PaginationState
  selectedRowId: string | null
  submitSearch: (values: MileageSearchValues) => void
  changePage: (page: number, pageSize: number) => void
  resetSearch: () => void
  openDetail: (rowId: string) => void
  closeDetail: () => void
}
