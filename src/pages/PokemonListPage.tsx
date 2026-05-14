import React, { useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Toast } from '../components/Toast';
import { GENERATION_RANGES, ALL_TYPES, TYPE_NAMES_KO } from '../utils/pokemon';
import styles from './PokemonListPage.module.scss';

export const PokemonListPage: React.FC = () => {
  const [generation, setGeneration] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const { items, loading, hasMore, loadMore, showToast } = usePokemonList(generation, typeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>세대</label>
          <select
            className={styles.select}
            value={generation}
            onChange={e => setGeneration(Number(e.target.value))}
          >
            {Object.entries(GENERATION_RANGES).map(([gen, { name }]) => (
              <option key={gen} value={gen}>{name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>타입</label>
          <select
            className={styles.select}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">전체</option>
            {ALL_TYPES.map(t => (
              <option key={t} value={t}>{TYPE_NAMES_KO[t]}</option>
            ))}
          </select>
        </div>

        {/* <div className={styles.countBadge}>
          {items.length}마리
        </div> */}
      </div>

      {loading && items.length === 0 ? (
        <div className={styles.initialLoading}>
          <LoadingSpinner size="lg" text="불러오는 중..." />
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <span>😶</span>
          <p>해당 조건의 포켓몬이 없습니다</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.loadMoreArea}>
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <button
              className={styles.loadMoreBtn}
              onClick={loadMore}
            >
              {hasMore ? '더보기 ▼' : '전부 불러왔어요 ✓'}
            </button>
          )}
        </div>
      )}

      <Toast message="더 이상 불러올 데이터가 없습니다" visible={showToast} />
    </div>
  );
};
