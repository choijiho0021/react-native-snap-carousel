#import <React/RCTBridgeModule.h>
#import <CallKit/CallKit.h>
#import "AppDelegate.h"
#import "CallKitModule.h"

@implementation CallKitModule {
    BOOL hasListeners; // 이벤트 리스너가 있는지 여부
    NSMutableArray *eventQueue; // 이벤트를 저장하는 큐
    NSMutableArray *_delayedEvents;
}

RCT_EXPORT_MODULE();

// React Native에서 이벤트 리스너를 추가하면 호출됨
- (void)startObserving {
    hasListeners = YES;
    // NSLog(@"@ 📢 [CallKitModule] startObserving hasListeners: %d", hasListeners);

    // 저장된 이벤트가 있으면 모두 전송
    if (eventQueue.count > 0) {
        NSLog(@"@ 📢 [CallKitModule] Sending queued events...");
        for (NSDictionary *event in eventQueue) {
            [self sendEventWithName:event[@"name"] body:event[@"body"]];
        }
        [eventQueue removeAllObjects];
    }
}

// React Native에서 이벤트 리스너를 제거하면 호출됨
- (void)stopObserving {
    hasListeners = NO;
}

// uuid 리턴
RCT_EXPORT_METHOD(startCall:(NSString *)handle resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{

        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
        NSUUID *callId = [[NSUUID alloc] init];

        if (!callId) {
            NSLog(@"Invalid UUID");
            reject(@"UUID_ERROR", @"Invalid UUID", nil);
            return;
        }
        NSLog(@"[CallKitModule] start call uuid: %@", callId.UUIDString);

        // AppDelegate의 startCallWithId 호출
        if ([appDelegate respondsToSelector:@selector(startCallWithId:handle:)]) {
            [appDelegate startCallWithId:callId handle:handle];

            // ✅ React Native로 `NSString *` 반환
            NSString *result = [NSString stringWithFormat:@"%@", callId.UUIDString];
            resolve(result);
        } else {
            NSLog(@"startCallWithId:handle: is not implemented in AppDelegate");
            reject(@"CALLKIT_ERROR", @"startCallWithId:handle: is not implemented in AppDelegate", nil);
        }
    });
}

RCT_EXPORT_METHOD(endCalls) {
    dispatch_async(dispatch_get_main_queue(), ^{
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];

        // AppDelegate의 startCallWithId 호출
        if ([appDelegate respondsToSelector:@selector(endAllCalls)]) {
            [appDelegate endAllCalls];
        } else {
            NSLog(@"[CallKitModule] endAllCalls is not implemented in AppDelegate");
        }
    });
}

RCT_EXPORT_METHOD(setMutedCall:(NSString *)uuidString :(BOOL)muted)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];

        if ([appDelegate respondsToSelector:@selector(muteCall:muted:)]) {
            [appDelegate muteCall: uuidString muted:muted];
        } else {
            NSLog(@"[CallKitModule] muteCall is not implemented in AppDelegate");
        }
    });
}

// React Native 브릿지가 연결되었는지 확인
- (void)setBridge:(RCTBridge *)bridge {
    [super setBridge:bridge];
    NSLog(@"✅ [CallKitModule] Bridge has been set: %@", bridge);
}

// 이벤트 지원 목록 설정
- (NSArray<NSString *> *)supportedEvents {
  return @[@"CallStatusUpdate", @"DTMFCallAction"];
}

// react native에서 mute, unmute, endcall 처리 - CallStatusUpdate
RCT_EXPORT_METHOD(sendCallStatusEvent:(NSString *)status) {
    dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"📢 [CallKitModule] sendCallStatusEvent called with status: %@", status);

    if (!eventQueue) {
        eventQueue = [NSMutableArray new];
    }

    // ✅ React Native가 초기화한 인스턴스를 가져옴
    CallKitModule *callKitInstance = [self.bridge moduleForClass:[CallKitModule class]];

    if (callKitInstance.bridge) {  // 🔵 self.bridge 대신 callKitInstance.bridge 사용
        NSLog(@"✅ [CallKitModule] self.bridge is initialized: %@", callKitInstance.bridge);
        if (hasListeners) {
            [callKitInstance sendEventWithName:@"CallStatusUpdate" body:@{@"status": status}];
            NSLog(@"✅ [CallKitModule] Event sent successfully!");
        } else {
            NSLog(@"⚠️ [CallKitModule] No listeners found, event not sent.");
        }
    } else {
        NSLog(@"⚠️ [CallKitModule] self.bridge is NULL, queuing event...");
        [eventQueue addObject:@{@"name": @"CallStatusUpdate", @"body": @{@"status": status}}];
    }
    });
}

// react native에서 dtmf call action - DTMFCallAction
RCT_EXPORT_METHOD(sendEventWithNameWrapper:(NSString *)name body:(id)body) {
    dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"✅ [CallKitModule] sendEventWithNameWrapper: %@, hasListeners : %@", name, hasListeners ? @"YES": @"NO");

    if (hasListeners) {
        [self sendEventWithName:name body:body];
    } else {
        NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
            name, @"name",
            body, @"data",
            nil
        ];
        [_delayedEvents addObject:dictionary];
    }
    });
}

@end
