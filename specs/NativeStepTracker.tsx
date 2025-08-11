import type { TurboModule, CodegenTypes } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isStepTrackingAvailable(): boolean | null;
  startStepTracking(): void;
  stopStepTracking(): void;
  readonly onStepUpdated: CodegenTypes.EventEmitter<{ stepCount: number }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeStepTracker');
