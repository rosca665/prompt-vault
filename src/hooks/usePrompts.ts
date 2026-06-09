import { useCallback, useEffect, useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import * as api from '@/services/api';
import type { Prompt, CreatePromptInput, UpdatePromptInput } from '@/types/prompt';

export const usePrompts = () => {
  const store = usePromptStore();
  const [isInitializing, setIsInitializing] = useState(true);

  // Load all prompts on mount
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        store.setLoading(true);
        const prompts = await api.getAllPrompts();
        store.setPrompts(prompts);
      } catch (error) {
        store.setError(String(error));
      } finally {
        store.setLoading(false);
        setIsInitializing(false);
      }
    };

    loadPrompts();
  }, [store]);

  const createPrompt = useCallback(
    async (input: CreatePromptInput): Promise<Prompt> => {
      try {
        store.setLoading(true);
        const prompt = await api.createPrompt(input);
        store.addPrompt(prompt);
        return prompt;
      } catch (error) {
        store.setError(String(error));
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const updatePrompt = useCallback(
    async (id: string, input: UpdatePromptInput): Promise<Prompt> => {
      try {
        store.setLoading(true);
        const prompt = await api.updatePrompt(id, input);
        store.updatePrompt(prompt);
        return prompt;
      } catch (error) {
        store.setError(String(error));
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const deletePrompt = useCallback(
    async (id: string): Promise<void> => {
      try {
        store.setLoading(true);
        await api.deletePrompt(id);
        store.removePrompt(id);
      } catch (error) {
        store.setError(String(error));
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const selectPrompt = useCallback(
    async (id: string): Promise<void> => {
      try {
        const prompt = await api.getPrompt(id);
        store.setCurrentPrompt(prompt);
      } catch (error) {
        store.setError(String(error));
      }
    },
    [store]
  );

  return {
    prompts: store.prompts,
    currentPrompt: store.currentPrompt,
    isLoading: store.isLoading,
    isInitializing,
    error: store.error,
    createPrompt,
    updatePrompt,
    deletePrompt,
    selectPrompt,
  };
};
