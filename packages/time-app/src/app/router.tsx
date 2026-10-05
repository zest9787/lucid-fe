import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { MileageAntdEditorPage, MileageEditorPage } from '../pages'
import { ConditionGridPage } from '../pages'
import { AppLayout } from './ui/AppLayout'

const rootRoute = createRootRoute({ component: AppLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/mileage-search' })
  },
})

const mileageSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mileage-search',
  component: ConditionGridPage,
})

const mileageEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mileage-editor',
  component: MileageEditorPage,
})

const mileageAntdEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mileage-editor-antd',
  component: MileageAntdEditorPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  mileageSearchRoute,
  mileageEditorRoute,
  mileageAntdEditorRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
