import { Typography } from 'antd'
import { MileageEditorGrid, useMileageEditor } from '../../../features/mileage-editor'
import { MileageEditorSearchForm } from './MileageEditorSearchForm'
import './MileageEditorPage.scss'

export function MileageAntdEditorPage() {
  const { form, grid } = useMileageEditor()

  return (
    <section className="mileage-editor-page">
      <Typography.Title level={3}>Mileage Antd Editor</Typography.Title>
      <Typography.Text type="secondary">
        AG Grid 셀 편집기에 Ant Design Input, Select, Calendar를 사용합니다.
      </Typography.Text>
      <section className="mileage-editor-page__search">
        <MileageEditorSearchForm model={form} />
      </section>
      <MileageEditorGrid editorType="antd" model={grid} />
    </section>
  )
}
