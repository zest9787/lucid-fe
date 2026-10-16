import { useReducer } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EmployeeSearchItem } from '@entities/employee'
import type { EmployeeConditionSearchSubmit } from '@features/employee-search'
import { useSharedServices } from '@shared/config'
import {
  employeePickerReducer,
  initialEmployeePickerState,
} from './employeePickerReducer'

// 조회 전에도 같은 배열을 전달해 AG Grid가 렌더링마다 행 데이터를 다시 처리하지 않게 한다.
const emptyEmployees: EmployeeSearchItem[] = []

/** 단일·다중 선택 모달에서 공유하는 조회와 선택 상태. UI와 무관한 변경 규칙은 reducer에 둔다. */
export function useEmployeePicker(open: boolean) {
  const { employeeSearch } = useSharedServices()
  const [state, dispatch] = useReducer(employeePickerReducer, initialEmployeePickerState)

  // 기존 query key를 유지해 두 모달과 기존 소비자가 같은 캐시를 사용한다.
  const companiesQuery = useQuery({
    queryKey: ['ui-common', 'employee-search', 'companies'],
    queryFn: employeeSearch.getCompanies,
    enabled: open,
  })
  const companyCode = state.companyCode ?? companiesQuery.data?.companyCode
  const orgUnitsQuery = useQuery({
    queryKey: ['ui-common', 'employee-search', 'org-units', companyCode],
    queryFn: () => employeeSearch.getOrgUnits(companyCode ?? ''),
    enabled: open && Boolean(companyCode),
  })
  const employeesQuery = useQuery({
    queryKey: ['ui-common', 'employee-search', 'employees', state.searchParams],
    queryFn: () =>
      state.searchParams ? employeeSearch.searchEmployees(state.searchParams) : [],
    enabled: open && state.searchParams !== null,
  })

  const searchByCondition = (values: EmployeeConditionSearchSubmit) => {
    // 키워드 검색은 선택한 조직 노드와 독립적으로 수행한다.
    dispatch({
      type: 'search',
      params: {
        companyCode: values.companyCode,
        searchMode: 'S',
        searchCond: values.searchCond,
      },
    })
  }

  const searchByOrgUnit = (orgUnitId: string) => {
    if (!companyCode) return

    dispatch({
      type: 'search',
      params: { companyCode, searchMode: 'O', orgUnitId },
    })
  }

  return {
    companies: companiesQuery.data?.companies ?? [],
    companyCode,
    companySearchMode: companiesQuery.data?.searchMode ?? 'S',
    orgUnits: orgUnitsQuery.data ?? [],
    selectedOrgUnitId: state.orgUnitId,
    employees: employeesQuery.data ?? emptyEmployees,
    activeEmployees: state.activeEmployees,
    selectedEmployees: state.selectedEmployees,
    loading: {
      companies: companiesQuery.isFetching,
      orgUnits: orgUnitsQuery.isFetching,
      employees: employeesQuery.isFetching,
    },
    changeCompany: (nextCompanyCode: string) =>
      dispatch({ type: 'changeCompany', companyCode: nextCompanyCode }),
    searchByCondition,
    searchByOrgUnit,
    selectResults: (employees: EmployeeSearchItem[]) =>
      dispatch({ type: 'selectResults', employees }),
    addSelectedEmployees: () => dispatch({ type: 'addSelectedEmployees' }),
    resetSearch: () => dispatch({ type: 'resetSearch' }),
    resetAll: () => dispatch({ type: 'resetAll' }),
  }
}

export type EmployeePickerModel = ReturnType<typeof useEmployeePicker>
