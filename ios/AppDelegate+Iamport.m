//
//  AppDelegate+Iamport.m
//  Rokebi
//
//  Created by soojeong on 10/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegate+Iamport.h"
#import <RNKakaoLogins.h>
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

@implementation AppDelegate(Rokebi)

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl: url];
  }
  
  if ([[FBSDKApplicationDelegate sharedInstance] application:applicationㄴ openURL:url options:options]) {
    return YES;
  }

  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
