/**
 * Core prompt data model
 */
export interface Prompt {
  id: string;
  title: string;
  body: string;
  description: string;
  categoryId: string;
  model: string; // 'gpt-4', 'gpt-3.5-turbo', 'claude-3', etc.
  useCase: string;
  notes: string;
  rating: number; // 1-5
  favourite: boolean;
  archived: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  lastUsedAt: string | null;
  usageCount: number;
}

/**
 * Prompt creation payload (excludes computed fields)
 */
export interface CreatePromptInput {
  title: string;
  body: string;
  description?: string;
  categoryId: string;
  model?: string;
  useCase?: string;
  notes?: string;
}

/**
 * Prompt update payload (all fields optional)
 */
export interface UpdatePromptInput {
  title?: string;
  body?: string;
  description?: string;
  categoryId?: string;
  model?: string;
  useCase?: string;
  notes?: string;
  rating?: number;
  favourite?: boolean;
  archived?: boolean;
}

/**
 * API response for prompt operations
 */
export interface PromptResponse {
  success: boolean;
  data?: Prompt;
  error?: string;
}

/**
 * Search result
 */
export interface SearchResult {
  prompts: Prompt[];
  total: number;
  query: string;
}
