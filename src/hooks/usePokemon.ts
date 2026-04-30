import { useState, useEffect, useCallback, useRef } from 'react';
import { PokemonDetail, PokemonListItem } from '../utils/types';
import { getPokemonDetail, getPokemonListItem, getPokemonByType } from '../utils/api';
import { GENERATION_RANGES } from '../utils/pokemon';
import koreanNames from '../utils/koreanNames.json';

const KO_NAMES = koreanNames as Record<string, string>;

// Hook for fetching pokemon detail
export function usePokemonDetail(id: number | null) {
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPokemonDetail(id)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// Hook for paginated pokemon list
export function usePokemonList(generation: number, typeFilter: string) {
  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const PAGE_SIZE = 12;
  const idListRef = useRef<number[]>([]);

  useEffect(() => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
    idListRef.current = [];

    const buildList = async () => {
      setLoading(true);
      let ids: number[] = [];

      const genRange = GENERATION_RANGES[generation];
      const genIds = Array.from(
        { length: genRange.end - genRange.start + 1 },
        (_, i) => i + genRange.start
      );

      if (typeFilter && typeFilter !== 'all') {
        const typeIds = await getPokemonByType(typeFilter);
        const typeIdSet = new Set(typeIds);
        ids = genIds.filter(id => typeIdSet.has(id));
      } else {
        ids = genIds;
      }

      idListRef.current = ids;

      const firstPage = ids.slice(0, PAGE_SIZE);
      const results = await Promise.allSettled(firstPage.map(id => getPokemonListItem(id)));
      const loaded = results
        .filter((r): r is PromiseFulfilledResult<PokemonListItem> => r.status === 'fulfilled')
        .map(r => r.value);

      setItems(loaded);
      setOffset(PAGE_SIZE);
      setHasMore(ids.length > PAGE_SIZE);
      setLoading(false);
    };

    buildList().catch(console.error);
  }, [generation, typeFilter]);

  const loadMore = useCallback(async () => {
    const ids = idListRef.current;
    if (offset >= ids.length) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setHasMore(false);
      return;
    }

    setLoading(true);
    const nextPage = ids.slice(offset, offset + PAGE_SIZE);
    const results = await Promise.allSettled(nextPage.map(id => getPokemonListItem(id)));
    const loaded = results
      .filter((r): r is PromiseFulfilledResult<PokemonListItem> => r.status === 'fulfilled')
      .map(r => r.value);

    setItems(prev => [...prev, ...loaded]);
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    if (newOffset >= ids.length) setHasMore(false);
    setLoading(false);
  }, [offset]);

  return { items, loading, hasMore, loadMore, showToast };
}

// Hook for search — uses local JSON index for instant full-dex Korean name matching
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) { setResults([]); return; }
    setLoading(true);

    try {
      const isNumber = /^\d+$/.test(q);
      let matchedIds: number[] = [];

      if (isNumber) {
        const id = parseInt(q);
        if (id >= 1 && id <= 1025) matchedIds = [id];
      } else {
        // Instant lookup from bundled JSON — covers all 1025 Pokémon
        const lower = q.toLowerCase();
        matchedIds = Object.entries(KO_NAMES)
          .filter(([, nameKo]) =>
            nameKo.includes(q) || nameKo.toLowerCase().includes(lower)
          )
          .map(([id]) => parseInt(id))
          .slice(0, 20);
      }

      // Fetch sprites + types for matched IDs in parallel
      const settled = await Promise.allSettled(matchedIds.map(id => getPokemonListItem(id)));
      const found = settled
        .filter((r): r is PromiseFulfilledResult<PokemonListItem> => r.status === 'fulfilled')
        .map(r => r.value);

      setResults(found);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, setQuery, results, loading, search };
}