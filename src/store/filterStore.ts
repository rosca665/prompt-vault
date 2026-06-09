import { create } from 'zustand';
import type { SearchFilters, SortField, SortOrder } from '@/types/api';

interface FilterStoreState {
  filters: SearchFilters;
  sortField: SortField;
  sortOrder: SortOrder;

  setFilters: (filters: SearchFilters) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  filters: {},
  sortField: 'created',
  sortOrder: 'desc',

  setFilters: (filters) => set({ filters }),
  setSortField: (field) => set({ sortField: field }),
  setSortOrder: (order) => set({ sortOrder: order }),
  resetFilters: () =>
    set({
      filters: {},
      sortField: 'created',
      sortOrder: 'desc',
    }),
}));
