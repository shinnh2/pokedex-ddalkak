import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonListItem } from '../utils/types';
import { TypeBadge } from './TypeBadge';
import { formatPokemonId, TYPE_COLORS } from '../utils/pokemon';
import styles from './PokemonCard.module.scss';

interface Props {
  pokemon: PokemonListItem;
}

export const PokemonCard: React.FC<Props> = ({ pokemon }) => {
  const navigate = useNavigate();
  const primaryType = pokemon.types[0];
  const accentColor = TYPE_COLORS[primaryType] ?? '#888';

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      <div className={styles.spriteWrapper}>
        <div className={styles.spriteBg} />
        {pokemon.sprite ? (
          <img
            src={pokemon.sprite}
            alt={pokemon.nameKo}
            className={`${styles.sprite} pixel-img`}
            loading="lazy"
          />
        ) : (
          <div className={styles.noSprite}>?</div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.id}>{formatPokemonId(pokemon.id)}</span>
        <h3 className={styles.name}>{pokemon.nameKo || pokemon.name}</h3>
        <div className={styles.types}>
          {pokemon.types.map(t => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
};
