export type RootStackParamList = {
  Home: undefined;
  PokemonDetails: {
    pokemonId: string;
    pokemonName: string;
    pokemonImage: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
