import React from 'react';
import styles from './DetailPanel.module.css';

const DetailPanel: React.FC = () => {
  return (
    <section className={styles.detailPanel}>
      <div className={styles.emptyState}>
        <p>👈 Select a prompt to view details</p>
      </div>
    </section>
  );
};

export default DetailPanel;
