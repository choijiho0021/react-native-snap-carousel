
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif
#import <AudioUnit/AudioUnit.h>
#import <CallKit/CallKit.h>

#import <AVFoundation/AVFoundation.h>

#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>

#import <ChannelIOFront/ChannelIOFront-swift.h>

#import "RNSplashScreen.h"  // here
#import <CodePush/CodePush.h>

#import <React/RCTLinkingManager.h>

// firebase
#import <Firebase.h>

// Notification Import
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

// Splash Screen
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

// NAVER Tracker
#import <RokebiESIM-Swift.h>

// facebook SDK
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>

// Naver Login
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>

#import "AppDelegate.h"
#import <UIKit/UIKit.h>

#import <React/RCTBundleURLProvider.h>


@interface AppDelegate () <CXProviderDelegate>
@property (nonatomic, strong) CXProvider *callKitProvider;
@property (nonatomic, strong) CXCallController *callController;
@end


@implementation AppDelegate
 


// 무슨 용도?
static NSString *const kRNConcurrentRoot = @"concurrentRoot";

 


//---- IOS Notification ------
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  if(error) {
    [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
  }
  
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError: %@", error);
}
// IOS 10+ Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  // With swizzling disabled you must let Messaging know about the message, for Analytics
   [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}


// IOS 4-10 Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
//  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // Still call the JS onNotification handler so it can display the new message right away
  NSDictionary *userInfo = notification.request.content.userInfo;
  
  // With swizzling disabled you must let Messaging know about the message, for Analytics
   [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
//  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:^void (UIBackgroundFetchResult result){}];

  // hide push notification
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);

}

// -------- IOS Notification ---------


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"RokebiESIM";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  
  // Define
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    }

  [NaverTracker configure];
  

  [ChannelIO initialize:application];

  [self configureAudioSession];
  [self setupCallKit];

  [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

  [FBSDKApplicationDelegate.sharedInstance initializeSDK];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  
  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [super application:application didFinishLaunchingWithOptions:launchOptions];

  [ChannelIO initialize:application];
  
  [NaverTracker configure];

  // didFinishLaunchingWithOptions 아래에 와야한다. 위에 있으면 RNSplashScreen은 연결할 RootView를 몰라서 에러 로그도 출력하지 않고 하얀화면만 실행된다
  [RNSplashScreen show];
  
  return true;
}

// SceneDelegate 관련 메서드 연결
// - (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
//       NSLog(@"AppDelegate: Connecting SceneSession.");

//     return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
// }

// - (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
//     // Scene 구성 반환
//     return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
// }

// - (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
//     // 삭제된 씬 세션 처리
//     NSLog(@"Scene sessions discarded");
// }

#pragma mark - CallKit 설정

- (void)setupCallKit {
    // CallKit configuration
    CXProviderConfiguration *providerConfig = [[CXProviderConfiguration alloc] initWithLocalizedName:@"RokebiESIM"];
    
    // Configure options
    providerConfig.supportsVideo = NO; // Disable video calls
    providerConfig.maximumCallGroups = 1;
    providerConfig.maximumCallsPerCallGroup = 1;
    providerConfig.supportedHandleTypes = [NSSet setWithObject:@(CXHandleTypePhoneNumber)]; // Phone number handle type
    
    // Disable system UI by avoiding icon or ringtone
    providerConfig.includesCallsInRecents = NO; // Don't show calls in recent calls log
    providerConfig.ringtoneSound = nil;         // No default ringtone

        if (!self.callKitProvider) {
        CXProviderConfiguration *config = [[CXProviderConfiguration alloc] initWithLocalizedName:@"RokebiESIM"];
        config.supportsVideo = NO;
        self.callKitProvider = [[CXProvider alloc] initWithConfiguration:config];
        [self.callKitProvider setDelegate:self queue:nil];
    }

    if (!self.callController) {
        self.callController = [[CXCallController alloc] init];
    }
}

// 발신통화
// - (void)startCallWithId:(NSUUID *)callId handle:(NSString *)handle {
//     // Create CXHandle with type .generic and the given handle value
//     CXHandle *cxHandle = [[CXHandle alloc] initWithType:CXHandleTypeGeneric value:handle];
    
//     // Create CXStartCallAction with call ID and CXHandle
//     CXStartCallAction *startCallAction = [[CXStartCallAction alloc] initWithCallUUID:callId handle:cxHandle];

