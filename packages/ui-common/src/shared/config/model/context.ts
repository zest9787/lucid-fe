import { createContext } from 'react'
import type { UiCommonConfig } from './types'

export const UiCommonConfigContext = createContext<UiCommonConfig | null>(null)
