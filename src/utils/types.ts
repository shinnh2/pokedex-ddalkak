export interface PokemonListItem {
  id: number;
  name: string;
  nameKo: string;
  types: string[];
  sprite: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  nameKo: string;
  types: string[];
  sprite: string;
  spriteBack?: string;
  generation: number;
  description: string;
  weaknesses: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

export interface RawPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      'official-artwork': { front_default: string };
    };
  };
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
}

export interface RawPokemonSpecies {
  names: { name: string; language: { name: string } }[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  generation: { name: string };
}
