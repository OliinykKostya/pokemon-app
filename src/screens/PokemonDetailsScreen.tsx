import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import NativeStepTracker from '../../specs/NativeStepTracker';

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

  const [isStepCountingAvailable, setIsStepCountingAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestActivityRecognitionPermission = async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(true);
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Разрешение на отслеживание шагов',
          message: 'Приложению нужно разрешение для подсчета шагов',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('ACTIVITY_RECOGNITION permission granted');
        setHasPermission(true);
        return true;
      } else {
        console.log('ACTIVITY_RECOGNITION permission denied');
        setHasPermission(false);
        Alert.alert(
          'Разрешение не получено',
          'Для работы с датчиком шагов необходимо разрешение на отслеживание активности',
        );
        return false;
      }
    } catch (err) {
      console.warn('Error requesting ACTIVITY_RECOGNITION permission:', err);
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    requestActivityRecognitionPermission();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    const checkAvailability = () => {
      try {
        const available = NativeStepTracker?.isStepTrackingAvailable();
        setIsStepCountingAvailable(!!available);
        console.log('Step tracking available:', available);
      } catch (error) {
        console.error('Error checking step tracking availability:', error);
        setIsStepCountingAvailable(false);
      }
    };

    checkAvailability();
  }, [hasPermission]);

  useEffect(() => {
    if (!isStepCountingAvailable || !hasPermission) return;

    const subscription = NativeStepTracker.onStepUpdated(
      (event: { stepCount: number }) => {
        setStepCount(event.stepCount);
      },
    );

    return () => {
      try {
        subscription.remove();

        if (isTracking) {
          NativeStepTracker.stopStepTracking();
        }
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [isStepCountingAvailable, hasPermission, isTracking]);

  const startStepTracking = async () => {
    if (!hasPermission) {
      const permissionGranted = await requestActivityRecognitionPermission();
      if (!permissionGranted) {
        return;
      }
    }

    try {
      setStepCount(0);
      NativeStepTracker.startStepTracking();
      setIsTracking(true);
    } catch (error) {
      console.error('Error starting step tracking:', error);
    }
  };

  const stopStepTracking = () => {
    try {
      NativeStepTracker.stopStepTracking();
      setIsTracking(false);
    } catch (error) {
      console.error('Error stopping step tracking:', error);
    }
  };

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
            onPress={requestActivityRecognitionPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        )}

        {isStepCountingAvailable && hasPermission && (
          <View style={styles.buttonRow}>
            {!isTracking ? (
              <TouchableOpacity
                style={styles.button}
                onPress={startStepTracking}
              >
                <Text style={styles.buttonText}>Start Tracking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={stopStepTracking}
              >
                <Text style={styles.buttonText}>Stop Tracking</Text>
              </TouchableOpacity>
            )}
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    margin: 10,
    fontSize: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
});