//     // iOS 14 이상에서만 shouldSuppressInCallUI 설정
// //    if (@available(iOS 14.0, *)) {
// //        startCallAction.shouldSuppressInCallUI = YES;
// //    } else {
// //        NSLog(@"[Warning] shouldSuppressInCallUI is not supported on this iOS version.");
// //    }
    
//     // Create a transaction with the start call action
//     CXTransaction *transaction = [[CXTransaction alloc] initWithAction:startCallAction];
    
//     // Request the transaction via CXCallController
//     CXCallController *callController = [[CXCallController alloc] init];
//     [callController requestTransaction:transaction completion:^(NSError * _Nullable error) {
//         if (error) {
//             NSLog(@"Failed to start call: %@", error.localizedDescription);
//         } else {
//             NSLog(@"Start Call");
//         }
//     }];
// }

- (void)startCallWithId:(NSUUID *)callId handle:(NSString *)handle {
    // Create CXHandle with type .generic and the given handle value
    CXHandle *cxHandle = [[CXHandle alloc] initWithType:CXHandleTypePhoneNumber value:handle];
    
    // Create CXStartCallAction with call ID and CXHandle
    CXStartCallAction *startCallAction = [[CXStartCallAction alloc] initWithCallUUID:callId handle:cxHandle];
    
    // Create a transaction with the start call action
    CXTransaction *transaction = [[CXTransaction alloc] initWithAction:startCallAction];
    
    // Request the transaction via CXCallController
    CXCallController *callController = [[CXCallController alloc] init];
    [callController requestTransaction:transaction completion:^(NSError * _Nullable error) {
        if (error) {
            NSLog(@"Failed to start call: %@", error.localizedDescription);
        } else {
            NSLog(@"Start Call");
        }
    }];
}


- (void)requestTransaction:(CXTransaction *)transaction
{
#ifdef DEBUG
    NSLog(@"[appdelegate][requestTransaction] transaction = %@", transaction);
#endif
    if (self.callController == nil) {
        self.callController = [[CXCallController alloc] init];
    }
    [self.callController requestTransaction:transaction completion:^(NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"[appdelegate][requestTransaction] Error requesting transaction (%@): (%@)", transaction.actions, error);
        } else {
            NSLog(@"[appdelegate][requestTransaction] Requested transaction successfully");

            // CXStartCallAction
            if ([[transaction.actions firstObject] isKindOfClass:[CXStartCallAction class]]) {
                CXStartCallAction *startCallAction = [transaction.actions firstObject];
                CXCallUpdate *callUpdate = [[CXCallUpdate alloc] init];
                callUpdate.remoteHandle = startCallAction.handle;
                callUpdate.hasVideo = startCallAction.video;
                callUpdate.localizedCallerName = startCallAction.contactIdentifier;
                callUpdate.supportsDTMF = YES;
                callUpdate.supportsHolding = YES;
                callUpdate.supportsGrouping = YES;
                callUpdate.supportsUngrouping = YES;
                [self.callKitProvider reportCallWithUUID:startCallAction.callUUID updated:callUpdate];
            }
        }
    }];
}


- (void)endCallWithUUID:(NSUUID *)callUUID {
    // 통화 종료 액션 생성
    CXEndCallAction *endCallAction = [[CXEndCallAction alloc] initWithCallUUID:callUUID];
    
    // CallKit 트랜잭션 생성 및 액션 추가
    CXTransaction *transaction = [[CXTransaction alloc] initWithAction:endCallAction];
    CXCallController *callController = [[CXCallController alloc] init];

    [callController requestTransaction:transaction completion:^(NSError * _Nullable error) {
        if (error) {
            NSLog(@"Failed to end call: %@", error.localizedDescription);
        } else {
            NSLog(@"Call ended successfully.");
        }
    }];
}


- (void)endAllCalls {
#ifdef DEBUG
    NSLog(@"[appdelegate][endAllCalls] calls = %@", self.callController.callObserver.calls);
#endif

    // 현재 활성화된 모든 통화를 순회하며 종료
    for (CXCall *call in self.callController.callObserver.calls) {
        // CXEndCallAction 생성
        CXEndCallAction *endCallAction = [[CXEndCallAction alloc] initWithCallUUID:call.UUID];
        
        // CXTransaction 생성 및 액션 추가
        CXTransaction *transaction = [[CXTransaction alloc] initWithAction:endCallAction];
        
        CXCallController *callController = [[CXCallController alloc] init];

        [callController requestTransaction:transaction completion:^(NSError * _Nullable error) {
            if (error) {
                NSLog(@"Failed to end call: %@", error.localizedDescription);
            } else {
                NSLog(@"Call ended successfully.");
            }
        }];

        // 트랜잭션 요청
        // [self requestTransaction:transaction];
    }
}

