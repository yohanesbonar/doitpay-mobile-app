#import <CallKit/CallKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CallStateModule : RCTEventEmitter <RCTBridgeModule, CXCallObserverDelegate>
@property(nonatomic, strong) CXCallObserver *callObserver;
@property(nonatomic, assign) BOOL hasListeners;
@end

@implementation CallStateModule

RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    _callObserver = [CXCallObserver new];
    [_callObserver setDelegate:self queue:dispatch_get_main_queue()];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"callStateChanged"];
}

- (void)startObserving
{
  self.hasListeners = YES;
  [self emitCurrentCallState];
}

- (void)stopObserving
{
  self.hasListeners = NO;
}

RCT_REMAP_METHOD(getCallState,
                 getCallStateWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@([self isCallActive]));
}

- (BOOL)isCallActive
{
  for (CXCall *call in self.callObserver.calls) {
    if (!call.hasEnded) return YES;
  }
  return NO;
}

- (void)emitCurrentCallState
{
  if (self.hasListeners) {
    [self sendEventWithName:@"callStateChanged" body:@{@"active": @([self isCallActive])}];
  }
}

- (void)callObserver:(CXCallObserver *)callObserver callChanged:(CXCall *)call
{
  [self emitCurrentCallState];
}

@end
