import { EmployeeSearchFormItem } from 'ui-common/employee-picker'
import { SearchForm, SearchRadioGroup, SearchSelect } from '@shared/ui/search-form'
import type {
  MileageSearchViewModel,
  MileageSearchValues,
} from '../../../features/mileage-search'

type MileageSearchFormProps = {
  model: MileageSearchViewModel['searchForm']
}

export function MileageSearchForm({ model }: MileageSearchFormProps) {
  return (
    <SearchForm<MileageSearchValues>
      form={model.form}
      initialValues={model.initialValues}
      onFinish={model.onSearch}
      onReset={model.onReset}
      searchLoading={model.loading.search}
    >
      <SearchSelect
        label="회사코드"
        name="companyCode"
        rules={[{ required: true, message: '회사코드를 선택하세요.' }]}
        loading={model.loading.companies}
        options={model.options.companies}
        placeholder="회사코드"
        onChange={model.onCompanyChange}
      />
      <EmployeeSearchFormItem onCompanyChange={model.onCompanyChange} />
      <SearchSelect
        label="직위"
        loading={model.loading.positions}
        name="position"
        options={model.options.positions}
        placeholder="직위"
      />
      <SearchSelect
        label="직책"
        name="jobTitle"
        options={model.options.jobTitles}
        placeholder="직책"
      />
      <SearchSelect
        label="롤"
        loading={model.loading.roles}
        name="role"
        options={model.options.roles}
        placeholder="롤"
      />
      <SearchRadioGroup label="Type" name="type" options={model.options.viewTypes} />
    </SearchForm>
  )
}
