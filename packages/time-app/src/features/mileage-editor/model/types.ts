export type MileageEditorSearchValues = {
  companyCode?: string
  employeeName?: string
  employeeNo?: string
}

export type MileageEditorRow = {
  id: string
  companyCode: string
  employeeNo: string
  name: string
  department: string
  team: string
  year: number
  mileage: number
  status: 'Pending' | 'Approved' | 'Rejected'
  effectiveDate: string
  resultCode?: 'SUCCESS' | 'FAIL'
  resultMessage?: string
}

export type SaveMileageRowsRequest = {
  deletedIds: string[]
  rows: MileageEditorRow[]
}

export type SaveMileageRowsResponse = {
  results: Array<{
    id: string
    message: string
    resultCode: 'SUCCESS' | 'FAIL'
  }>
}
