import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { INITIAL_PAGINATION } from '@shared/lib/pagination'
import type { MileageSearchStore } from './types'

export const useMileageSearchStore = create<MileageSearchStore>()(
  devtools(
    (set) => ({
      submittedValues: null,
      pagination: { ...INITIAL_PAGINATION },
      selectedRowId: null,

      submitSearch: (values) =>
        set(
          (state) => ({
            submittedValues: { ...values },
            pagination: {
              ...state.pagination,
              current: 1,
            },
          }),
          false,
          'mileage/submitSearch',
        ),

      changePage: (page, pageSize) =>
        set(
          (state) => ({
            pagination: {
              current: state.pagination.pageSize === pageSize ? page : 1,
              pageSize,
            },
          }),
          false,
          'mileage/changePage',
        ),

      resetSearch: () =>
        set(
          {
            submittedValues: null,
            pagination: { ...INITIAL_PAGINATION },
            selectedRowId: null,
          },
          false,
          'mileage/resetSearch',
        ),

      openDetail: (rowId) => set({ selectedRowId: rowId }, false, 'mileage/openDetail'),

      closeDetail: () => set({ selectedRowId: null }, false, 'mileage/closeDetail'),
    }),
    { name: 'mileageStore' },
  ),
)
