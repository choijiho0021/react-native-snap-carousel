//
//  AppDelegate+Iamport.m
//  Rokebi
//
//  Created by soojeong on 10/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegate+Iamport.h"
#import <React/RCTLinkingManager.h>

@implementation AppDelegate(Rokebi)

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
