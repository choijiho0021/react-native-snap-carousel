#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NaverTracker, NSObject)

RCT_EXTERN_METHOD(
  trackPurchaseEvent: (nonnull NSNumber)amount
  items: (nonnull NSArray)items
  resolver: (RCTPromiseResolveBlock)resolver
  rejecter: (RCTPromiseRejectBlock)rejecter
)

@end
