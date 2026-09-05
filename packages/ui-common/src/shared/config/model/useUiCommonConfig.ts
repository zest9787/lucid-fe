import { useContext } from 'react'
import { UiCommonConfigContext } from './context'

export function useUiCommonConfig() {
  const config = useContext(UiCommonConfigContext)

  if (!config) {
    throw new Error('UiCommonProvider config is required.')
  }

  return config
}
