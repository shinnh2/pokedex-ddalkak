import React from 'react';
import styles from './Toast.module.scss';

interface Props {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<Props> = ({ message, visible }) => {
  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
      <span className={styles.icon}>⚠</span>
      {message}
    </div>
  );
};
