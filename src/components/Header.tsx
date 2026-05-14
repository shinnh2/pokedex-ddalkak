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
          <div className={styles.logoIcon}>
            <img src="data:image/png;base64,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" alt="포켓볼"/>
          </div>
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
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
};
