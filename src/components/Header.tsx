import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⊙</span>
          <span className={styles.logoText}>포켓몬도감</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            검색
          </Link>
          <Link
            to="/list"
            className={`${styles.navLink} ${location.pathname === '/list' ? styles.active : ''}`}
          >
            도감
          </Link>
        </nav>

        <button
          className={styles.themeBtn}
          onClick={() => setDark(d => !d)}
          aria-label="테마 전환"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
