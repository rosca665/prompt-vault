export interface Settings {
  theme: 'dark' | 'light' | 'system';
  defaultCategory: string;
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  backupLocation: string;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  globalHotkeyEnabled: boolean;
  compactMode: boolean;
  fontSize: number; // 12-18
  privacyMode: boolean;
  dataLocation: string; // Read-only, display only
}

export type SettingsKey = keyof Settings;
