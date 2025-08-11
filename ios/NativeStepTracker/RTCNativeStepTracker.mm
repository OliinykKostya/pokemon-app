//
//  RTCNativeStepTracker.m
//  pokemonApp
//
//  Created by Kostiantyn Oliinyk on 10.08.25.
//
#import "RTCNativeStepTracker.h"
#import <CoreMotion/CoreMotion.h>

@interface RTCNativeStepTracker ()
@property (nonatomic, strong) CMPedometer *pedometer;
@property (nonatomic, strong) NSDate *startDate;
@property (nonatomic, assign) BOOL isTracking;
@end

@implementation RTCNativeStepTracker

- (instancetype)init {
  if (self = [super init]) {
    _pedometer = [[CMPedometer alloc] init];
    _isTracking = NO;
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeStepTrackerSpecJSI>(params);
}

- (NSNumber *)isStepTrackingAvailable {
  BOOL available = [CMPedometer isStepCountingAvailable];
  NSLog(@"NativeStepTracker: isStepTrackingAvailable called, result: %@", available ? @"YES" : @"NO");
  return @(available);
}

- (void)startStepTracking {
  NSLog(@"NativeStepTracker: startStepTracking called");
  
  if (self.isTracking) {
    NSLog(@"NativeStepTracker: Already tracking steps");
    return;
  }
  
  if ([CMPedometer authorizationStatus] == CMAuthorizationStatusDenied) {
    NSLog(@"NativeStepTracker: Motion permissions denied!");
    return;
  }
  
  NSLog(@"NativeStepTracker: Starting pedometer updates");
  self.startDate = [NSDate date];
  self.isTracking = YES;
  
  __weak __typeof(self) weakSelf = self;
  [self.pedometer startPedometerUpdatesFromDate:self.startDate withHandler:^(CMPedometerData * _Nullable data, NSError * _Nullable error) {
    __strong __typeof(self) strongSelf = weakSelf;
    if (!strongSelf || !strongSelf.isTracking) return;
    
    if (error) {
      NSLog(@"NativeStepTracker: Pedometer error: %@", error);
      return;
    }
    
    NSNumber *steps = data.numberOfSteps ?: @0;
    NSLog(@"NativeStepTracker: Sending step update: %@", steps);
    
          dispatch_async(dispatch_get_main_queue(), ^{
        [strongSelf emitOnStepUpdated:@{ @"stepCount": steps }];
        NSLog(@"NativeStepTracker: Event sent successfully");
      });
  }];
}

- (void)stopStepTracking {
  NSLog(@"NativeStepTracker: stopStepTracking called");
  
  if (!self.isTracking) {
    NSLog(@"NativeStepTracker: Not tracking steps");
    return;
  }
  
  [self.pedometer stopPedometerUpdates];
  self.isTracking = NO;
  NSLog(@"NativeStepTracker: Stopped pedometer updates");
}

+ (NSString *)moduleName
{
  return @"NativeStepTracker";
}



@end
