import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

type PokemonDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PokemonDetails'
>;

type PokemonDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'PokemonDetails'
>;

const PokemonCard: React.FC<{
  pokemonName: string;
  pokemonType: string;
  pokemonLvl: number;
  imagePokemon: string;
}> = ({
  pokemonName = '',
  pokemonType = '',
  pokemonLvl = 0,
  imagePokemon = '',
}) => {
  return (
    <View style={styles.pokemonCard}>
      <Image
        source={{ uri: imagePokemon }}
        style={styles.pokemonImage}
        resizeMode="contain"
      />

      <View style={styles.starContainer}>
        <Text style={styles.starIcon}>⭐</Text>
        <Text style={styles.levelText}>{pokemonLvl}</Text>
      </View>

      <Text style={styles.pokemonName}>{pokemonName}</Text>
      <Text style={styles.pokemonType}>{pokemonType}</Text>

      <View style={styles.loaderContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
        <Text style={styles.progressText}>80%</Text>
      </View>

      <TouchableOpacity style={styles.powerUpButton}>
        <Text style={styles.powerUpButtonText}>Power Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export const PokemonDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PokemonDetailsScreenNavigationProp>();
  const route = useRoute<PokemonDetailsScreenRouteProp>();
  const { pokemonName, pokemonType, pokemonImage } = route.params;

  const pokemonLvl = 2;

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
          pokemonLvl={pokemonLvl}
          imagePokemon={pokemonImage}
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
  pokemonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1, 
    justifyContent: 'space-between', 
  },
  pokemonImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pokemonType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  stepCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#007AFF',
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
  starContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    position: 'absolute',
    fontSize: 70,
    color: '#FFC107',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  levelText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A148C',
  },
  loaderContainer: {
    width: '100%',
    marginVertical: 20,
  },
  progressBar: {
    height: 22,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: '80%',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  powerUpButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
    marginTop: 20,
  },
  powerUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
