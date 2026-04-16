import UIKit
import React
import React_RCTAppDelegate
import Firebase // 1. Ensure Firebase is imported
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    // 3. Initialize Firebase before RN starts
    FirebaseApp.configure()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "DoitpayMobileApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // 4. Handle Device Token Registration
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // 5. Handle Failures (Optional but good for debugging)
  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for notifications: \(error.localizedDescription)")
  }

  // 6. Handle Background/Remote Notifications
  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable : Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    // This allows the RN Firebase library to process the notification
    completionHandler(.newData)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
  
  override func fabricEnabled() -> Bool {
    return true 
  }
}
