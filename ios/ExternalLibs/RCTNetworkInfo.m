//
//  RCTCalendarModule.m
//  RokebiESIM
//
//  Created by Bohun Tak on 2022/07/23.
//  Copyright © 2022 Facebook. All rights reserved.
//
#import <React/RCTBridgeModule.h>
#import <CoreTelephony/CTCellularPlanProvisioning.h>
#import <React/RCTLog.h>
#import "RCTNetworkInfo.h"

@implementation RCTNetworkInfo

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(supportEsim: (RCTResponseSenderBlock)callback)
{
  BOOL plan = [[CTCellularPlanProvisioning alloc] supportsCellularPlan];
  callback(@[@(plan)]);
  RCTLogInfo(@"Support ESIM %d", plan);
}
@end
