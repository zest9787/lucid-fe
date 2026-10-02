import { Form, Radio } from 'antd'
import type { FormItemProps, RadioGroupProps } from 'antd'
import type { ReactNode } from 'react'

type SearchRadioGroupProps = RadioGroupProps & {
  label: ReactNode
  name: FormItemProps['name']
  rules?: FormItemProps['rules']
}

export function SearchRadioGroup({
  label,
  name,
  rules,
  ...radioGroupProps
}: SearchRadioGroupProps) {
  return (
    <Form.Item
      className="common-search-form__field"
      label={label}
      name={name}
      rules={rules}
    >
      <Radio.Group {...radioGroupProps} />
    </Form.Item>
  )
}
