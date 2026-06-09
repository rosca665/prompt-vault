import React, { useState, useCallback, useEffect } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { useUIStore } from '@/store/uiStore';
import { useSearch } from '@/hooks/useSearch';
import PromptList from './PromptList';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import SortSelector from './SortSelector';
import styles from './MainPanel.module.css';

const MainPanel: React.FC = () => {
  const { prompts, setCurrentPrompt } = usePromptStore();
  const { showToast } = useUIStore();
  const search = useSearch();
  const [displayedPrompts, setDisplayedPrompts] = useState(prompts);

  // Update displayed prompts when filters/sort changes
  useEffect(() => {
    const filtered = search.getFilteredAndSorted();
    setDisplayedPrompts(filtered);
  }, [search, prompts]);

  const handleSearch = useCallback(
    (query: string) => {
      search.updateQuery(query);
    },
    [search]
  );

  const handleSelectPrompt = useCallback(
    (promptId: string) => {
      const prompt = prompts.find((p) => p.id === promptId);
      if (prompt) {
        setCurrentPrompt(prompt);
      }
    },
    [prompts, setCurrentPrompt]
  );

  const handleNewPrompt = useCallback(() => {
    showToast('New prompt feature coming in Phase 2', 'info');
  }, [showToast]);

  return (
    <section className={styles.mainPanel}>
      <header className={styles.header}>
        <SearchBar value={search.query} onChange={handleSearch} />
        <button className={styles.newBtn} onClick={handleNewPrompt}>
          + New
        </button>
      </header>

      <div className={styles.controls}>
        <FilterChips filters={search.filters} onFiltersChange={search.updateFilters} />
        <SortSelector
          sortField={search.sortField}
          sortOrder={search.sortOrder}
          onSortChange={(field, order) => search.updateSort(field, order)}
        />
      </div>

      <div className={styles.content}>
        {displayedPrompts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>📝 No prompts found</p>
            <p className={styles.emptySubtext}>
              {search.query ? 'Try a different search' : 'Create your first prompt to get started'}
            </p>
          </div>
        ) : (
          <PromptList prompts={displayedPrompts} onSelectPrompt={handleSelectPrompt} />
        )}
      </div>
    </section>
  );
};

export default MainPanel;
