import React, { useState, useCallback } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { useUIStore } from '@/store/uiStore';
import type { CreatePromptInput } from '@/types/prompt';
import { promptSchema } from '@/utils/validators';
import styles from './CreatePromptModal.module.css';

interface CreatePromptModalProps {
  categoryId: string;
  onClose: () => void;
}

const CreatePromptModal: React.FC<CreatePromptModalProps> = ({ categoryId, onClose }) => {
  const { createPrompt, isLoading } = usePrompts();
  const { showToast } = useUIStore();
  const [formData, setFormData] = useState<CreatePromptInput>({
    title: '',
    body: '',
    description: '',
    categoryId,
    model: 'gpt-4',
    useCase: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      try {
        promptSchema.parse({
          title: formData.title,
          body: formData.body,
          description: formData.description,
          categoryId: formData.categoryId,
          model: formData.model,
          useCase: formData.useCase,
          notes: formData.notes,
        });
      } catch (error: any) {
        const newErrors: Record<string, string> = {};
        if (error.errors) {
          error.errors.forEach((err: any) => {
            if (err.path) {
              newErrors[err.path[0]] = err.message;
            }
          });
        }
        setErrors(newErrors);
        return;
      }

      // Submit
      try {
        await createPrompt(formData);
        showToast('Prompt created successfully!', 'success');
        onClose();
      } catch (error) {
        showToast('Failed to create prompt', 'error');
      }
    },
    [formData, createPrompt, showToast, onClose]
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Create New Prompt</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., React Component Template"
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="body">Prompt Body *</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Enter your prompt text here..."
              rows={8}
              className={errors.body ? styles.inputError : ''}
            />
            {errors.body && <span className={styles.error}>{errors.body}</span>}
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="model">Model</label>
              <select id="model" name="model" value={formData.model} onChange={handleChange}>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoryId">Category *</label>
              <input
                id="categoryId"
                type="text"
                name="categoryId"
                value={formData.categoryId}
                disabled
                className={styles.disabledInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="useCase">Use Case</label>
            <input
              id="useCase"
              type="text"
              name="useCase"
              value={formData.useCase}
              onChange={handleChange}
              placeholder="What is this prompt for?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description..."
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Personal notes..."
              rows={3}
            />
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Prompt'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreatePromptModal;
