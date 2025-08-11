import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useStepTracker } from '../hooks/useStepTracker';
import { PokemonCard } from '../components/PokemonCard';

type PokemonDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PokemonDetails'
>;

type PokemonDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'PokemonDetails'
>;

const STEPS_PER_LEVEL = 100;

export const PokemonDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PokemonDetailsScreenNavigationProp>();
  const route = useRoute<PokemonDetailsScreenRouteProp>();
  const { pokemonName, pokemonType, pokemonImage } = route.params;

  const [totalSteps, setTotalSteps] = useState(0);
  const [isPoweringUp, setIsPoweringUp] = useState(false);

  const currentLevel = Math.floor(totalSteps / STEPS_PER_LEVEL) + 1;

  const stepsToNextLevel = totalSteps % STEPS_PER_LEVEL;

  const progressPercentage = Math.min(
    (stepsToNextLevel / STEPS_PER_LEVEL) * 100,
    100,
  );

  const {
    stepCount,
    hasPermission,
    startTracking,
    stopTracking,
    requestPermission,
  } = useStepTracker();

  const stableStopTracking = useCallback(stopTracking, [stopTracking]);

  const buttonScaleRef = useRef(new Animated.Value(1));

  const handleButtonPressIn = () => {
    Animated.timing(buttonScaleRef.current, {
      toValue: 0.6,
      duration: 20,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.timing(buttonScaleRef.current, {
      toValue: 1.2,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setTotalSteps(prev => {
      if (stepCount < prev) {
        return prev + stepCount;
      } else {
        const newTotalSteps = stepCount - prev;

        return prev + newTotalSteps;
      }
    });
  }, [stepCount]);

  const handlePowerUp = async () => {
    if (isPoweringUp) {
      setIsPoweringUp(false);
      stableStopTracking();
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

  useEffect(() => {
    return () => {
      if (isPoweringUp) {
        stableStopTracking();
        setIsPoweringUp(false);
      }
    };
  }, [stableStopTracking, isPoweringUp]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
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
          buttonScale={buttonScaleRef.current}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
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
