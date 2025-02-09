#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CallKitModule : RCTEventEmitter <RCTBridgeModule>
// + (instancetype)sharedInstance;
- (void)sendCallStatusEvent:(NSString *)status;
- (void)sendEventWithNameWrapper:(NSString *)name body:(id)body;
- (void)setMutedCall:(NSString *)uuidString muted:(BOOL)muted;
- (void)toggleSpeaker:(NSString *)uuid enabled:(BOOL)enabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (BOOL)getSpeakerStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
@end
