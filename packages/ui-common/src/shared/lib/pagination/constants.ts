import type { PaginationState } from './types'

export const INITIAL_PAGINATION: Readonly<PaginationState> = {
  current: 1,
  pageSize: 5,
}
