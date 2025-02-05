#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CallKitModule : RCTEventEmitter <RCTBridgeModule>
- (void)sendCallStatusEvent:(NSString *)status;
- (void)sendEventWithNameWrapper:(NSString *)name body:(id)body;
- (void)setMutedCall:(NSString *)uuidString muted:(BOOL)muted;
@end
