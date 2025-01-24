#import <React/RCTBridgeModule.h>
#import <CallKit/CallKit.h>
#import "AppDelegate.h"
#import "CallKitModule.h"

@implementation CallKitModule

RCT_EXPORT_MODULE();
 
RCT_EXPORT_METHOD(startCall:(NSString *)handle) {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"@@ start call: %@", handle);

        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        NSUUID *callId = [[NSUUID alloc] init];

        if (!callId) {
            NSLog(@"Invalid UUID");
            return;
        }
        NSLog(@"@@ start call uuid: %@", callId.UUIDString);

        // AppDelegate의 startCallWithId 호출
        if ([appDelegate respondsToSelector:@selector(startCallWithId:handle:)]) {
            [appDelegate startCallWithId:callId handle:handle];
        } else {
            NSLog(@"startCallWithId:handle: is not implemented in AppDelegate");
        }
    });
}

RCT_EXPORT_METHOD(endCalls) {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"@@ end calls");
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];

        // AppDelegate의 startCallWithId 호출
        if ([appDelegate respondsToSelector:@selector(endAllCalls)]) {
            [appDelegate endAllCalls];
        } else {
            NSLog(@"endAllCalls is not implemented in AppDelegate");
        }
    });
}

@end
