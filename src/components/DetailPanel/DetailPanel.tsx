import React, { useState } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { useUIStore } from '@/store/uiStore';
import type { Prompt } from '@/types/prompt';
import { formatDatetime, wordCount, charCount, estimatePromptTokens } from '@/utils';
import CreatePromptModal from '../Modals/CreatePromptModal';
import EditPromptModal from '../Modals/EditPromptModal';
import DeleteConfirmDialog from '../Modals/DeleteConfirmDialog';
import styles from './DetailPanel.module.css';

const DetailPanel: React.FC = () => {
  const { currentPrompt, updatePrompt: storeUpdatePrompt } = usePrompts();
  const { showToast } = useUIStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deletePrompt, isLoading } = usePrompts();

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

  const handleFavourite = async () => {
    try {
      await storeUpdatePrompt(currentPrompt.id, { favourite: !currentPrompt.favourite });
      showToast(
        currentPrompt.favourite ? 'Removed from favourites' : 'Added to favourites',
        'success'
      );
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePrompt(currentPrompt.id);
      setShowDeleteDialog(false);
      showToast('Prompt deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    }
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
        <button className={styles.btn} onClick={handleCopy} title="Copy prompt">
          📋 Copy
        </button>
        <button className={styles.btn} onClick={() => setShowEditModal(true)} title="Edit prompt">
          ✏️ Edit
        </button>
        <button
          className={`${styles.btn} ${currentPrompt.favourite ? styles.active : ''}`}
          onClick={handleFavourite}
          title={currentPrompt.favourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {currentPrompt.favourite ? '★' : '☆'} Fav
        </button>
        <button
          className={`${styles.btn} ${styles.danger}`}
          onClick={() => setShowDeleteDialog(true)}
          title="Delete prompt"
        >
          🗑️ Delete
        </button>
      </footer>

      {/* Modals */}
      {showEditModal && (
        <EditPromptModal prompt={currentPrompt} onClose={() => setShowEditModal(false)} />
      )}

      {showDeleteDialog && (
        <DeleteConfirmDialog
          title={currentPrompt.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};

export default DetailPanel;
