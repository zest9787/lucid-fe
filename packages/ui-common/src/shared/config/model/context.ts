import { createContext } from 'react'
import type { SharedServices } from './types'

export const SharedServicesContext = createContext<SharedServices | null>(null)

SharedServicesContext.displayName = 'SharedServicesContext'
