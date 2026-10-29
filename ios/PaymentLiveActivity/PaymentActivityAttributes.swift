import ActivityKit
import Foundation

// Compiled into both the app and the widget extension; keep the two in sync by sharing this file.
@available(iOS 16.1, *)
struct PaymentActivityAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var expiresAt: Date
  }

  var paymentId: String
  var title: String
  var amount: String
  var methodLabel: String
  var startedAt: Date
}
