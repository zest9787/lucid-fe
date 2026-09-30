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
