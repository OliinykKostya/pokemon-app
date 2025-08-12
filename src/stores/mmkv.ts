import { MMKV } from 'react-native-mmkv';

export const pokemonStorage = new MMKV({
  id: 'pokemon-levels-storage',
  // encryptionKey: 'your-encryption-key'
});

export const STORAGE_KEYS = {
  POKEMON_LEVELS: 'pokemon_levels',
  CURRENT_POKEMON_ID: 'current_pokemon_id',
} as const;
