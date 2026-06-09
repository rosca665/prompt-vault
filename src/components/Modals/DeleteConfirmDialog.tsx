import React, { useState } from 'react';
import styles from './DeleteConfirmDialog.module.css';

interface DeleteConfirmDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  title,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h3>Delete Prompt?</h3>
          <p>
            Are you sure you want to delete <strong>{title}</strong>? You can restore it later from
            the trash.
          </p>
        </div>
        <footer className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
