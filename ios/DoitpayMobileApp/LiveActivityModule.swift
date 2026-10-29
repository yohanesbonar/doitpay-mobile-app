import ActivityKit
import Foundation
import React

@objc(LiveActivityModule)
final class LiveActivityModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(startPaymentActivity:resolver:rejecter:)
  func startPaymentActivity(
    _ params: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(nil)
      return
    }
    guard
      let paymentId = params["paymentId"] as? String,
      let expiresAtMs = params["expiresAt"] as? Double
    else {
      reject("invalid_params", "paymentId and expiresAt are required", nil)
      return
    }

    let expiresAt = Date(timeIntervalSince1970: expiresAtMs / 1000)
    guard expiresAt > Date(), ActivityAuthorizationInfo().areActivitiesEnabled else {
      resolve(nil)
      return
    }

    let attributes = PaymentActivityAttributes(
      paymentId: paymentId,
      title: params["title"] as? String ?? "",
      amount: params["amount"] as? String ?? "",
      methodLabel: params["methodLabel"] as? String ?? "",
      startedAt: Date()
    )

    Task {
      for activity in Activity<PaymentActivityAttributes>.activities {
        if activity.attributes.paymentId == paymentId, activity.activityState == .active {
          resolve(activity.id)
          return
        }
        await activity.end(nil, dismissalPolicy: .immediate)
      }

      do {
        let activity = try Activity.request(
          attributes: attributes,
          content: ActivityContent(
            state: PaymentActivityAttributes.ContentState(expiresAt: expiresAt),
            staleDate: expiresAt
          ),
          pushType: nil
        )
        resolve(activity.id)
      } catch {
        reject("start_failed", error.localizedDescription, error)
      }
    }
  }

  @objc(endPaymentActivity:resolver:rejecter:)
  func endPaymentActivity(
    _ paymentId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(nil)
      return
    }
    Task {
      for activity in Activity<PaymentActivityAttributes>.activities
      where activity.attributes.paymentId == paymentId {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
      resolve(nil)
    }
  }

  @objc(endExpiredActivities:rejecter:)
  func endExpiredActivities(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(nil)
      return
    }
    Task {
      let now = Date()
      for activity in Activity<PaymentActivityAttributes>.activities
      where activity.content.state.expiresAt <= now {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
      resolve(nil)
    }
  }
}
