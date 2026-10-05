import { useContext } from 'react'
import { SharedServicesContext } from './context'

export function useSharedServices() {
  const services = useContext(SharedServicesContext)

  if (!services) {
    throw new Error(
      'SharedServicesProvider is required. Wrap the application with SharedServicesProvider.',
    )
  }

  return services
}
