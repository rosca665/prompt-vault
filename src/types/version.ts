export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  body: string;
  createdAt: string;
  note?: string;
}

export interface VersionDiff {
  old: string;
  new: string;
  changes: DiffChange[];
}

export interface DiffChange {
  type: 'add' | 'remove' | 'modify';
  position: number;
  oldText?: string;
  newText?: string;
}
