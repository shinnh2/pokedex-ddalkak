import React from 'react';
import styles from './LoadingSpinner.module.scss';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ size = 'md', text }) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.pokeball} ${styles[size]}`}>
        <div className={styles.top} />
        <div className={styles.band} />
        <div className={styles.button} />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
