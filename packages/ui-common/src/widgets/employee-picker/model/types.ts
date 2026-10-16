import type { EmployeeSearchItem, UserSearchItem } from '@entities/employee'

export type EmployeePickerModalProps = {
  open: boolean
  title?: string
  onCancel: () => void
}

export type UserSearchModalProps = EmployeePickerModalProps & {
  onSelect: (user: UserSearchItem) => void
}

export type MultiUserSearchModalProps = EmployeePickerModalProps & {
  onSelect: (users: UserSearchItem[]) => void
}

export type EmployeeSearchFormValues = {
  companyCode?: string
  employeeName?: string
  employeeNo?: string
}

export type EmployeeSearchFormItemProps = {
  label?: string
  minimumEnglishKeywordLength?: number
  minimumKoreanKeywordLength?: number
  minimumNumericKeywordLength?: number
  onCompanyChange?: () => void
  onSelect?: (employee: EmployeeSearchItem) => void
}
