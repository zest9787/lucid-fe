export type CompanyOption = {
  companyCode: string
  companyText: string
}

export type CompanySearchMode = 'S' | 'F'

export type CompanyListResponse = {
  companyCode: string
  searchMode: CompanySearchMode
  companies: CompanyOption[]
}
