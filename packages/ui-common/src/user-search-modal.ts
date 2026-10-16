// 기존 소비자를 위한 호환 진입점. 새 직원 선택 UI는 ui-common/employee-picker를 사용한다.
export {
  EmployeeSearchFormItem,
  MultiUserSearchModal,
  UserSearchModal,
} from '@widgets/employee-picker'
export type { UserSearchItem } from '@entities/employee'
export { EmployeeAutoComplete } from '@features/employee-search'
