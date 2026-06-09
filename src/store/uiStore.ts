import { create } from 'zustand';

interface UIStoreState {
  theme: 'dark' | 'light' | 'system';
  sidebarWidth: number;
  mainPanelWidth: number;
  showMarkdownPreview: boolean;
  showVariableModal: boolean;
  showDeleteConfirm: boolean;
  showSettingsModal: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning';

  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setSidebarWidth: (width: number) => void;
  setMainPanelWidth: (width: number) => void;
  setShowMarkdownPreview: (show: boolean) => void;
  setShowVariableModal: (show: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  theme: 'dark',
  sidebarWidth: 280,
  mainPanelWidth: 400,
  showMarkdownPreview: false,
  showVariableModal: false,
  showDeleteConfirm: false,
  showSettingsModal: false,
  toastMessage: null,
  toastType: 'info',

  setTheme: (theme) => set({ theme }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setMainPanelWidth: (width) => set({ mainPanelWidth: width }),
  setShowMarkdownPreview: (show) => set({ showMarkdownPreview: show }),
  setShowVariableModal: (show) => set({ showVariableModal: show }),
  setShowDeleteConfirm: (show) => set({ showDeleteConfirm: show }),
  setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  showToast: (message, type = 'info') => set({ toastMessage: message, toastType: type }),
  clearToast: () => set({ toastMessage: null }),
}));
