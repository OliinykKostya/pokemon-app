import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useStepTracker } from '../hooks/useStepTracker';

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
  const { pokemonName } = route.params;

  const {
    isAvailable: isStepCountingAvailable,
    isTracking,
    stepCount,
    hasPermission,
    startTracking,
    stopTracking,
    requestPermission,
    resetStepCount,
  } = useStepTracker();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text>← Back</Text>
        </TouchableOpacity>
        <Text>{pokemonName}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.statusText}>
          Permission granted: {hasPermission ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Step counting available: {isStepCountingAvailable ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.text}>Current step count: {stepCount}</Text>

        {!hasPermission && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        )}

        {isStepCountingAvailable && hasPermission && (
          <View style={styles.buttonRow}>
            {!isTracking ? (
              <TouchableOpacity style={styles.button} onPress={startTracking}>
                <Text style={styles.buttonText}>Start Tracking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={stopTracking}>
                <Text style={styles.buttonText}>Stop Tracking</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetStepCount}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    margin: 10,
    fontSize: 20,
  },
});
