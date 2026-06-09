import { useCallback, useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import * as api from '@/services/api';
import type { SearchFilters, SortField, SortOrder } from '@/types/api';
import type { Prompt, CreatePromptInput, UpdatePromptInput } from '@/types/prompt';

interface UseSearchState {
  query: string;
  filters: SearchFilters;
  sortField: SortField;
  sortOrder: SortOrder;
  isSearching: boolean;
}

export const useSearch = () => {
  const store = usePromptStore();
  const [state, setState] = useState<UseSearchState>({
    query: '',
    filters: {},
    sortField: 'created',
    sortOrder: 'desc',
    isSearching: false,
  });

  const updateQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const updateFilters = useCallback((filters: SearchFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const updateSort = useCallback((field: SortField, order: SortOrder) => {
    setState((prev) => ({ ...prev, sortField: field, sortOrder: order }));
  }, []);

  const executeSearch = useCallback(async () => {
    if (!state.query.trim()) {
      // Reset to all prompts if query is empty
      return store.prompts;
    }

    try {
      setState((prev) => ({ ...prev, isSearching: true }));
      const results = await api.searchPrompts(state.query);
      return filterAndSort(results, state.filters, state.sortField, state.sortOrder);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    } finally {
      setState((prev) => ({ ...prev, isSearching: false }));
    }
  }, [state.query, state.filters, state.sortField, state.sortOrder, store.prompts]);

  const getFilteredAndSorted = useCallback((): Prompt[] => {
    let results = store.prompts;

    // Apply filters
    if (state.filters.categoryId) {
      results = results.filter((p) => p.categoryId === state.filters.categoryId);
    }
    if (state.filters.favourite !== undefined) {
      results = results.filter((p) => p.favourite === state.filters.favourite);
    }
    if (state.filters.model) {
      results = results.filter((p) => p.model === state.filters.model);
    }
    if (state.filters.minRating !== undefined) {
      results = results.filter((p) => p.rating >= state.filters.minRating!);
    }
    if (state.filters.maxRating !== undefined) {
      results = results.filter((p) => p.rating <= state.filters.maxRating!);
    }
    if (state.filters.tags && state.filters.tags.length > 0) {
      // Note: Tag filtering requires prompt_tags table lookup
      // Simplified for now
    }

    // Apply sorting
    results = sortPrompts(results, state.sortField, state.sortOrder);

    return results;
  }, [store.prompts, state.filters, state.sortField, state.sortOrder]);

  return {
    query: state.query,
    filters: state.filters,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    isSearching: state.isSearching,
    updateQuery,
    updateFilters,
    updateSort,
    executeSearch,
    getFilteredAndSorted,
  };
};

function filterAndSort(
  prompts: Prompt[],
  filters: SearchFilters,
  sortField: SortField,
  sortOrder: SortOrder
): Prompt[] {
  let results = prompts;

  // Apply filters
  if (filters.categoryId) {
    results = results.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.favourite !== undefined) {
    results = results.filter((p) => p.favourite === filters.favourite);
  }
  if (filters.model) {
    results = results.filter((p) => p.model === filters.model);
  }
  if (filters.minRating !== undefined) {
    results = results.filter((p) => p.rating >= filters.minRating);
  }
  if (filters.maxRating !== undefined) {
    results = results.filter((p) => p.rating <= filters.maxRating);
  }

  return sortPrompts(results, sortField, sortOrder);
}

function sortPrompts(
  prompts: Prompt[],
  field: SortField,
  order: SortOrder
): Prompt[] {
  const sorted = [...prompts].sort((a, b) => {
    let aVal: string | number | null = '';
    let bVal: string | number | null = '';

    switch (field) {
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'created':
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case 'updated':
        aVal = new Date(a.updatedAt).getTime();
        bVal = new Date(b.updatedAt).getTime();
        break;
      case 'lastUsed':
        aVal = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        bVal = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        break;
      case 'usageCount':
        aVal = a.usageCount;
        bVal = b.usageCount;
        break;
      case 'rating':
        aVal = a.rating;
        bVal = b.rating;
        break;
    }

    if (aVal === null) aVal = '';
    if (bVal === null) bVal = '';

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}
