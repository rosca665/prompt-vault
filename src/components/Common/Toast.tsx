import React, { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import styles from './Toast.module.css';

const Toast: React.FC = () => {
  const { toastMessage, toastType, clearToast } = useUIStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(clearToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className={`${styles.toast} ${styles[toastType]}`}>
      <p>{toastMessage}</p>
    </div>
  );
};

export default Toast;
