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

  // MARK: - Privacy blur (app switcher)

  private var privacyBlurView: UIVisualEffectView?

  func sceneWillResignActive(_ scene: UIScene) {
    showPrivacyBlur()
  }

  func sceneDidBecomeActive(_ scene: UIScene) {
    hidePrivacyBlur()
  }

  private func showPrivacyBlur() {
    guard let window = window, privacyBlurView == nil else { return }

    let blurView = UIVisualEffectView(effect: UIBlurEffect(style: .systemMaterial))
    blurView.frame = window.bounds
    blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    window.addSubview(blurView)
    privacyBlurView = blurView
  }

  private func hidePrivacyBlur() {
    guard let blurView = privacyBlurView else { return }
    privacyBlurView = nil

    UIView.animate(
      withDuration: 0.2,
      animations: { blurView.alpha = 0 },
      completion: { _ in blurView.removeFromSuperview() }
    )
  }
}
