import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useButtonAnimation } from '../hooks/useButtonAnimation';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useStepTracker } from '../hooks/useStepTracker';
import { PokemonCard } from '../components/PokemonCard';
import { usePokemonLevelStore } from '../stores';
import { STEPS_PER_LEVEL } from '../constants/pokemon';

type PokemonDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PokemonDetails'
>;

type PokemonDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'PokemonDetails'
>;

export const PokemonDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PokemonDetailsScreenNavigationProp>();
  const route = useRoute<PokemonDetailsScreenRouteProp>();
  const { pokemonName, pokemonType, pokemonImage } = route.params;

  const [isPoweringUp, setIsPoweringUp] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);
  const countRef = useRef(0);

  const {
    getPokemonLevel,
    setPokemonLevel,
    setCurrentPokemonId,
    calculateProgress,
  } = usePokemonLevelStore();

  const {
    stepCount,
    hasPermission,
    startTracking,
    stopTracking,
    requestPermission,
  } = useStepTracker();

  const { buttonScale, handlePressIn, handlePressOut } = useButtonAnimation();

  const stableStopTracking = useCallback(stopTracking, [stopTracking]);

  const handlePowerUp = async () => {
    if (isPoweringUp) {
      setIsPoweringUp(false);
      stableStopTracking();

      if (totalSteps > 0) {
        const progress = calculateProgress(totalSteps);
        const pokemonData = {
          id: pokemonName,
          level: progress.currentLevel,
          stepsToNextLevel: progress.stepsToNextLevel,
        };
        setPokemonLevel(pokemonData);
      }
      return;
    }

    if (!hasPermission) {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        return;
      }
    }

    setIsPoweringUp(true);
    startTracking();
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setCurrentPokemonId(pokemonName);

    const savedPokemon = getPokemonLevel(pokemonName);
    if (savedPokemon) {
      const savedTotalSteps =
        (savedPokemon.level - 1) * STEPS_PER_LEVEL +
        savedPokemon.stepsToNextLevel;
      setTotalSteps(savedTotalSteps);
    }
  }, [pokemonName, getPokemonLevel, setCurrentPokemonId]);

  useEffect(() => {
    if (stepCount > 0 && isPoweringUp) {
      setTotalSteps(prev => {
        if (stepCount < prev) {
          countRef.current = prev + stepCount;
          return prev + stepCount;
        } else {
          const newTotalSteps = stepCount - prev;
          countRef.current = prev + newTotalSteps;
          return prev + newTotalSteps;
        }
      });
    }
  }, [stepCount, isPoweringUp]);

  useEffect(() => {
    return () => {
      stableStopTracking();
      setIsPoweringUp(false);

      if (countRef.current > 0) {
        const progress = calculateProgress(countRef.current);
        const pokemonData = {
          id: pokemonName,
          level: progress.currentLevel,
          stepsToNextLevel: progress.stepsToNextLevel,
        };
        setPokemonLevel(pokemonData);
      }
    };
  }, [
    stableStopTracking,
    setIsPoweringUp,
    calculateProgress,
    pokemonName,
    setPokemonLevel,
  ]);

  const progress = calculateProgress(totalSteps);
  const currentLevel = progress.currentLevel;
  const stepsToNextLevel = progress.stepsToNextLevel;
  const progressPercentage = progress.progressPercentage;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <PokemonCard
          pokemonName={pokemonName}
          pokemonType={pokemonType}
          pokemonLvl={currentLevel}
          imagePokemon={pokemonImage}
          onPowerUp={handlePowerUp}
          isPoweringUp={isPoweringUp}
          currentSteps={stepsToNextLevel}
          stepsToNextLevel={STEPS_PER_LEVEL}
          progressPercentage={progressPercentage}
          buttonScale={buttonScale}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
