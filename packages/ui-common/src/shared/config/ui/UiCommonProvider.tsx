import type { PropsWithChildren } from 'react'
import { UiCommonConfigContext } from '../model/context'
import type { UiCommonConfig } from '../model/types'

type UiCommonProviderProps = PropsWithChildren<{
  config: UiCommonConfig
}>

export function UiCommonProvider({ children, config }: UiCommonProviderProps) {
  return (
    <UiCommonConfigContext.Provider value={config}>
      {children}
    </UiCommonConfigContext.Provider>
  )
}
