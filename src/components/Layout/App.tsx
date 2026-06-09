import React, { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { usePrompts } from '@/hooks/usePrompts';
import Layout from '@/components/Layout/Layout';
import styles from './App.module.css';

const App: React.FC = () => {
  const { theme } = useUIStore();
  const { isInitializing } = usePrompts();

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme]);

  if (isInitializing) {
    return (
      <div className={styles.app}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading PromptVault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Layout />
    </div>
  );
};

export default App;
