import { App as AntdApp, ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { SharedServicesProvider, type SharedServices } from 'ui-common/config'
import {
  employeeSearchDataSource,
  sampleEmployeeSearchDataSource,
} from '../../shared/api'
import { queryClient } from './queryClient'

const useSampleData = import.meta.env.VITE_USE_SAMPLE_DATA !== 'false'
const sharedServices: SharedServices = {
  employeeSearch: useSampleData
    ? sampleEmployeeSearchDataSource
    : employeeSearchDataSource,
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: '#2563eb',
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <SharedServicesProvider services={sharedServices}>
            {children}
          </SharedServicesProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  )
}
