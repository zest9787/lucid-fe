import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Layout, Pagination, Typography } from 'antd'
import { useMemo } from 'react'
import '@shared/lib/ag-grid/registerCommunityModules'
import { SearchForm, SearchSelect } from '@shared/ui/search-form'
import { useConditionGridSearch } from '../model/useConditionGridSearch'
import type { ConditionGridRow, ConditionGridSearchValues } from '../model/types'
import { ConditionGridDetailModal } from './ConditionGridDetailModal'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import './ConditionGridPage.scss'

const columns: ColDef<ConditionGridRow>[] = [
  { field: 'companyCode', headerName: 'Company Code', minWidth: 160, flex: 1 },
  { field: 'position', headerName: 'Position', minWidth: 180, flex: 1 },
  { field: 'jobTitle', headerName: 'Job Title', minWidth: 140, flex: 1 },
  { field: 'role', headerName: 'Role', minWidth: 160, flex: 1 },
]

export function ConditionGridPage() {
  const {
    closeDetail,
    companies,
    form,
    handleCompanyChange,
    handlePageChange,
    handleRefresh,
    handleRowClick,
    handleSearch,
    initialValues,
    isCompaniesFetching,
    isDetailError,
    isDetailFetching,
    isDetailOpen,
    isPositionsFetching,
    isRolesFetching,
    isSearchFetching,
    jobTitleOptions,
    positions,
    rowData,
    roles,
    pagination,
    detail,
  } = useConditionGridSearch()

  const defaultColDef = useMemo<ColDef<ConditionGridRow>>(
    () => ({
      filter: true,
      resizable: true,
      sortable: true,
    }),
    [],
  )

  return (
    <Layout className="condition-grid-page">
      <Layout.Header className="condition-grid-page__header">
        <Typography.Title level={4}>Condition Grid</Typography.Title>
      </Layout.Header>
      <Layout.Content className="condition-grid-page__content">
        <section className="condition-grid-page__search">
          <SearchForm<ConditionGridSearchValues>
            form={form}
            initialValues={initialValues}
            onFinish={handleSearch}
            onRefresh={handleRefresh}
            searchLoading={isSearchFetching}
          >
            <SearchSelect
              label="회사코드"
              name="companyCode"
              rules={[{ required: true, message: '회사코드를 선택하세요.' }]}
              loading={isCompaniesFetching}
              options={companies}
              placeholder="회사코드"
              onChange={handleCompanyChange}
            />
            <SearchSelect
              label="직위"
              loading={isPositionsFetching}
              name="position"
              options={positions}
              placeholder="직위"
            />
            <SearchSelect
              label="직책"
              name="jobTitle"
              options={jobTitleOptions}
              placeholder="직책"
            />
            <SearchSelect
              label="롤"
              loading={isRolesFetching}
              name="role"
              options={roles}
              placeholder="롤"
            />
          </SearchForm>
        </section>
        <section className="condition-grid-page__grid ag-theme-quartz">
          <AgGridReact<ConditionGridRow>
            columnDefs={columns}
            defaultColDef={defaultColDef}
            getRowId={(params) => params.data.id}
            loading={isSearchFetching}
            onRowClicked={(event) => {
              if (event.data) {
                handleRowClick(event.data.id)
              }
            }}
            rowData={rowData}
            rowHeight={42}
            suppressCellFocus
            theme="legacy"
          />
        </section>
        <div className="condition-grid-page__pagination">
          <Pagination
            current={pagination.current}
            onChange={handlePageChange}
            pageSize={pagination.pageSize}
            pageSizeOptions={[5, 10, 20]}
            showSizeChanger
            showTotal={(total) => `총 ${total}건`}
            total={pagination.total}
          />
        </div>
      </Layout.Content>
      <ConditionGridDetailModal
        detail={detail}
        error={isDetailError}
        loading={isDetailFetching}
        onClose={closeDetail}
        open={isDetailOpen}
      />
    </Layout>
  )
}
