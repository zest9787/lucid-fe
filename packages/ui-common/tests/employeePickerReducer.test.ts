import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { EmployeeSearchItem } from '@entities/employee'
import {
  employeePickerReducer,
  initialEmployeePickerState,
  type EmployeePickerState,
} from '@widgets/employee-picker/model/employeePickerReducer.ts'

const employee = (id: string, companyCode = 'A'): EmployeeSearchItem => ({
  id,
  companyCode,
  employeeNo: id,
  name: `Employee ${id}`,
  email: `${id}@example.com`,
  orgUnitId: 'org-1',
  orgUnitName: 'Development',
  position: 'Developer',
})

const firstEmployee = employee('1')
const secondEmployee = employee('2', 'B')

const searchedState = (): EmployeePickerState => ({
  companyCode: 'A',
  orgUnitId: 'org-1',
  searchParams: { companyCode: 'A', searchMode: 'O', orgUnitId: 'org-1' },
  activeEmployees: [firstEmployee],
  selectedEmployees: [firstEmployee],
})

test('회사 변경은 검색 결과 선택과 조직 조건을 지우고 추가한 직원은 유지한다', () => {
  const state = searchedState()
  const next = employeePickerReducer(state, { type: 'changeCompany', companyCode: 'B' })

  assert.equal(next.companyCode, 'B')
  assert.equal(next.orgUnitId, undefined)
  assert.equal(next.searchParams, null)
  assert.deepEqual(next.activeEmployees, [])
  assert.strictEqual(next.selectedEmployees, state.selectedEmployees)
})

test('키워드 검색은 이전 조직 조건과 결과 선택을 해제한다', () => {
  const params = { companyCode: 'A', searchMode: 'S', searchCond: 'Kim' } as const
  const next = employeePickerReducer(searchedState(), { type: 'search', params })

  assert.equal(next.orgUnitId, undefined)
  assert.deepEqual(next.searchParams, params)
  assert.deepEqual(next.activeEmployees, [])
  assert.deepEqual(next.selectedEmployees, [firstEmployee])
})

test('조직 검색은 이전 키워드 조건을 대체한다', () => {
  const params = { companyCode: 'A', searchMode: 'O', orgUnitId: 'org-2' } as const
  const state = {
    ...searchedState(),
    searchParams: { companyCode: 'A', searchMode: 'S', searchCond: 'Kim' } as const,
  }
  const next = employeePickerReducer(state, { type: 'search', params })

  assert.equal(next.orgUnitId, 'org-2')
  assert.deepEqual(next.searchParams, params)
  assert.deepEqual(next.activeEmployees, [])
})

test('결과 행 선택은 추가 목록을 변경하지 않는다', () => {
  const next = employeePickerReducer(searchedState(), {
    type: 'selectResults',
    employees: [secondEmployee],
  })

  assert.deepEqual(next.activeEmployees, [secondEmployee])
  assert.deepEqual(next.selectedEmployees, [firstEmployee])
})

test('직원 추가는 기존 순서를 유지하고 ID 중복을 제거한다', () => {
  const state = {
    ...searchedState(),
    activeEmployees: [firstEmployee, secondEmployee, { ...secondEmployee }],
  }
  Object.freeze(state.selectedEmployees)
  Object.freeze(state.activeEmployees)
  Object.freeze(state)

  const next = employeePickerReducer(state, { type: 'addSelectedEmployees' })

  assert.deepEqual(next.selectedEmployees, [firstEmployee, secondEmployee])
  assert.deepEqual(state.selectedEmployees, [firstEmployee])
  assert.strictEqual(next.activeEmployees, state.activeEmployees)
})

test('이미 추가한 직원만 다시 추가하면 상태를 변경하지 않는다', () => {
  const state = searchedState()
  assert.strictEqual(
    employeePickerReducer(state, { type: 'addSelectedEmployees' }),
    state,
  )
})

test('결과 선택이 없는 상태에서 추가하면 상태를 변경하지 않는다', () => {
  assert.strictEqual(
    employeePickerReducer(initialEmployeePickerState, { type: 'addSelectedEmployees' }),
    initialEmployeePickerState,
  )
})

test('검색 초기화는 회사 선택을 해제하면서 추가한 직원은 유지한다', () => {
  const state = searchedState()
  const next = employeePickerReducer(state, { type: 'resetSearch' })

  assert.equal(next.companyCode, undefined)
  assert.equal(next.orgUnitId, undefined)
  assert.equal(next.searchParams, null)
  assert.deepEqual(next.activeEmployees, [])
  assert.strictEqual(next.selectedEmployees, state.selectedEmployees)
})

test('모달 닫기 초기화는 다음 열기에 이전 선택과 검색 조건이 남지 않게 한다', () => {
  const next = employeePickerReducer(searchedState(), { type: 'resetAll' })
  assert.deepEqual(next, initialEmployeePickerState)
})
