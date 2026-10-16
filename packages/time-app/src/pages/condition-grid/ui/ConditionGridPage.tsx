import { Typography } from 'antd'
import {
  MileageDetailModal,
  MileageGrid,
  useMileageSearch,
} from '../../../features/mileage-search'
import { MileageSearchForm } from './MileageSearchForm'
import './ConditionGridPage.scss'

export function ConditionGridPage() {
  const { searchForm, grid, detailModal } = useMileageSearch()

  return (
    <section className="condition-grid-page">
      <Typography.Title level={3}>Mileage Search</Typography.Title>
      <div className="condition-grid-page__content">
        <section className="condition-grid-page__search">
          <MileageSearchForm model={searchForm} />
        </section>
        <MileageGrid model={grid} />
      </div>
      <MileageDetailModal model={detailModal} />
    </section>
  )
}
