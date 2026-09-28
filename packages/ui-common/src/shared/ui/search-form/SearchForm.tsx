import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Space } from 'antd'
import type { FormInstance, FormProps } from 'antd'
import type { PropsWithChildren } from 'react'
import './SearchForm.scss'

type SearchFormProps<Values extends object> = PropsWithChildren<{
  form: FormInstance<Values>
  initialValues?: FormProps<Values>['initialValues']
  onFinish: (values: Values) => void
  onRefresh: () => void
  refreshLoading?: boolean
  searchLoading?: boolean
}>

export function SearchForm<Values extends object>({
  children,
  form,
  initialValues,
  onFinish,
  onRefresh,
  refreshLoading = false,
  searchLoading = false,
}: SearchFormProps<Values>) {
  return (
    <Form<Values>
      className="common-search-form"
      form={form}
      initialValues={initialValues}
      layout="inline"
      onFinish={onFinish}
    >
      {children}
      <Form.Item className="common-search-form__actions">
        <Space size={8}>
          <Button
            icon={<ReloadOutlined />}
            loading={refreshLoading}
            onClick={onRefresh}
          >
            새로고침
          </Button>
          <Button
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={searchLoading}
            type="primary"
          >
            검색
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
