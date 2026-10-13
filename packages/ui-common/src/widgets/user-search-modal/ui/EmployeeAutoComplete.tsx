import { AutoComplete, Flex, Spin, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EmployeeSearchItem } from '@entities/employee'
import { useSharedServices } from '@shared/config'

type EmployeeAutoCompleteProps = {
  className?: string
  companyCode?: string
  disabled?: boolean
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
  placeholder = '사원번호 또는 사원명',
  popupMatchSelectWidth = true,
  value = '',
  onChange,
  onSelect,
}: EmployeeAutoCompleteProps) {
  const { employeeSearch } = useSharedServices()
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(value.trim())
    }, searchDelay)

    return () => window.clearTimeout(timer)
  }, [value])

  const canSearch =
    Boolean(companyCode) && debouncedKeyword.length >= minimumKeywordLength

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
            label: (
              <Flex justify="space-between" gap={16}>
                <Typography.Text>{employee.name}</Typography.Text>
                <Typography.Text type="secondary">
                  {employee.employeeNo} · {employee.orgUnitName}
                </Typography.Text>
              </Flex>
            ),
            value: employee.employeeNo,
          }))
        : [],
    [canSearch, employees],
  )

  return (
    <AutoComplete
      className={className}
      disabled={disabled || !companyCode}
      filterOption={false}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      options={options}
      placeholder={companyCode ? placeholder : '회사코드를 먼저 선택하세요.'}
      popupMatchSelectWidth={popupMatchSelectWidth}
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
