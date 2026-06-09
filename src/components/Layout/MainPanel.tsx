import React from 'react';
import styles from './MainPanel.module.css';

const MainPanel: React.FC = () => {
  return (
    <section className={styles.mainPanel}>
      <header className={styles.header}>
        <input type="text" className={styles.searchInput} placeholder="Search prompts..." />
        <button className={styles.newBtn}>+ New Prompt</button>
      </header>
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <p>📝 No prompts yet</p>
          <p>Create your first prompt to get started</p>
        </div>
      </div>
    </section>
  );
};

export default MainPanel;
