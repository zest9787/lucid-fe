import { Typography } from 'antd'
import { MileageEditorGrid, useMileageEditor } from '../../../features/mileage-editor'
import { MileageEditorSearchForm } from './MileageEditorSearchForm'
import './MileageEditorPage.scss'

export function MileageEditorPage() {
  const { form, grid } = useMileageEditor()

  return (
    <section className="mileage-editor-page">
      <Typography.Title level={3}>Mileage Editor</Typography.Title>
      <section className="mileage-editor-page__search">
        <MileageEditorSearchForm model={form} />
      </section>
      <MileageEditorGrid model={grid} />
    </section>
  )
}
