import { NativeModules, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export interface PaymentLiveActivityParams {
  paymentId: string;
  expiresAt: number;
  title: string;
  amount: string;
  methodLabel: string;
}

const ANDROID_CHANNEL_ID = 'payment_countdown';

const { LiveActivityModule } = NativeModules;

const androidNotificationId = (paymentId: string) => `payment-countdown-${paymentId}`;

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const showAndroidCountdown = async (params: PaymentLiveActivityParams) => {
  const channelId = await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Batas Waktu Pembayaran',
    importance: AndroidImportance.LOW,
  });

  await notifee.displayNotification({
    id: androidNotificationId(params.paymentId),
    title: `${params.title} · ${params.amount}`,
    body: `${params.methodLabel} · bayar sebelum ${formatTime(params.expiresAt)}`,
    android: {
      channelId,
      smallIcon: 'ic_notification',
      color: '#2a9d8f',
      ongoing: true,
      onlyAlertOnce: true,
      autoCancel: false,
      showTimestamp: true,
      timestamp: params.expiresAt,
      showChronometer: true,
      chronometerDirection: 'down',
      // Lets the OS remove the notification at expiry even if the app is killed.
      timeoutAfter: params.expiresAt - Date.now(),
      pressAction: { id: 'default' },
    },
  });
};

export const startPaymentLiveActivity = async (params: PaymentLiveActivityParams) => {
  if (params.expiresAt <= Date.now()) return;

  try {
    if (Platform.OS === 'ios') {
      await LiveActivityModule?.startPaymentActivity(params);
    } else {
      await showAndroidCountdown(params);
    }
  } catch (error) {
    console.log('startPaymentLiveActivity error:', error);
  }
};

export const endPaymentLiveActivity = async (paymentId: string) => {
  try {
    if (Platform.OS === 'ios') {
      await LiveActivityModule?.endPaymentActivity(paymentId);
    } else {
      await notifee.cancelNotification(androidNotificationId(paymentId));
    }
  } catch (error) {
    console.log('endPaymentLiveActivity error:', error);
  }
};

export const endExpiredPaymentLiveActivities = async () => {
  if (Platform.OS !== 'ios') return;
  try {
    await LiveActivityModule?.endExpiredActivities();
  } catch (error) {
    console.log('endExpiredPaymentLiveActivities error:', error);
  }
};
