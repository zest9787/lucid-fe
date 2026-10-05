import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MileageSearchStore } from './types'

export const useMileageSearchStore = create<MileageSearchStore>()(
  devtools(
    (set) => ({
      submittedValues: null,
      selectedRowId: null,

      submitSearch: (values) =>
        set(
          () => ({
            submittedValues: { ...values },
          }),
          false,
          'mileage/submitSearch',
        ),

      resetSearch: () =>
        set(
          {
            submittedValues: null,
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
