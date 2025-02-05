/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : RCTAppDelegate <UNUserNotificationCenterDelegate>


// 발신 통화 메서드 선언
- (void)startCallWithId:(NSUUID *)callId handle:(NSString *)handle;
- (void)endAllCalls;
- (void)muteCall:(NSString *)uuidString muted:(BOOL)muted;
@end

