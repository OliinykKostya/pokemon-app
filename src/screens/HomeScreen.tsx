import React from 'react';
import { usePokemonApi } from '../hooks/usePokemonApi';
import { PokemonList } from '../components/PokemonList';

export const HomeScreen: React.FC = () => {
  const { pokemons, loading, error, hasMore, loadMore, refresh } =
    usePokemonApi();

  return (
    <PokemonList
      pokemons={pokemons}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onRefresh={refresh}
    />
  );
};
