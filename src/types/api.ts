/**
 * Tauri command response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * List response with pagination
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Search filters
 */
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  tags?: string[];
  model?: string;
  favourite?: boolean;
  hasVariables?: boolean;
  archived?: boolean;
  minRating?: number;
  maxRating?: number;
}

/**
 * Sort options
 */
export type SortField = 'title' | 'created' | 'updated' | 'lastUsed' | 'usageCount' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
