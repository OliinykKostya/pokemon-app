import { useState, useEffect, useCallback } from 'react';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface UsePokemonApiReturn {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_PER_PAGE = 20;

export const usePokemonApi = (): UsePokemonApiReturn => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemonDetails = async (pokemonUrl: string): Promise<Pokemon> => {
    try {
      const response = await fetch(pokemonUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other['official-artwork'].front_default ||
          data.sprites.front_default,
        types: data.types.map((type: any) => type.type.name),
      };
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
      throw error;
    }
  };

  const fetchPokemons = useCallback(
    async (url?: string, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          url || `${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_PER_PAGE}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PokemonListResponse = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(pokemon => fetchPokemonDetails(pokemon.url)),
        );

        if (append) {
          setPokemons(prev => [...prev, ...pokemonDetails]);
        } else {
          setPokemons(pokemonDetails);
        }

        setNextUrl(data.next);
        setHasMore(!!data.next);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadMore = useCallback(() => {
    if (nextUrl && !loading && hasMore) {
      fetchPokemons(nextUrl, true);
    }
  }, [nextUrl, loading, hasMore, fetchPokemons]);

  const refresh = useCallback(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  return {
    pokemons,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
