import React, { useCallback } from 'react';
import type { Prompt } from '@/types/prompt';
import { formatRelativeDate } from '@/utils/formatters';
import { wordCount } from '@/utils/wordCount';
import styles from './PromptCard.module.css';

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(prompt.id);
  }, [prompt.id, onSelect]);

  const words = wordCount(prompt.body);
  const truncatedBody = prompt.body.substring(0, 120) + (prompt.body.length > 120 ? '...' : '');

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <h3 className={styles.title}>{prompt.title}</h3>
        {prompt.favourite && <span className={styles.favourite}>★</span>}
      </div>

      <p className={styles.body}>{truncatedBody}</p>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>{words} words</span>
          {prompt.model && <span className={styles.metaItem}>{prompt.model}</span>}
          {prompt.rating > 0 && (
            <span className={styles.metaItem}>{'★'.repeat(prompt.rating)}</span>
          )}
        </div>
        <span className={styles.date}>{formatRelativeDate(prompt.createdAt)}</span>
      </div>
    </div>
  );
};

export default PromptCard;
