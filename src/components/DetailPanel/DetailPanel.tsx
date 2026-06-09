import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import { useUIStore } from '@/store/uiStore';
import { formatDatetime, wordCount, charCount, estimatePromptTokens } from '@/utils';
import styles from './DetailPanel.module.css';

const DetailPanel: React.FC = () => {
  const { currentPrompt } = usePromptStore();
  const { showToast } = useUIStore();

  if (!currentPrompt) {
    return (
      <section className={styles.detailPanel}>
        <div className={styles.emptyState}>
          <p>👈 Select a prompt to view details</p>
        </div>
      </section>
    );
  }

  const words = wordCount(currentPrompt.body);
  const chars = charCount(currentPrompt.body);
  const tokens = estimatePromptTokens(currentPrompt.title, currentPrompt.body);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt.body);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleEdit = () => {
    showToast('Edit feature coming in Phase 2', 'info');
  };

  return (
    <section className={styles.detailPanel}>
      <header className={styles.header}>
        <h2 className={styles.title}>{currentPrompt.title}</h2>
      </header>

      <div className={styles.content}>
        {/* Metadata Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Info</h3>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <span className={styles.label}>Model:</span>
              <span className={styles.value}>{currentPrompt.model || 'N/A'}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.label}>Created:</span>
              <span className={styles.value}>{formatDatetime(currentPrompt.createdAt)}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.label}>Rating:</span>
              <span className={styles.value}>
                {currentPrompt.rating > 0 ? '★'.repeat(currentPrompt.rating) : 'Not rated'}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.label}>Used:</span>
              <span className={styles.value}>{currentPrompt.usageCount} times</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{words}</div>
              <div className={styles.statLabel}>Words</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>{chars}</div>
              <div className={styles.statLabel}>Characters</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>{tokens}</div>
              <div className={styles.statLabel}>Tokens (est.)</div>
            </div>
          </div>
        </div>

        {/* Body Preview */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Prompt</h3>
          <div className={styles.bodyPreview}>{currentPrompt.body}</div>
        </div>

        {/* Notes */}
        {currentPrompt.notes && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            <p className={styles.notes}>{currentPrompt.notes}</p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <footer className={styles.footer}>
        <button className={styles.btn} onClick={handleCopy}>
          📋 Copy
        </button>
        <button className={styles.btn} onClick={handleEdit}>
          ✏️ Edit
        </button>
        <button className={styles.btn}>
          {currentPrompt.favourite ? '★' : '☆'} Favourite
        </button>
      </footer>
    </section>
  );
};

export default DetailPanel;