// CallKit delegate method - Start call
#pragma mark - CXProviderDelegate

- (void)provider:(CXProvider *)provider performStartCallAction:(CXStartCallAction *)action {
    NSLog(@"Performing start call action for: %@", action.callUUID);

    NSLog(@"Call started successfully.");

    // 오디오 세션 설정
    NSError *error = nil;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord
                                            mode:AVAudioSessionModeVoiceChat
                                         options:AVAudioSessionCategoryOptionAllowBluetooth
                                           error:&error];
    if (error) {
        NSLog(@"Error setting up audio session: %@", error.localizedDescription);
    }

    [[AVAudioSession sharedInstance] setActive:YES error:&error];
    if (error) {
        NSLog(@"Error activating audio session: %@", error.localizedDescription);
    }

    // CallKit에 통화 시작 보고
    [action fulfill];
}

// CallKit delegate method - End call
- (void)provider:(CXProvider *)provider performEndCallAction:(CXEndCallAction *)action {
    NSLog(@"Performing end call action");
    // [action fulfill]; // 통화종료
    // Here you can end the actual SIP/WebRTC call
}

// CallKit delegate method - Handle call ended
- (void)provider:(CXProvider *)provider didDeactivateAudioSession:(AVAudioSession *)audioSession {
    NSLog(@"Audio session deactivated");
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([url.scheme isEqualToString:@"esimnaverlogin"]) {
    return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
  }

  [NaverTracker setInflow:url];
  
  if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl: url];
  }

  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
    return YES;
  }

  return [RCTLinkingManager application:application openURL:url options:options];
}


- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];
#ifdef RCT_NEW_ARCH_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif
  return initProps;
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [CodePush bundleURL];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (void)configureAudioSession {
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    AVAudioSessionCategoryOptions options = 
        AVAudioSessionCategoryOptionAllowBluetooth | 
        AVAudioSessionCategoryOptionDefaultToSpeaker | 
        AVAudioSessionCategoryOptionMixWithOthers; 
    NSError *error = nil;

// 예를 들어, mVoIP에는 playAndRecord 카테고리를 사용해야 하며, 모드는 voiceChat이나 videoChat을 사용해야 합니다.
// 

    // 오디오 세션 설정
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord
                 withOptions:options
                       error:&error];

    if (error) {
        NSLog(@"[ERROR] AVAudioSession Category fail, %d", error.code);
        NSLog(@"[ERROR] Failed to set AVAudioSession Category: %@, Error: %@", [audioSession category], error.localizedDescription);
    }

    // 통화 품질 향상을 위한 VoiceChat 모드 설정
    [audioSession setMode:AVAudioSessionModeVoiceChat error:&error];
    if (error) {
        NSLog(@"[ERROR] AVAudioSession Mode fail, %d", error.code);
        NSLog(@"[ERROR] Failed to set AVAudioSession Mode: %@, Error: %@", AVAudioSessionModeVoiceChat, error.localizedDescription);
    }

    // 오디오 세션 활성화
    [audioSession setActive:YES error:&error];
    if (error) {
        NSLog(@"[ERROR] AVAudioSession activate fail, %d", error.code);
        NSLog(@"[ERROR] Failed to activate AVAudioSession, Error: %@", error.localizedDescription);
    }
}

// static BOOL isAppTerminated = NO; // 전역 플래그

// // 이게 호출될 때 통화 종료시키면 됨
// - (void)applicationWillTerminate:(UIApplication *)application {
//     NSLog(@"App is being terminated");
//     isAppTerminated = YES; // 종료 플래그 설정
// }

// - (BOOL)isAppTerminated {
//     return isAppTerminated; // 종료 여부 반환
// }


//  - (BOOL)application:(UIApplication *)application
//  continueUserActivity:(NSUserActivity *)userActivity
//    restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
//  {
//    return [RNCallKeep application:application
//             continueUserActivity:userActivity
//               restorationHandler:restorationHandler];
//  }

@end
