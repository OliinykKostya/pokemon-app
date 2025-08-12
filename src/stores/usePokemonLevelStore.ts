import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { pokemonStorage } from './mmkv';
import { STEPS_PER_LEVEL } from '../constants/pokemon';

interface PokemonLevel {
  id: string;
  level: number;
  stepsToNextLevel: number;
}

interface PokemonLevelState {
  pokemonLevels: PokemonLevel[];
  currentPokemonId: string | null;
}

interface PokemonLevelActions {
  setPokemonLevel: (pokemonLevel: PokemonLevel) => void;
  getPokemonLevel: (id: string) => PokemonLevel | undefined;
  setCurrentPokemonId: (id: string | null) => void;
  calculateProgress: (totalSteps: number) => {
    currentLevel: number;
    stepsToNextLevel: number;
    progressPercentage: number;
  };
  reset: () => void;
}

const initialState: PokemonLevelState = {
  pokemonLevels: [],
  currentPokemonId: null,
};

const mmkvStorage = {
  getItem: (name: string) => {
    try {
      const value = pokemonStorage.getString(name);
      return value || null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      pokemonStorage.set(name, value);
    } catch (error) {
      console.error('Error saving to MMKV:', error);
    }
  },
  removeItem: (name: string) => {
    try {
      pokemonStorage.delete(name);
    } catch (error) {
      console.error('Error removing from MMKV:', error);
    }
  },
};

export const usePokemonLevelStore = create<
  PokemonLevelState & PokemonLevelActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPokemonLevel: pokemonLevel =>
        set(state => {
          const existingIndex = state.pokemonLevels.findIndex(
            p => p.id === pokemonLevel.id,
          );

          let newPokemonLevels: PokemonLevel[];

          if (existingIndex >= 0) {
            newPokemonLevels = [...state.pokemonLevels];
            newPokemonLevels[existingIndex] = pokemonLevel;
          } else {
            newPokemonLevels = [...state.pokemonLevels, pokemonLevel];
          }

          return { pokemonLevels: newPokemonLevels };
        }),

      getPokemonLevel: id => {
        const state = get();
        return state.pokemonLevels.find(pokemon => pokemon.id === id);
      },

      setCurrentPokemonId: id => set({ currentPokemonId: id }),

      calculateProgress: totalSteps => {
        const currentLevel = Math.floor(totalSteps / STEPS_PER_LEVEL) + 1;
        const stepsToNextLevel = totalSteps % STEPS_PER_LEVEL;
        const progressPercentage = Math.min(
          (stepsToNextLevel / STEPS_PER_LEVEL) * 100,
          100,
        );

        return {
          currentLevel,
          stepsToNextLevel,
          progressPercentage,
        };
      },

      reset: () => set(initialState),
    }),
    {
      name: 'pokemon-levels-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
