import { create } from 'zustand'
import { INITIAL_PAGINATION } from '@shared/lib/pagination'
import type { ConditionGridSearchStore } from './types'

export const useConditionGridSearchStore = create<ConditionGridSearchStore>((set) => ({
  submittedValues: null,
  pagination: { ...INITIAL_PAGINATION },
  searchSequence: 0,
  selectedRowId: null,

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
      pagination: { ...INITIAL_PAGINATION },
      searchSequence: 0,
      selectedRowId: null,
    }),

  openDetail: (rowId) => set({ selectedRowId: rowId }),

  closeDetail: () => set({ selectedRowId: null }),
}))
