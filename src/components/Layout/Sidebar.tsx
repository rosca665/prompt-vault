import React, { useState, useCallback } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { useUIStore } from '@/store/uiStore';
import type { CreatePromptInput } from '@/types/prompt';
import CreatePromptModal from '../Modals/CreatePromptModal';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const { prompts } = usePrompts();
  const { showToast } = useUIStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get unique categories from prompts
  const categories = Array.from(
    new Map(
      prompts
        .map((p) => [p.categoryId, { id: p.categoryId }])
        .concat([['default', { id: 'default', name: 'Codex Prompts' }]])
    ).values()
  );

  const favouriteCount = prompts.filter((p) => p.favourite).length;
  const recentCount = prompts.filter((p) => p.usageCount > 0).length;

  const handleNewPrompt = useCallback(() => {
    // Default to first category
    if (categories.length === 0) {
      showToast('No categories available', 'error');
      return;
    }
    setShowCreateModal(true);
  }, [categories.length, showToast]);

  const handleSettings = useCallback(() => {
    showToast('Settings coming in Phase 3', 'info');
  }, [showToast]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>📚 PromptVault</h1>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Collections</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <button className={styles.link}>
                <span>⭐ Favourites</span>
                <span className={styles.badge}>{favouriteCount}</span>
              </button>
            </li>
            <li className={styles.listItem}>
              <button className={styles.link}>
                <span>⏰ Recent</span>
                <span className={styles.badge}>{recentCount}</span>
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <ul className={styles.list}>
            {categories.map((cat) => (
              <li key={cat.id} className={styles.listItem}>
                <button className={styles.link}>
                  📁 {cat.name || 'Category'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Actions</h2>
          <button className={styles.newBtn} onClick={handleNewPrompt}>
            ➕ New Prompt
          </button>
        </div>
      </nav>

      <footer className={styles.footer}>
        <button className={styles.settingsBtn} onClick={handleSettings}>
          ⚙️ Settings
        </button>
      </footer>

      {showCreateModal && (
        <CreatePromptModal
          categoryId={categories[0]?.id || 'default'}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </aside>
  );
};

export default Sidebar;
