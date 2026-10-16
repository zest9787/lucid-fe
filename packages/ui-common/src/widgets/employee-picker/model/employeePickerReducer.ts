import type { EmployeeSearchItem, EmployeeSearchParams } from '@entities/employee'

export type EmployeePickerState = {
  companyCode?: string
  orgUnitId?: string
  searchParams: EmployeeSearchParams | null
  /** 현재 검색 결과에서 선택한 행. 단일 선택에서는 최대 한 명을 저장한다. */
  activeEmployees: EmployeeSearchItem[]
  /** 다중 선택에서 추가 버튼으로 확정한 목록. 재검색·회사 변경에도 유지한다. */
  selectedEmployees: EmployeeSearchItem[]
}

export type EmployeePickerAction =
  | { type: 'changeCompany'; companyCode: string }
  | { type: 'search'; params: EmployeeSearchParams }
  | { type: 'selectResults'; employees: EmployeeSearchItem[] }
  | { type: 'addSelectedEmployees' }
  | { type: 'resetSearch' }
  | { type: 'resetAll' }

export const initialEmployeePickerState: EmployeePickerState = {
  searchParams: null,
  activeEmployees: [],
  selectedEmployees: [],
}

/** 검색 조건과 선택 목록의 변경 규칙을 한 곳에서 관리한다. 원본 상태는 수정하지 않는다. */
export function employeePickerReducer(
  state: EmployeePickerState,
  action: EmployeePickerAction,
): EmployeePickerState {
  switch (action.type) {
    case 'changeCompany':
      return {
        ...initialEmployeePickerState,
        companyCode: action.companyCode,
        selectedEmployees: state.selectedEmployees,
      }
    case 'search':
      return {
        ...state,
        orgUnitId: action.params.searchMode === 'O' ? action.params.orgUnitId : undefined,
        searchParams: action.params,
        activeEmployees: [],
      }
    case 'selectResults':
      return { ...state, activeEmployees: action.employees }
    case 'addSelectedEmployees': {
      const selectedIds = new Set(state.selectedEmployees.map(({ id }) => id))
      const additions = state.activeEmployees.filter(({ id }) => {
        if (selectedIds.has(id)) return false
        selectedIds.add(id)
        return true
      })

      return additions.length > 0
        ? { ...state, selectedEmployees: [...state.selectedEmployees, ...additions] }
        : state
    }
    case 'resetSearch':
      return {
        ...initialEmployeePickerState,
        selectedEmployees: state.selectedEmployees,
      }
    case 'resetAll':
      return initialEmployeePickerState
  }
}
