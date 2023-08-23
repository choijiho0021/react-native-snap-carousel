//#import "AppDelegate.h"
//#import "RokebiESIM-Swift.h"
//#if RCT_DEV
//#import <React/RCTDevLoadingView.h>
//#endif
//#import <AVFoundation/AVFoundation.h>
//
//#import <AppCenterReactNative.h>
//#import <AppCenterReactNativeAnalytics.h>
//#import <AppCenterReactNativeCrashes.h>
//
//#import <ChannelIOFront/ChannelIOFront-swift.h>
//
//#import "RNSplashScreen.h"  // here
//#import <CodePush/CodePush.h>
//
//#ifdef TARGET_GLOBAL  // RokebiGlobal
//#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>
//#endif
//
//
//#import <React/RCTBundleURLProvider.h>

// firebase
#import <Firebase.h>

// Notification Import
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>


#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate


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
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// -------- IOS Notification ---------


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"RokebiESIM";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // Define Firebase 
  [FIRApp configure];
  
  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
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

@end
