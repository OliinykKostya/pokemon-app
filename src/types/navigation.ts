export type RootStackParamList = {
  Home: undefined;
  PokemonDetails: {
    pokemonName: string;
    pokemonImage: string;
    pokemonType: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
