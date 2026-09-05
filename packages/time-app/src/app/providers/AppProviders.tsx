import { ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { UiCommonProvider } from 'ui-common/config'
import { sampleUiCommonDataSource, uiCommonDataSource } from '../../shared/api'
import { queryClient } from './queryClient'

const useSampleData = import.meta.env.VITE_USE_SAMPLE_DATA !== 'false'
const uiCommonConfig = useSampleData ? sampleUiCommonDataSource : uiCommonDataSource

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
      <QueryClientProvider client={queryClient}>
        <UiCommonProvider config={uiCommonConfig}>{children}</UiCommonProvider>
      </QueryClientProvider>
    </ConfigProvider>
  )
}
