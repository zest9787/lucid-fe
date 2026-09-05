import { Button, Modal, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  EmployeeSearchItem,
  EmployeeSearchParams,
  UserSearchItem,
} from '@entities/employee'
import {
  EmployeeSearchConditionForm,
  OrgUnitSearchTree,
  type EmployeeConditionSearchSubmit,
} from '@features/employee-search'
import { useUiCommonConfig } from '@shared/config'
import { EmployeeSearchResultGrid } from './EmployeeSearchResultGrid'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import './UserSearchModal.scss'

type UserSearchModalProps = {
  open: boolean
  title?: string
  onCancel: () => void
  onSelect: (user: UserSearchItem) => void
}

const emptyEmployeeSearchParams: EmployeeSearchParams | null = null

export function UserSearchModal({
  open,
  title = 'Employee Search',
  onCancel,
  onSelect,
}: UserSearchModalProps) {
  const { employeeSearch } = useUiCommonConfig()
  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>()
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState<string>()
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSearchItem>()
  const [employeeSearchParams, setEmployeeSearchParams] = useState(
    emptyEmployeeSearchParams,
  )

  const { data: companyList, isFetching: isCompanyFetching } = useQuery({
    queryKey: ['ui-common', 'employee-search', 'companies'],
    queryFn: employeeSearch.getCompanies,
    enabled: open,
  })

  const effectiveCompanyCode = selectedCompanyCode ?? companyList?.companyCode
  const companySearchMode = companyList?.searchMode ?? 'S'

  const { data: orgUnits = [], isFetching: isOrgUnitFetching } = useQuery({
    queryKey: ['ui-common', 'employee-search', 'org-units', effectiveCompanyCode],
    queryFn: () => employeeSearch.getOrgUnits(effectiveCompanyCode ?? ''),
    enabled: open && Boolean(effectiveCompanyCode),
  })

  const { data: employees = [], isFetching: isEmployeeFetching } = useQuery({
    queryKey: ['ui-common', 'employee-search', 'employees', employeeSearchParams],
    queryFn: () =>
      employeeSearch.searchEmployees(employeeSearchParams as EmployeeSearchParams),
    enabled: open && Boolean(employeeSearchParams),
  })

  const companies = useMemo(() => companyList?.companies ?? [], [companyList])

  const resetSearchState = useCallback(() => {
    setSelectedOrgUnitId(undefined)
    setSelectedEmployee(undefined)
    setEmployeeSearchParams(emptyEmployeeSearchParams)
  }, [])

  const handleCompanyChange = (nextCompanyCode: string) => {
    setSelectedCompanyCode(nextCompanyCode)
    resetSearchState()
  }

  const handleConditionReset = () => {
    setSelectedCompanyCode(undefined)
    resetSearchState()
  }

  const handleConditionSearch = (values: EmployeeConditionSearchSubmit) => {
    setSelectedOrgUnitId(undefined)
    setSelectedEmployee(undefined)
    // Keyword searches are intentionally independent from the selected tree node.
    setEmployeeSearchParams({
      companyCode: values.companyCode,
      searchMode: 'S',
      searchCond: values.searchCond,
    })
  }

  const handleOrgUnitSearch = (orgUnitId: string) => {
    if (!effectiveCompanyCode) {
      return
    }

    setSelectedOrgUnitId(orgUnitId)
    setSelectedEmployee(undefined)
    // Department searches use the selected org unit as the only search target.
    setEmployeeSearchParams({
      companyCode: effectiveCompanyCode,
      searchMode: 'O',
      orgUnitId,
    })
  }

  const handleClose = () => {
    setSelectedCompanyCode(undefined)
    resetSearchState()
    onCancel()
  }

  const handleSelect = () => {
    if (selectedEmployee) {
      onSelect(selectedEmployee)
    }
  }

  return (
    <Modal
      centered
      destroyOnHidden
      open={open}
      title={title}
      width={1120}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="select"
          disabled={!selectedEmployee}
          type="primary"
          onClick={handleSelect}
        >
          Select
        </Button>,
      ]}
      afterOpenChange={(visible) => {
        if (!visible) {
          setSelectedCompanyCode(undefined)
          resetSearchState()
        }
      }}
    >
      <section className="user-search-modal">
        <EmployeeSearchConditionForm
          companies={companies}
          companySearchMode={companySearchMode}
          initialCompanyCode={effectiveCompanyCode}
          loading={isCompanyFetching}
          onCompanyChange={handleCompanyChange}
          onReset={handleConditionReset}
          onSearch={handleConditionSearch}
        />

        <div className="user-search-modal__body">
          <aside className="user-search-modal__org-panel">
            <Typography.Title level={5}>Department</Typography.Title>
            <OrgUnitSearchTree
              loading={isOrgUnitFetching}
              orgUnits={orgUnits}
              selectedOrgUnitId={selectedOrgUnitId}
              onSelectOrgUnit={handleOrgUnitSearch}
            />
          </aside>

          <section className="user-search-modal__result-panel">
            <Typography.Title level={5}>Search Result</Typography.Title>
            <EmployeeSearchResultGrid
              employees={employees}
              loading={isEmployeeFetching}
              selectedEmployeeId={selectedEmployee?.id}
              onSelect={setSelectedEmployee}
            />
          </section>
        </div>

        <Typography.Text type="secondary">
          {selectedEmployee
            ? `${selectedEmployee.name} / ${selectedEmployee.orgUnitName}`
            : 'Select an employee from the grid.'}
        </Typography.Text>
      </section>
    </Modal>
  )
}
