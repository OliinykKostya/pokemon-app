import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

interface UseButtonAnimationReturn {
  buttonScale: Animated.Value;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

export const useButtonAnimation = (): UseButtonAnimationReturn => {
  const buttonScaleRef = useRef(new Animated.Value(1));

  const handlePressIn = useCallback(() => {
    Animated.timing(buttonScaleRef.current, {
      toValue: 0.6,
      duration: 20,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.timing(buttonScaleRef.current, {
      toValue: 1.2,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return {
    buttonScale: buttonScaleRef.current,
    handlePressIn,
    handlePressOut,
  };
};
