import { useState, useEffect, useCallback, useRef } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import NativeStepTracker from '../../specs/NativeStepTracker';

interface StepTrackingState {
  isAvailable: boolean;
  isTracking: boolean;
  stepCount: number;
  hasPermission: boolean;
}

interface StepTrackingActions {
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  requestPermission: () => Promise<boolean>;
  resetStepCount: () => void;
}

export const useStepTracker = () => {
  const [state, setState] = useState<StepTrackingState>({
    isAvailable: false,
    isTracking: false,
    stepCount: 0,
    hasPermission: false,
  });

  const subscriptionRef = useRef<any>(null);

  const checkAvailability = useCallback(async () => {
    if (!state.hasPermission) return;

    try {
      const available = NativeStepTracker?.isStepTrackingAvailable();
      setState(prev => ({ ...prev, isAvailable: !!available }));
    } catch (error) {
      console.error('Error checking step tracking availability:', error);
      setState(prev => ({ ...prev, isAvailable: false }));
    }
  }, [state.hasPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      setState(prev => ({ ...prev, hasPermission: true }));
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Step Tracking Permission',
          message: 'This app needs permission to count your steps',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setState(prev => ({ ...prev, hasPermission: true }));
        return true;
      } else {
        setState(prev => ({ ...prev, hasPermission: false }));
        Alert.alert(
          'Permission Denied',
          'Step tracking requires activity recognition permission to work properly',
        );
        return false;
      }
    } catch (err) {
      console.warn('Error requesting ACTIVITY_RECOGNITION permission:', err);
      setState(prev => ({ ...prev, hasPermission: false }));
      return false;
    }
  }, []);

  const setupEventSubscription = useCallback(() => {
    if (!state.isAvailable || !state.hasPermission) return;

    try {
      subscriptionRef.current = NativeStepTracker.onStepUpdated(
        (event: { stepCount: number }) => {
          setState(prev => ({ ...prev, stepCount: event.stepCount }));
        },
      );
    } catch (error) {
      console.error('Error setting up event subscription:', error);
    }
  }, [state.isAvailable, state.hasPermission]);

  const cleanupEventSubscription = useCallback(() => {
    try {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, []);

  const startTracking = useCallback(async () => {
    if (!state.hasPermission) {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        return;
      }
    }

    try {
      setState(prev => ({ ...prev, stepCount: 0, isTracking: true }));
      NativeStepTracker.startStepTracking();
    } catch (error) {
      console.error('Error starting step tracking:', error);
      setState(prev => ({ ...prev, isTracking: false }));
    }
  }, [state.hasPermission, requestPermission]);

  const stopTracking = useCallback(() => {
    try {
      NativeStepTracker.stopStepTracking();
      setState(prev => ({ ...prev, isTracking: false }));
    } catch (error) {
      console.error('Error stopping step tracking:', error);
    }
  }, []);

  const resetStepCount = useCallback(() => {
    setState(prev => ({ ...prev, stepCount: 0 }));
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (state.hasPermission) {
      checkAvailability();
    }
  }, [state.hasPermission, checkAvailability]);

  useEffect(() => {
    if (state.isAvailable && state.hasPermission) {
      setupEventSubscription();
    }

    return () => {
      cleanupEventSubscription();

      if (state.isTracking) {
        NativeStepTracker.stopStepTracking();
      }
    };
  }, [
    state.isAvailable,
    state.hasPermission,
    setupEventSubscription,
    cleanupEventSubscription,
    state.isTracking,
  ]);

  const actions: StepTrackingActions = {
    startTracking,
    stopTracking,
    requestPermission,
    resetStepCount,
  };

  return {
    ...state,
    ...actions,
  };
};

export type { StepTrackingState, StepTrackingActions };
