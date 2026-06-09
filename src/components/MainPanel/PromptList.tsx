import React from 'react';
import type { Prompt } from '@/types/prompt';
import PromptCard from './PromptCard';
import styles from './PromptList.module.css';

interface PromptListProps {
  prompts: Prompt[];
  onSelectPrompt: (id: string) => void;
}

const PromptList: React.FC<PromptListProps> = ({ prompts, onSelectPrompt }) => {
  return (
    <div className={styles.list}>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onSelect={onSelectPrompt} />
      ))}
    </div>
  );
};

export default PromptList;
