import { EmployeeSearchFormItem } from 'ui-common/user-search-modal'
import { SearchForm, SearchSelect } from '@shared/ui/search-form'
import type { MileageEditorViewModel } from '../model/useMileageEditor'
import type { MileageEditorSearchValues } from '../model/types'

type MileageEditorSearchFormProps = {
  model: MileageEditorViewModel['form']
}

export function MileageEditorSearchForm({ model }: MileageEditorSearchFormProps) {
  return (
    <SearchForm<MileageEditorSearchValues>
      form={model.form}
      initialValues={model.initialValues}
      onFinish={model.onSearch}
      onReset={model.onReset}
      searchLoading={model.loading}
    >
      <SearchSelect
        label="회사코드"
        name="companyCode"
        rules={[{ required: true, message: '회사코드를 선택하세요.' }]}
        loading={model.loading}
        options={model.companies}
        placeholder="회사코드"
        onChange={model.onCompanyChange}
      />
      <EmployeeSearchFormItem
        minimumEnglishKeywordLength={3}
        minimumKoreanKeywordLength={2}
        minimumNumericKeywordLength={5}
        onCompanyChange={model.onCompanyChange}
      />
    </SearchForm>
  )
}
