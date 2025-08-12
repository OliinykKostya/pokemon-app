import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

interface PokemonCardProps {
  pokemonName: string;
  pokemonType: string;
  pokemonLvl: number;
  imagePokemon: string;
  onPowerUp: () => void;
  isPoweringUp: boolean;
  currentSteps: number;
  stepsToNextLevel: number;
  progressPercentage: number;
  buttonScale: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemonName = '',
  pokemonType = '',
  pokemonLvl = 0,
  imagePokemon = '',
  onPowerUp,
  isPoweringUp,
  currentSteps,
  stepsToNextLevel,
  progressPercentage,
  buttonScale,
  onPressIn,
  onPressOut,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.pokemonCard}>
        <View style={styles.headerSection}>
          <Text style={styles.pokemonName}>{pokemonName}</Text>
          <View style={styles.typeContainer}>
            <Text style={styles.pokemonType}>{pokemonType}</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.imageBackground} />
          <Image
            source={{ uri: imagePokemon }}
            style={styles.pokemonImage}
            resizeMode="contain"
            onError={(error) => {
              console.warn('Failed to load Pokemon image in card:', imagePokemon, error.nativeEvent);
            }}
          />
        </View>

        <View style={styles.levelSection}>
          <View style={styles.starContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.levelText}>{pokemonLvl}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progress to Next Level</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
              <View style={styles.progressGlow} />
            </View>
            <Text style={styles.progressText}>
              {currentSteps} / {stepsToNextLevel} steps
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.powerUpButton,
              isPoweringUp && styles.powerUpButtonActive,
            ]}
            onPress={onPowerUp}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={1}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.powerUpButtonText}>
                {isPoweringUp ? 'Powering Up...' : 'Power Up'}
              </Text>
              {isPoweringUp && <View style={styles.buttonPulse} />}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pokemonCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    flex: 1,
    margin: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  typeContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pokemonType: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  imageBackground: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f8f9fa',
    top: -15,
    left: -15,
    zIndex: -1,
  },
  pokemonImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  levelSection: {
    marginBottom: 24,
  },
  starContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 80,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  levelText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: '900',
    color: '#4A148C',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressSection: {
    width: '100%',
    marginBottom: 32,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    width: '100%',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '800',
  },
  powerUpButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  powerUpButtonActive: {
    backgroundColor: '#FFC107',
    shadowColor: '#FFC107',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginLeft: 12,
    opacity: 0.8,
  },
});
