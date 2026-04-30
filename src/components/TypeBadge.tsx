import React from 'react';
import { TYPE_NAMES_KO, TYPE_COLORS } from '../utils/pokemon';
import styles from './TypeBadge.module.scss';

interface Props {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TypeBadge: React.FC<Props> = ({ type, size = 'md' }) => {
  const color = TYPE_COLORS[type] ?? '#888';
  const label = TYPE_NAMES_KO[type] ?? type;

  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
};
