// Pokemon type definitions and damage relations

export const TYPE_NAMES_KO: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', electric: '전기',
  grass: '풀', ice: '얼음', fighting: '격투', poison: '독',
  ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레',
  rock: '바위', ghost: '고스트', dragon: '드래곤', dark: '악',
  steel: '강철', fairy: '페어리'
};

export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
};

// Damage relations: type -> types it's super effective against (2x damage TO this type)
// This maps: if pokemon is TYPE, what attacker types deal 2x damage
export const TYPE_WEAKNESSES: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel']
};

export const TYPE_IMMUNITIES: Record<string, string[]> = {
  normal: ['ghost'],
  flying: ['ground'],
  ghost: ['normal', 'fighting'],
  ground: ['electric'],
  dark: ['psychic'],
  steel: ['poison'],
  fairy: ['dragon']
};

export const TYPE_RESISTANCES: Record<string, string[]> = {
  normal: [],
  fire: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
  water: ['fire', 'water', 'ice', 'steel'],
  electric: ['electric', 'flying', 'steel'],
  grass: ['water', 'electric', 'grass', 'ground'],
  ice: ['ice'],
  fighting: ['bug', 'rock', 'dark'],
  poison: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
  ground: ['poison', 'rock'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'psychic'],
  bug: ['grass', 'fighting', 'ground'],
  rock: ['normal', 'fire', 'poison', 'flying'],
  ghost: ['poison', 'bug'],
  dragon: ['fire', 'water', 'electric', 'grass'],
  dark: ['ghost', 'dark'],
  steel: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
  fairy: ['fighting', 'bug', 'dark']
};

export function calculateWeaknesses(types: string[]): string[] {
  const damageMultiplier: Record<string, number> = {};

  const allTypes = Object.keys(TYPE_WEAKNESSES);

  for (const attackType of allTypes) {
    let multiplier = 1;

    for (const defType of types) {
      if (TYPE_IMMUNITIES[defType]?.includes(attackType)) {
        multiplier *= 0;
      } else if (TYPE_WEAKNESSES[defType]?.includes(attackType)) {
        multiplier *= 2;
      } else if (TYPE_RESISTANCES[defType]?.includes(attackType)) {
        multiplier *= 0.5;
      }
    }

    if (multiplier > 0) {
      damageMultiplier[attackType] = multiplier;
    }
  }

  return allTypes.filter(t => (damageMultiplier[t] || 1) >= 2);
}

export const GENERATION_RANGES: Record<number, { start: number; end: number; name: string }> = {
  1: { start: 1, end: 151, name: '1세대 (관동)' },
  2: { start: 152, end: 251, name: '2세대 (성도)' },
  3: { start: 252, end: 386, name: '3세대 (호연)' },
  4: { start: 387, end: 493, name: '4세대 (신오)' },
  5: { start: 494, end: 649, name: '5세대 (하나)' },
  6: { start: 650, end: 721, name: '6세대 (칼로스)' },
  7: { start: 722, end: 809, name: '7세대 (알로라)' },
  8: { start: 810, end: 905, name: '8세대 (가라르)' },
  9: { start: 906, end: 1025, name: '9세대 (팔데아)' }
};

export function getGeneration(id: number): number {
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (id >= range.start && id <= range.end) return Number(gen);
  }
  return 1;
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export const ALL_TYPES = Object.keys(TYPE_NAMES_KO);
