#import <React/RCTBridgeModule.h>
#import <CallKit/CallKit.h>
#import <AVFoundation/AVAudioSession.h>
#import "AppDelegate.h"
#import "CallKitModule.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
@implementation CallKitModule {
    BOOL hasListeners; // 이벤트 리스너가 있는지 여부
    NSMutableArray *eventQueue; // 이벤트를 저장하는 큐
    NSMutableArray *_delayedEvents;
    AVAudioSession *_audioSession;
    CXCallObserver *_callObserver; // ✅ 일반 전화 감지를 위한 Call Observer
}
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}
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

- (instancetype)init {
    self = [super init];
    if (self) {
        _audioSession = [AVAudioSession sharedInstance];

        // 오디오 라우트 변경 감지 (이어폰, 블루투스, 스피커 변경 등)
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleAudioRouteChange:)
                                                     name:AVAudioSessionRouteChangeNotification
                                                   object:nil];

        // ✅ 일반 전화 감지
        _callObserver = [[CXCallObserver alloc] init];
        [_callObserver setDelegate:self queue:nil];
    }
    return self;
}

// 일반 전화 수신 및 종료 감지
- (void)callObserver:(CXCallObserver *)callObserver callChanged:(CXCall *)call {
    if (call.hasEnded) {
        NSLog(@" 일반 전화 종료됨 - WebRTC 연결 복구 가능");
        [self restartWebRTCConnection]; // WebRTC 연결 복구
    } else if (call.isOutgoing || call.hasConnected) {
        NSLog(@" 일반 전화 수신 감지됨 - VoIP 통화 유지 처리 필요");
        [self pauseWebRTCStream]; // WebRTC 스트림 일시 정지
    }
}

// WebRTC 세션 재연결
// 재연결이 필요하다고 하나 현재 상태로도 동작되고 있음.
- (void)restartWebRTCConnection {
    NSLog(@"🔄 WebRTC 세션 복구 중...");
    // WebRTC 연결 재설정 로직 (예: SIP 재등록, ICE 재시작 등)
}

// WebRTC 스트림 일시 정지 (일반 전화 수신 시)
- (void)pauseWebRTCStream {
    NSLog(@"⏸️ WebRTC 스트림 일시 정지...");
    // 필요 시 WebRTC 오디오, 비디오 스트림을 일시 정지
}

- (void)handleAudioRouteChange:(NSNotification *)notification {
    NSDictionary *info = notification.userInfo;
    AVAudioSessionRouteChangeReason reason = [info[AVAudioSessionRouteChangeReasonKey] integerValue];
    NSString *reasonString;
    switch (reason) {
        case AVAudioSessionRouteChangeReasonNewDeviceAvailable:
            reasonString = @"New device available (e.g., Bluetooth connected)";
            break;
        case AVAudioSessionRouteChangeReasonOldDeviceUnavailable:
            reasonString = @"Old device unavailable (e.g., Bluetooth disconnected)";
            break;
        case AVAudioSessionRouteChangeReasonCategoryChange:
            reasonString = @"Audio session category changed";
            break;
        case AVAudioSessionRouteChangeReasonOverride:
            reasonString = @"Output route overridden (e.g., speaker ON/OFF)";
            break;
        case AVAudioSessionRouteChangeReasonRouteConfigurationChange:
            reasonString = @"Route configuration changed";
            break;
        default:
            reasonString = @"Unknown reason";
            break;
    }
    
    NSString *currentOutput = @"Unknown";
    if (_audioSession.currentRoute.outputs.count > 0) {
        currentOutput = _audioSession.currentRoute.outputs.firstObject.portType;
    }
    #ifdef DEBUG
        NSLog(@"[InCallManager] Audio Route Changed@@: %@, Current Output: %@, info: %@", reasonString, currentOutput, notification.userInfo);
    #endif
    // React Native로 이벤트 전달
    [self sendEventWithName:@"onAudioRouteChange" body:@{@"reason": reasonString, @"currentOutput": currentOutput}];
}

// Incallmanager 참조
RCT_EXPORT_METHOD(toggleSpeaker:(NSString *)uuid
                  enabled:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"@@ [Callkit] toogle speaker %i", enabled);
        AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];

        if ([appDelegate respondsToSelector:@selector(setSpeakerEnabled:enabled:)]&& uuid.length > 0) {
           [appDelegate setSpeakerEnabled:uuid enabled:enabled];
        } else {
            NSLog(@"setSpeakerEnabled is not implemented in AppDelegate");
        }
        // resolve(@(enabled))
    });
}

// check speaker on/off
AVAudioSessionPortDescription *previousInput = nil;
- (BOOL)isSpeakerEnabled {
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    AVAudioSessionRouteDescription *currentRoute = audioSession.currentRoute;
    for (AVAudioSessionPortDescription *output in currentRoute.outputs) {
        if ([output.portType isEqualToString:AVAudioSessionPortBuiltInSpeaker]) {
            return YES; // 스피커 ON
        }
    }
    return NO; // 스피커 OFF
}

RCT_EXPORT_METHOD(getSpeakerStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
    BOOL isSpeakerOn = [self isSpeakerEnabled];
    resolve(@(isSpeakerOn)); // 저장된 상태를 React Native로 반환
    });
}

// React Native 브릿지가 연결되었는지 확인
- (void)setBridge:(RCTBridge *)bridge {
    [super setBridge:bridge];
    NSLog(@"✅ [CallKitModule] Bridge has been set: %@", bridge);
}

// 이벤트 지원 목록 설정
- (NSArray<NSString *> *)supportedEvents {
  return @[@"CallStatusUpdate", @"DTMFCallAction", @"onAudioRouteChange"];
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
