import React from 'react';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel/MainPanel';
import DetailPanel from './DetailPanel/DetailPanel';
import Toast from '@/components/Common/Toast';
import styles from './App.module.css';

const Layout: React.FC = () => {
  return (
    <>
      <div className={styles.layout}>
        <Sidebar />
        <MainPanel />
        <DetailPanel />
      </div>
      <Toast />
    </>
  );
};

export default Layout;
