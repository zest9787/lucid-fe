import { create } from 'zustand'
import type { ConditionGridSearchStore } from './types'

const initialPagination = {
  current: 1,
  pageSize: 5,
}

export const useConditionGridSearchStore = create<ConditionGridSearchStore>((set) => ({
  submittedValues: null,
  pagination: initialPagination,
  searchSequence: 0,

  submitSearch: (values) =>
    set((state) => ({
      submittedValues: { ...values },
      pagination: {
        ...state.pagination,
        current: 1,
      },
      searchSequence: state.searchSequence + 1,
    })),

  changePage: (page, pageSize) =>
    set((state) => ({
      pagination: {
        current: state.pagination.pageSize === pageSize ? page : 1,
        pageSize,
      },
    })),

  resetSearch: () =>
    set({
      submittedValues: null,
      pagination: initialPagination,
      searchSequence: 0,
    }),
}))
