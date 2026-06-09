import { invoke } from '@tauri-apps/api/tauri';
import type { Prompt, CreatePromptInput, UpdatePromptInput } from '@/types/prompt';
import type { ApiResponse } from '@/types/api';

/**
 * Wrapper around Tauri invoke() with error handling
 */
export const invokeCommand = async <T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> => {
  try {
    const result = await invoke<T>(command, args);
    return result;
  } catch (error) {
    throw new Error(`Command failed: ${command} - ${String(error)}`);
  }
};

/**
 * Create a new prompt
 */
export const createPrompt = async (input: CreatePromptInput): Promise<Prompt> => {
  return invokeCommand<Prompt>('create_prompt', { prompt: input });
};

/**
 * Get all prompts
 */
export const getAllPrompts = async (): Promise<Prompt[]> => {
  return invokeCommand<Prompt[]>('get_all_prompts');
};

/**
 * Get single prompt by ID
 */
export const getPrompt = async (id: string): Promise<Prompt> => {
  return invokeCommand<Prompt>('get_prompt', { id });
};

/**
 * Update prompt
 */
export const updatePrompt = async (id: string, input: UpdatePromptInput): Promise<Prompt> => {
  return invokeCommand<Prompt>('update_prompt', { id, update: input });
};

/**
 * Delete prompt (soft delete)
 */
export const deletePrompt = async (id: string): Promise<void> => {
  return invokeCommand<void>('delete_prompt', { id });
};

/**
 * Restore deleted prompt
 */
export const restorePrompt = async (id: string): Promise<Prompt> => {
  return invokeCommand<Prompt>('restore_prompt', { id });
};

/**
 * Search prompts
 */
export const searchPrompts = async (query: string): Promise<Prompt[]> => {
  return invokeCommand<Prompt[]>('search_prompts', { query });
};

/**
 * Copy prompt (tracks usage)
 */
export const copyPromptToClipboard = async (id: string, text: string): Promise<void> => {
  // Track usage on backend
  await invokeCommand<void>('track_usage', { promptId: id });
  // Copy to clipboard via Tauri
  await invoke('tauri', { __tauriModule: 'Clipboard', message: { cmd: 'writeText', text } });
};
