import { AutoComplete, Spin, theme } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EmployeeSearchItem } from '@entities/employee'
import { useSharedServices } from '@shared/config'
import { EmployeeOptionPopup } from './EmployeeAutoComplete.styles'
import { EmployeeAutoCompleteOption } from './EmployeeAutoCompleteOption'

type EmployeeAutoCompleteProps = {
  className?: string
  companyCode?: string
  disabled?: boolean
  minimumEnglishKeywordLength?: number
  minimumKoreanKeywordLength?: number
  minimumNumericKeywordLength?: number
  placeholder?: string
  popupMatchSelectWidth?: boolean | number
  value?: string
  onChange?: (value: string) => void
  onSelect: (employee: EmployeeSearchItem) => void
}

const minimumKeywordLength = 2
const searchDelay = 300

export function EmployeeAutoComplete({
  className,
  companyCode,
  disabled,
  minimumEnglishKeywordLength = minimumKeywordLength,
  minimumKoreanKeywordLength = minimumKeywordLength,
  minimumNumericKeywordLength = minimumKeywordLength,
  placeholder = '사원번호 또는 사원명',
  popupMatchSelectWidth = true,
  value = '',
  onChange,
  onSelect,
}: EmployeeAutoCompleteProps) {
  const { employeeSearch } = useSharedServices()
  const { token } = theme.useToken()
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const keyword = value.trim()
  const requiredKeywordLength = /^[0-9]+$/.test(keyword)
    ? minimumNumericKeywordLength
    : /[\uAC00-\uD7A3]/.test(keyword)
      ? minimumKoreanKeywordLength
      : /[a-z]/i.test(keyword)
        ? minimumEnglishKeywordLength
        : minimumKeywordLength

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(value.trim())
    }, searchDelay)

    return () => window.clearTimeout(timer)
  }, [value])

  const canSearch =
    Boolean(companyCode) &&
    keyword.length >= requiredKeywordLength &&
    keyword === debouncedKeyword

  const { data: employees = [], isFetching } = useQuery({
    queryKey: ['ui-common', 'employee-auto-complete', companyCode, debouncedKeyword],
    queryFn: () =>
      employeeSearch.searchEmployees({
        companyCode: companyCode ?? '',
        searchCond: debouncedKeyword,
        searchMode: 'S',
      }),
    enabled: canSearch,
  })

  const employeeByNo = useMemo(
    () => new Map(employees.map((employee) => [employee.employeeNo, employee])),
    [employees],
  )
  const options = useMemo(
    () =>
      canSearch
        ? employees.map((employee) => ({
            label: employee.employeeNo,
            value: employee.employeeNo,
            employee,
          }))
        : [],
    [canSearch, employees],
  )

  return (
    <AutoComplete
      className={className}
      disabled={disabled || !companyCode}
      filterOption={false}
      listItemHeight={64}
      listHeight={320}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      options={options}
      optionRender={(option) => (
        <EmployeeAutoCompleteOption employee={option.data.employee} />
      )}
      placeholder={companyCode ? placeholder : '회사코드를 먼저 선택하세요.'}
      popupMatchSelectWidth={popupMatchSelectWidth}
      popupRender={(menu) => (
        <EmployeeOptionPopup
          $primary={token.colorPrimary}
          $activeBackground={token.controlItemBgActive}
          $hoverBackground={token.controlItemBgHover}
          $text={token.colorText}
          $secondaryText={token.colorTextSecondary}
        >
          {menu}
        </EmployeeOptionPopup>
      )}
      value={value}
      onChange={onChange}
      onSelect={(employeeNo) => {
        const employee = employeeByNo.get(employeeNo)

        if (employee) {
          onChange?.(employee.employeeNo)
          onSelect(employee)
        }
      }}
    />
  )
}
