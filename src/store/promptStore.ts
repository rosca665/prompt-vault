import { create } from 'zustand';
import type { Prompt } from '@/types/prompt';

interface PromptStoreState {
  prompts: Prompt[];
  currentPrompt: Prompt | null;
  isLoading: boolean;
  error: string | null;

  setPrompts: (prompts: Prompt[]) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (prompt: Prompt) => void;
  removePrompt: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePromptStore = create<PromptStoreState>((set) => ({
  prompts: [],
  currentPrompt: null,
  isLoading: false,
  error: null,

  setPrompts: (prompts) => set({ prompts }),
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  addPrompt: (prompt) =>
    set((state) => ({ prompts: [prompt, ...state.prompts] })),
  updatePrompt: (prompt) =>
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === prompt.id ? prompt : p)),
      currentPrompt: state.currentPrompt?.id === prompt.id ? prompt : state.currentPrompt,
    })),
  removePrompt: (id) =>
    set((state) => ({
      prompts: state.prompts.filter((p) => p.id !== id),
      currentPrompt: state.currentPrompt?.id === id ? null : state.currentPrompt,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
