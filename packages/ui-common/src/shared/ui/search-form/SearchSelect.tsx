import { Form, Select } from 'antd'
import type { FormItemProps, SelectProps } from 'antd'
import type { ReactNode } from 'react'

type SearchSelectProps<ValueType = string> = SelectProps<ValueType> & {
  label: ReactNode
  name: FormItemProps['name']
  rules?: FormItemProps['rules']
}

export function SearchSelect<ValueType = string>({
  label,
  name,
  rules,
  ...selectProps
}: SearchSelectProps<ValueType>) {
  return (
    <Form.Item
      className="common-search-form__field"
      label={label}
      name={name}
      rules={rules}
    >
      <Select<ValueType> {...selectProps} />
    </Form.Item>
  )
}
