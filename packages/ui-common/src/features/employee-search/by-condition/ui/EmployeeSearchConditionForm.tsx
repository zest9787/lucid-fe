import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import type { CompanyOption, CompanySearchMode } from '@entities/company'
import type {
  EmployeeConditionSearchSubmit,
  EmployeeConditionSearchValues,
} from '../model/types'
import './EmployeeSearchConditionForm.scss'

type EmployeeSearchConditionFormProps = {
  companies: CompanyOption[]
  companySearchMode: CompanySearchMode
  initialCompanyCode?: string
  loading?: boolean
  onCompanyChange: (companyCode: string) => void
  onReset: () => void
  onSearch: (values: EmployeeConditionSearchSubmit) => void
}

export function EmployeeSearchConditionForm({
  companies,
  companySearchMode,
  initialCompanyCode,
  loading = false,
  onCompanyChange,
  onReset,
  onSearch,
}: EmployeeSearchConditionFormProps) {
  const [form] = Form.useForm<EmployeeConditionSearchValues>()
  const isFixedCompany = companySearchMode === 'F'

  // Company options are loaded after the modal opens, so the form value is synced.
  useEffect(() => {
    form.setFieldsValue({ companyCode: initialCompanyCode })
  }, [form, initialCompanyCode])

  return (
    <Form<EmployeeConditionSearchValues>
      className="employee-search-condition-form"
      form={form}
      layout="inline"
      initialValues={{ companyCode: initialCompanyCode, searchCond: '' }}
      onFinish={(values) => onSearch({ ...values, companySearchMode: companySearchMode })}
    >
      <Form.Item
        className="employee-search-condition-form__company"
        label="Company"
        name="companyCode"
        rules={[{ required: true, message: 'Select a company.' }]}
      >
        <Select
          disabled={isFixedCompany}
          loading={loading}
          options={companies.map((company) => ({
            label: company.companyText,
            value: company.companyCode,
          }))}
          placeholder="Company"
          onChange={onCompanyChange}
        />
      </Form.Item>

      <Form.Item
        className="employee-search-condition-form__keyword"
        label="Keyword"
        name="searchCond"
      >
        <Input allowClear placeholder="Employee name, no, email" />
      </Form.Item>

      <Form.Item className="employee-search-condition-form__actions">
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            form.resetFields()
            onReset()
          }}
        >
          Reset
        </Button>
        <Button htmlType="submit" icon={<SearchOutlined />} type="primary">
          Search
        </Button>
      </Form.Item>
    </Form>
  )
}
