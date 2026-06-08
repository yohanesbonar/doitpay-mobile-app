//
//  ExitModule.m
//  DoitpayMobileApp
//
//  Created by Yohanes  Bonar on 08/06/26.
//

#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface ExitModule : NSObject <RCTBridgeModule>
@end

@implementation ExitModule

// Makro wajib agar modul ini terekspos ke sisi JavaScript React Native
RCT_EXPORT_MODULE();

// Method utama yang akan kita panggil dari sisi JS/TS
RCT_EXPORT_METHOD(exitApp)
{
  // Menutup aplikasi iOS secara native, aman, dan mulus
  exit(0);
}

@end
