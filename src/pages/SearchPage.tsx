import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/usePokemon';
import { TypeBadge } from '../components/TypeBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatPokemonId } from '../utils/pokemon';
import styles from './SearchPage.module.scss';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { query, setQuery, results, loading, search } = useSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setHasSearched(true);
    search(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setHasSearched(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.pokeball} aria-hidden="true">
          <div className={styles.pokeballTop} />
          <div className={styles.pokeballBand} />
          <div className={styles.pokeballButton} />
        </div>

        <h1 className={styles.title}>
          <img src="https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png" alt="포켓몬 로고"/>
          <span className={styles.titleLine3}>포켓몬 아줌마가 딸깍으로 만든</span>
          <span className={styles.titleLine1}>pokemon ddalkak</span>
          <span className={styles.titleLine2}>Pokedex</span>
        </h1>
        <p className={styles.subtitle}>이름 또는 도감 번호로 검색하세요</p>

        <div className={styles.searchBar}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="예: 피카츄, 이상해씨, 25"
            className={styles.input}
            autoFocus
          />
          <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>
            {loading ? 
              '...' 
              : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"/></svg>)
            }
          </button>
        </div>

        <div className={styles.quickLinks}>
          {['피카츄', '리자몽', '뮤츠', '이브이'].map(name => (
            <button
              key={name}
              className={styles.quickTag}
              onClick={() => { setQuery(name); setHasSearched(true); search(name); }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.loadingArea}>
          <LoadingSpinner text="검색 중..." />
        </div>
      )}

      {hasSearched && !loading && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>😶</span>
              <p>검색 결과가 없습니다</p>
              <p className={styles.noResultsHint}>도감번호나 포켓몬 이름을 정확히 입력해주세요!</p>
            </div>
          ) : (
            <>
              <h2 className={styles.resultsTitle}>
                검색 결과 <span>{results.length}마리</span>
              </h2>
              <ul className={styles.resultList}>
                {results.map(p => (
                  <li
                    key={p.id}
                    className={styles.resultItem}
                    onClick={() => navigate(`/pokemon/${p.id}`)}
                  >
                    <div className={styles.resultSprite}>
                      {p.sprite && (
                        <img
                          src={p.sprite}
                          alt={p.nameKo}
                          className="pixel-img"
                        />
                      )}
                    </div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultId}>{formatPokemonId(p.id)}</span>
                      <strong className={styles.resultName}>{p.nameKo || p.name}</strong>
                    </div>
                    <div className={styles.resultTypes}>
                      {p.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                    </div>
                    <span className={styles.resultArrow}>→</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* {!hasSearched && (
        <div className={styles.hint}>
          <div className={styles.hintGrid}>
            <div className={styles.hintCard}>
              <span className={styles.hintIcon}>🔢</span>
              <h3>번호 검색</h3>
              <p>도감 번호 (예: 25, 001)를 입력하세요</p>
            </div>
            <div className={styles.hintCard}>
              <span className={styles.hintIcon}>🇰🇷</span>
              <h3>이름 검색</h3>
              <p>한글 이름으로 검색하세요 (1~3세대)</p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
