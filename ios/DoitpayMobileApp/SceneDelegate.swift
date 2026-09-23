import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return
    }

    guard let factory = appDelegate.reactNativeFactory else {
      return
    }

    let window = UIWindow(windowScene: windowScene)

    factory.startReactNative(
      withModuleName: "DoitpayMobileApp",
      in: window,
      launchOptions: appDelegate.launchOptions
    )

    self.window = window
    appDelegate.window = window

    window.makeKeyAndVisible()
  }
}
