import { RawPokemon, RawPokemonSpecies, PokemonDetail, PokemonListItem } from './types';
import { calculateWeaknesses, getGeneration } from './pokemon';
import koreanNames from './koreanNames.json';

const KO_NAMES = koreanNames as Record<string, string>;
const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map<string, unknown>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export async function fetchPokemon(idOrName: string | number): Promise<RawPokemon> {
  return fetchWithCache<RawPokemon>(`${BASE_URL}/pokemon/${idOrName}`);
}

export async function fetchPokemonSpecies(idOrName: string | number): Promise<RawPokemonSpecies> {
  return fetchWithCache<RawPokemonSpecies>(`${BASE_URL}/pokemon-species/${idOrName}`);
}

export function extractKoreanDescription(species: RawPokemonSpecies): string {
  const entry = species.flavor_text_entries.find(e => e.language.name === 'ko');
  if (!entry) return '설명 없음';
  return entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}

// 목록용: species API 호출 없이 JSON에서 한글 이름 즉시 조회
export async function getPokemonListItem(id: number): Promise<PokemonListItem> {
  const raw = await fetchPokemon(id);
  return {
    id: raw.id,
    name: raw.name,
    nameKo: KO_NAMES[String(id)] ?? '',
    types: raw.types.map(t => t.type.name),
    sprite: raw.sprites.front_default
  };
}

// 상세용: 도감 설명은 species API 필요
export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  const [raw, species] = await Promise.all([
    fetchPokemon(id),
    fetchPokemonSpecies(id)
  ]);

  const types = raw.types.map(t => t.type.name);
  const weaknesses = calculateWeaknesses(types);
  const generation = getGeneration(id);

  const STAT_NAMES: Record<string, string> = {
    'hp': 'HP', 'attack': '공격', 'defense': '방어',
    'special-attack': '특수공격', 'special-defense': '특수방어', 'speed': '스피드'
  };

  return {
    id: raw.id,
    name: raw.name,
    nameKo: KO_NAMES[String(id)] ?? '',
    types,
    sprite: raw.sprites.front_default,
    spriteBack: raw.sprites.back_default,
    generation,
    description: extractKoreanDescription(species),
    weaknesses,
    height: raw.height,
    weight: raw.weight,
    stats: raw.stats.map(s => ({
      name: STAT_NAMES[s.stat.name] ?? s.stat.name,
      value: s.base_stat
    }))
  };
}

export async function getPokemonByType(typeName: string): Promise<number[]> {
  const data = await fetchWithCache<{ pokemon: { pokemon: { name: string; url: string } }[] }>(
    `${BASE_URL}/type/${typeName}`
  );
  return data.pokemon
    .map(p => {
      const parts = p.pokemon.url.split('/');
      return parseInt(parts[parts.length - 2]);
    })
    .filter(id => id <= 1025 && id > 0);
}