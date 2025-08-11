import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PokemonListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface PokemonListProps {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRefresh,
}) => {
  const navigation = useNavigation<PokemonListNavigationProp>();
  const insets = useSafeAreaInsets();


  const handlePokemonPress = (
    pokemonId: string,
    pokemonName: string,
    pokemonImage: string,
    pokemonType: string,
  ) => {
    navigation.navigate('PokemonDetails', {
      pokemonId,
      pokemonName,
      pokemonImage,
      pokemonType,
    });
  };

  const renderPokemonItem = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity
      style={styles.pokemonItem}
      onPress={() =>
        handlePokemonPress(
          item.id.toString(),
          item.name,
          item.image,
          item.types.join(', '),
        )
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.pokemonImage}
        resizeMode="contain"
      />
      <View style={styles.pokemonInfo}>
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonTypes}>{item.types.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading pokemons...</Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemons}
      renderItem={renderPokemonItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={[styles.listContainer, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl
          refreshing={loading && pokemons.length === 0}
          onRefresh={onRefresh}
        />
      }
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  
  },
  pokemonItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonImage: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
  },
  pokemonInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  pokemonTypes: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  pokemonId: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  footerText: {
    marginLeft: 5,
    color: '#007AFF',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});
