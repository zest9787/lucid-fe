import { Layout, Typography } from 'antd'
import {
  MileageDetailModal,
  MileageGrid,
  MileageSearchForm,
  useMileageSearch,
} from '../../../features/mileage-search'
import './ConditionGridPage.scss'

export function ConditionGridPage() {
  const { searchForm, grid, detailModal } = useMileageSearch()

  return (
    <Layout className="condition-grid-page">
      <Layout.Header className="condition-grid-page__header">
        <Typography.Title level={4}>Condition Grid</Typography.Title>
      </Layout.Header>
      <Layout.Content className="condition-grid-page__content">
        <section className="condition-grid-page__search">
          <MileageSearchForm model={searchForm} />
        </section>
        <MileageGrid model={grid} />
      </Layout.Content>
      <MileageDetailModal model={detailModal} />
    </Layout>
  )
}
