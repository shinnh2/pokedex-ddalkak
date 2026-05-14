import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemon';
import { TypeBadge } from '../components/TypeBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatPokemonId, TYPE_COLORS } from '../utils/pokemon';
import styles from './PokemonDetailPage.module.scss';

const STAT_MAX = 255;

const GEN_LABELS: Record<number, string> = {
  1: '1세대 (관동)', 2: '2세대 (성도)', 3: '3세대 (호연)',
  4: '4세대 (신오)', 5: '5세대 (하나)', 6: '6세대 (칼로스)',
  7: '7세대 (알로라)', 8: '8세대 (가라르)', 9: '9세대 (팔데아)'
};

export const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = id ? parseInt(id) : null;
  const { data, loading, error } = usePokemonDetail(pokemonId);
  const [showBack, setShowBack] = useState(false);

  if (loading) return (
    <div className={styles.centered}>
      <LoadingSpinner size="lg" text="불러오는 중..." />
    </div>
  );

  if (error || !data) return (
    <div className={styles.centered}>
      <p className={styles.error}>포켓몬을 불러올 수 없습니다</p>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← 돌아가기</button>
    </div>
  );

  const primaryType = data.types[0];
  const accentColor = TYPE_COLORS[primaryType] ?? '#888';
  const currentSprite = showBack && data.spriteBack ? data.spriteBack : data.sprite;

  return (
    <div className={styles.page}>
      {/* Back navigation */}
      <button className={styles.backNav} onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      {/* Sibling navigation */}
      <div className={styles.siblingNav}>
        {pokemonId && pokemonId > 1 && (
          <button
            className={styles.siblingBtn}
            onClick={() => navigate(`/pokemon/${pokemonId - 1}`)}
          >
            ← #{String(pokemonId - 1).padStart(4, '0')}
          </button>
        )}
        {pokemonId && pokemonId < 1025 && (
          <button
            className={styles.siblingBtn}
            onClick={() => navigate(`/pokemon/${pokemonId + 1}`)}
            style={{ marginLeft: 'auto' }}
          >
            #{String(pokemonId + 1).padStart(4, '0')} →
          </button>
        )}
      </div>

      {/* Hero sprite section */}
      <div
        className={styles.hero}
        style={{ '--accent': accentColor } as React.CSSProperties}
      >
        <div className={styles.heroGlow} />
        <div className={styles.heroBg} />

        <button
          className={styles.spriteToggle}
          onClick={() => setShowBack(b => !b)}
          title="앞면/뒷면 전환"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M216-192v-72h74q-45-40-71.5-95.5T192-480q0-101 61-177.5T408-758v75q-63 23-103.5 77.5T264-480q0 48 19.5 89t52.5 70v-63h72v192H216Zm336-10v-75q63-23 103.5-77.5T696-480q0-48-19.5-89T624-639v63h-72v-192h192v72h-74q45 40 71.5 95.5T768-480q0 101-61 177.5T552-202Z"/></svg>
        </button>

        {currentSprite ? (
          <img
            src={currentSprite}
            alt={data.nameKo}
            className={`${styles.sprite} pixel-img`}
          />
        ) : (
          <div className={styles.noSprite}>?</div>
        )}

        <div className={styles.idBadge}>{formatPokemonId(data.id)}</div>
      </div>

      {/* Info section */}
      <div className={styles.infoSection}>
        {/* Name & types */}
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{data.nameKo || data.name}</h1>
          <div className={styles.types}>
            {data.types.map(t => <TypeBadge key={t} type={t} size="lg" />)}
          </div>
        </div>

        {/* Generation */}
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>세대</span>
          <span className={styles.metaValue}>{GEN_LABELS[data.generation] ?? `${data.generation}세대`}</span>
        </div>

        {/* Physical */}
        <div className={styles.physicalRow}>
          <div className={styles.physicalCard}>
            <span className={styles.physicalLabel}>키</span>
            <span className={styles.physicalValue}>{(data.height / 10).toFixed(1)}m</span>
          </div>
          <div className={styles.physicalCard}>
            <span className={styles.physicalLabel}>몸무게</span>
            <span className={styles.physicalValue}>{(data.weight / 10).toFixed(1)}kg</span>
          </div>
        </div>

        {/* Dex Description */}
        <div className={styles.descCard}>
          <h2 className={styles.sectionTitle}>도감 설명</h2>
          <p className={styles.description}>{data.description}</p>
        </div>

        {/* Stats */}
        <div className={styles.statsCard}>
          <h2 className={styles.sectionTitle}>기본 스탯</h2>
          <div className={styles.statsList}>
            {data.stats.map(s => (
              <div key={s.name} className={styles.statRow}>
                <span className={styles.statName}>{s.name}</span>
                <span className={styles.statValue}>{s.value}</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${(s.value / STAT_MAX) * 100}%`,
                      backgroundColor: accentColor
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses / Strategy */}
        <div className={styles.weaknessCard}>
          <h2 className={styles.sectionTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160ZM334-583l24-23 23-24-23 24-24 23Zm-56 57L80-724v-160h160l198 198-57 56-174-174h-47v47l174 174-56 57Zm92 199 430-430v-47h-47L323-374l47 47Zm0 0-24-23-23-24 23 24 24 23Z"/></svg>
            추천 공략 타입
            <span className={styles.sectionSubtitle}>이 타입으로 공격하면 효과적!</span>
          </h2>
          {data.weaknesses.length === 0 ? (
            <p className={styles.noWeakness}>약점이 없습니다</p>
          ) : (
            <div className={styles.weaknessList}>
              {data.weaknesses.map(t => (
                <div
                  key={t}
                  className={styles.weaknessItem}
                  style={{ '--type-color': TYPE_COLORS[t] } as React.CSSProperties}
                >
                  <div
                    className={styles.weaknessDot}
                    style={{ backgroundColor: TYPE_COLORS[t] }}
                  />
                  <TypeBadge type={t} size="md" />
                  <span className={styles.weaknessMult}>×2</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
