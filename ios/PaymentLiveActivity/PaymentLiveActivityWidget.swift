import ActivityKit
import SwiftUI
import WidgetKit

private let brandColor = Color(red: 42 / 255, green: 157 / 255, blue: 143 / 255)

@main
struct PaymentLiveActivityBundle: WidgetBundle {
  var body: some Widget {
    PaymentLiveActivityWidget()
  }
}

struct PaymentLiveActivityWidget: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: PaymentActivityAttributes.self) { context in
      LockScreenView(context: context)
        .activitySystemActionForegroundColor(brandColor)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          AppLogo(size: 36)
            .padding(.leading, 4)
        }
        DynamicIslandExpandedRegion(.trailing) {
          CountdownText(context: context)
            .font(.title3.weight(.semibold))
            .frame(maxWidth: 90, alignment: .trailing)
        }
        DynamicIslandExpandedRegion(.center) {
          Text(context.attributes.title)
            .font(.subheadline.weight(.semibold))
            .lineLimit(1)
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack {
            Text(context.attributes.amount)
              .font(.headline)
            Spacer()
            Text(context.attributes.methodLabel)
              .font(.caption)
              .foregroundColor(.secondary)
              .lineLimit(1)
          }
          .padding(.horizontal, 4)
        }
      } compactLeading: {
        AppLogo(size: 22)
      } compactTrailing: {
        CountdownText(context: context)
          .font(.caption.weight(.semibold))
          .frame(maxWidth: 48)
      } minimal: {
        AppLogo(size: 22)
      }
    }
  }
}

private struct AppLogo: View {
  let size: CGFloat

  var body: some View {
    Image("AppLogo")
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .clipShape(RoundedRectangle(cornerRadius: size * 0.225, style: .continuous))
  }
}

private struct CountdownText: View {
  let context: ActivityViewContext<PaymentActivityAttributes>

  var body: some View {
    if context.isStale || context.state.expiresAt <= Date() {
      Text("Habis")
        .foregroundColor(.red)
    } else {
      Text(
        timerInterval: context.attributes.startedAt...context.state.expiresAt,
        countsDown: true
      )
      .monospacedDigit()
      .multilineTextAlignment(.trailing)
      .foregroundColor(brandColor)
    }
  }
}

private struct LockScreenView: View {
  let context: ActivityViewContext<PaymentActivityAttributes>

  var body: some View {
    HStack(alignment: .center, spacing: 12) {
      AppLogo(size: 40)

      VStack(alignment: .leading, spacing: 2) {
        Text(context.attributes.title)
          .font(.subheadline.weight(.semibold))
          .lineLimit(1)
        Text(context.attributes.amount)
          .font(.headline)
        Text(context.attributes.methodLabel)
          .font(.caption)
          .foregroundColor(.secondary)
          .lineLimit(1)
      }

      Spacer()

      VStack(alignment: .trailing, spacing: 2) {
        Text(context.isStale ? "Waktu habis" : "Bayar sebelum")
          .font(.caption)
          .foregroundColor(.secondary)
        CountdownText(context: context)
          .font(.title3.weight(.bold))
          .frame(maxWidth: 100, alignment: .trailing)
      }
    }
    .padding(16)
  }
}
