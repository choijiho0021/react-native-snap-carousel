//
//  RCTCalendarModule.m
//  RokebiESIM
//
//  Created by Bohun Tak on 2022/07/23.
//  Copyright © 2022 Facebook. All rights reserved.
//
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(KakaoShareLink, NSObject)

RCT_EXTERN_METHOD(sendCustom:(NSDictionary *)dict withResolver:(RCTPromiseResolveBlock *)resolve withRejecter:(RCTPromiseRejectBlock *)reject)
@end
