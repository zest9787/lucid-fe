import type { PropsWithChildren } from 'react'
import { SharedServicesContext } from '../model/context'
import type { SharedServices } from '../model/types'

type SharedServicesProviderProps = PropsWithChildren<{
  services: SharedServices
}>

export function SharedServicesProvider({
  children,
  services,
}: SharedServicesProviderProps) {
  return (
    <SharedServicesContext.Provider value={services}>
      {children}
    </SharedServicesContext.Provider>
  )
}
