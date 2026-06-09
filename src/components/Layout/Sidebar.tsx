import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>PromptVault</h1>
      </div>
      <nav className={styles.nav}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Navigation</h2>
          <ul className={styles.list}>
            <li>Categories</li>
            <li>Tags</li>
            <li>Collections</li>
            <li>Favourites</li>
            <li>Recent</li>
          </ul>
        </div>
      </nav>
      <footer className={styles.footer}>
        <button className={styles.settingsBtn}>⚙ Settings</button>
      </footer>
    </aside>
  );
};

export default Sidebar;
