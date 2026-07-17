import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import PostHog from 'posthog-react-native';

const apiKey = Config.POSTHOG_API_KEY?.trim();
const host = Config.POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';

export const posthogClient = apiKey
  ? new PostHog(apiKey, {
      host,
      captureAppLifecycleEvents: true,
      enablePersistSessionIdAcrossRestart: true,
      personProfiles: 'always',
    })
  : null;

if (posthogClient) {
  posthogClient.debug(true);
}

export const releaseStage = Config.POSTHOG_RELEASE_STAGE?.trim() || 'internal_release';

const commonProperties = {
  release_stage: releaseStage,
  platform: Platform.OS,
  app_version: DeviceInfo.getVersion(),
  app_build: DeviceInfo.getBuildNumber(),
};

export const trackPostHogEvent = (eventName: string, properties: Record<string, unknown> = {}) => {
  if (!posthogClient) {
    console.log(`[PostHog] Failed to trigger event "${eventName}" because the apiKey is not configured.`);
    return;
  }

  posthogClient.capture(eventName, {
    ...commonProperties,
    ...properties,
  });

  posthogClient.flush();
};

export const trackScreenView = (screenName: string, properties: Record<string, unknown> = {}) => {
  trackPostHogEvent('screen_viewed', {
    screen_name: screenName,
    ...properties,
  });
};

const normalizePhoneNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

const maskPhoneNumber = (phone: string) => {
  const normalized = normalizePhoneNumber(phone);

  if (normalized.length <= 4) {
    return normalized;
  }

  return `${normalized.slice(0, 2)}${'*'.repeat(Math.max(normalized.length - 4, 0))}${normalized.slice(-2)}`;
};

export const identifyPostHogUser = (
  phoneNumber: string,
  properties: Record<string, unknown> = {},
) => {
  console.log('[PostHog Debug] identifyPostHogUser called with parameter:', phoneNumber);

  if (!posthogClient) {
    console.log('[PostHog] Identify failed: posthogClient is not initialized.');
    return;
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    console.log('[PostHog] Identify failed: phone number is empty or invalid.');
    return;
  }

  const maskedPhone = maskPhoneNumber(normalizedPhone);
  console.log(`[PostHog] Identify starting. phone_number_masked=${maskedPhone}`);

  try {
    posthogClient.identify(normalizedPhone, {
      phone_number: normalizedPhone,
      phone_number_masked: maskedPhone,
      ...properties,
    });

    posthogClient.flush();
    console.log(`[PostHog] Identify success. phone_number_masked=${maskedPhone}`);
  } catch (error) {
    console.error('[PostHog] Identify failed to send phone number.', error);
  }
};

export const getAmountRange = (value?: string | number | null) => {
  const amount = typeof value === 'string' ? Number(value) : (value ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'unknown';
  }

  if (amount < 100000) {
    return 'under_100k';
  }

  if (amount < 500000) {
    return '100k_500k';
  }

  if (amount < 1000000) {
    return '500k_1m';
  }

  return 'over_1m';
};