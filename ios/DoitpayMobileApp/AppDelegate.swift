import UIKit
import React
import React_RCTAppDelegate
import Firebase
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // Keep launch options so SceneDelegate can use them.
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    self.launchOptions = launchOptions

    // Firebase must be configured before RN starts.
    FirebaseApp.configure()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)

    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    // IMPORTANT:
    // Do NOT create UIWindow here.
    // SceneDelegate owns the window now.

    return true
  }

  // MARK: - UIScene configuration

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {

    let configuration = UISceneConfiguration(
      name: "Default Configuration",
      sessionRole: connectingSceneSession.role
    )

    configuration.delegateClass = SceneDelegate.self

    return configuration
  }

  // MARK: - Push Notifications

  func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
  }

  func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print(
      "Failed to register for notifications: \(error.localizedDescription)"
    )
  }

  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    completionHandler(.newData)
  }
}


class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
        .jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(
        forResource: "main",
        withExtension: "jsbundle"
      )
    #endif
  }

  override func fabricEnabled() -> Bool {
    return true
  }
}
