import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Modal, Tooltip, Typography } from 'antd'
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
import { SelectedEmployeeGrid } from './SelectedEmployeeGrid'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import './UserSearchModal.scss'

type MultiUserSearchModalProps = {
  open: boolean
  title?: string
  onCancel: () => void
  onSelect: (users: UserSearchItem[]) => void
}

const emptyEmployeeSearchParams: EmployeeSearchParams | null = null

export function MultiUserSearchModal({
  open,
  title = 'Employee Search',
  onCancel,
  onSelect,
}: MultiUserSearchModalProps) {
  const { employeeSearch } = useUiCommonConfig()
  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>()
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState<string>()
  const [checkedEmployees, setCheckedEmployees] = useState<EmployeeSearchItem[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeSearchItem[]>([])
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
  const selectedEmployeeIds = useMemo(
    () => selectedEmployees.map((employee) => employee.id),
    [selectedEmployees],
  )

  const resetSearchState = useCallback(() => {
    setSelectedOrgUnitId(undefined)
    setCheckedEmployees([])
    setEmployeeSearchParams(emptyEmployeeSearchParams)
  }, [])

  const resetAllState = useCallback(() => {
    setSelectedCompanyCode(undefined)
    setSelectedEmployees([])
    resetSearchState()
  }, [resetSearchState])

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
    setCheckedEmployees([])
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
    setCheckedEmployees([])
    setEmployeeSearchParams({
      companyCode: effectiveCompanyCode,
      searchMode: 'O',
      orgUnitId,
    })
  }

  const handleAddSelectedEmployees = () => {
    if (checkedEmployees.length === 0) {
      return
    }

    setSelectedEmployees((prevEmployees) => {
      const selectedIdSet = new Set(prevEmployees.map((employee) => employee.id))
      const nextEmployees = checkedEmployees.filter(
        (employee) => !selectedIdSet.has(employee.id),
      )

      return nextEmployees.length > 0
        ? [...prevEmployees, ...nextEmployees]
        : prevEmployees
    })
  }

  const handleClose = () => {
    resetAllState()
    onCancel()
  }

  const handleSelect = () => {
    onSelect(selectedEmployees)
  }

  return (
    <Modal
      centered
      destroyOnHidden
      open={open}
      title={title}
      width={1440}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="select"
          disabled={selectedEmployees.length === 0}
          type="primary"
          onClick={handleSelect}
        >
          Select
        </Button>,
      ]}
      afterOpenChange={(visible) => {
        if (!visible) {
          resetAllState()
        }
      }}
    >
      <section className="user-search-modal user-search-modal--multi">
        <EmployeeSearchConditionForm
          companies={companies}
          companySearchMode={companySearchMode}
          initialCompanyCode={effectiveCompanyCode}
          loading={isCompanyFetching}
          onCompanyChange={handleCompanyChange}
          onReset={handleConditionReset}
          onSearch={handleConditionSearch}
        />

        <div className="user-search-modal__body user-search-modal__body--multi">
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
            <div className="user-search-modal__transfer">
              <EmployeeSearchResultGrid
                employees={employees}
                loading={isEmployeeFetching}
                selectedEmployeeIds={selectedEmployeeIds}
                selectionMode="multiple"
                onSelectionChange={setCheckedEmployees}
              />
              <Tooltip title="Add selected employees">
                <Button
                  className="user-search-modal__transfer-button"
                  disabled={checkedEmployees.length === 0}
                  icon={<ArrowRightOutlined />}
                  shape="circle"
                  type="primary"
                  onClick={handleAddSelectedEmployees}
                />
              </Tooltip>
            </div>
          </section>

          <section className="user-search-modal__selected-panel">
            <Typography.Title level={5}>Selected Users</Typography.Title>
            <SelectedEmployeeGrid employees={selectedEmployees} />
          </section>
        </div>

        <Typography.Text type="secondary">
          {selectedEmployees.length > 0
            ? `${selectedEmployees.length} employee(s) selected.`
            : 'Select employees from the search result and add them.'}
        </Typography.Text>
      </section>
    </Modal>
  )
}
