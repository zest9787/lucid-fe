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

export type ConditionGridPagination = {
  current: number
  pageSize: number
}

export type ConditionGridSearchStore = {
  submittedValues: ConditionGridSearchValues | null
  pagination: ConditionGridPagination
  searchSequence: number
  submitSearch: (values: ConditionGridSearchValues) => void
  changePage: (page: number, pageSize: number) => void
  resetSearch: () => void
}
