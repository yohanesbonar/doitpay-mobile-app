import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import PostHog from 'posthog-react-native';

const apiKey = Config.POSTHOG_API_KEY?.trim();
const host = Config.POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';

export const releaseStage = Config.POSTHOG_RELEASE_STAGE?.trim() || 'internal_release';

// -----------------------------------------------------------------------------
// ENVIRONMENT CHECK: PostHog will ONLY be initialized in production builds.
// Adjust `Config.ENV` or `releaseStage` to match your project's .env variable.
// -----------------------------------------------------------------------------
const isProduction = Config.ENV === 'production' || releaseStage === 'public_release'

/**
 * Singleton PostHog client instance.
 * Returns `null` if the app is running in non-production environments or if the API key is missing.
 */
export const posthogClient = isProduction && apiKey
  ? new PostHog(apiKey, {
      host,
      captureAppLifecycleEvents: true,
      enablePersistSessionIdAcrossRestart: true,
      personProfiles: 'always',
    })
  : null;

// Temporary verification log
if (__DEV__) {
  console.log('--------------------------------------------------');
  console.log(`📊 [PostHog Status] Active: ${Boolean(posthogClient)}`);
  console.log(`📊 [PostHog Env] Config.ENV: ${Config.ENV} | Stage: ${releaseStage}`);
  console.log('--------------------------------------------------');
}

// Disable debug logs for production stability
if (posthogClient) {
  posthogClient.debug(false);
}

/**
 * Default global properties attached to every tracked event.
 */
const commonProperties = {
  release_stage: releaseStage,
  platform: Platform.OS,
  app_version: DeviceInfo.getVersion(),
  app_build: DeviceInfo.getBuildNumber(),
};

/**
 * Safely captures a custom analytics event to PostHog.
 * No-op if `posthogClient` is not initialized (e.g., in development/staging).
 *
 * @param eventName - The name of the event to track.
 * @param properties - Additional metadata payload.
 */
export const trackPostHogEvent = (eventName: string, properties: Record<string, unknown> = {}) => {
  if (!posthogClient) {
    return;
  }

  posthogClient.capture(eventName, {
    ...commonProperties,
    ...properties,
  });

  posthogClient.flush();
};

/**
 * Safely tracks screen view navigation events.
 *
 * @param screenName - The identifier/name of the rendered screen.
 * @param properties - Optional screen-related context (e.g., previous_screen_name).
 */
export const trackScreenView = (screenName: string, properties: Record<string, unknown> = {}) => {
  trackPostHogEvent('screen_viewed', {
    screen_name: screenName,
    ...properties,
  });
};

/**
 * Strips non-numeric characters from a raw phone string.
 */
const normalizePhoneNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

/**
 * Masks a phone number for privacy logging purposes (e.g., "0812****5678").
 */
const maskPhoneNumber = (phone: string) => {
  const normalized = normalizePhoneNumber(phone);

  if (normalized.length <= 4) {
    return normalized;
  }

  return `${normalized.slice(0, 2)}${'*'.repeat(Math.max(normalized.length - 4, 0))}${normalized.slice(-2)}`;
};

/**
 * Identifies the current user in PostHog using their normalized phone number as distinct ID.
 *
 * @param phoneNumber - The user's phone number.
 * @param properties - Additional user profile traits.
 */
export const identifyPostHogUser = (
  phoneNumber: string,
  properties: Record<string, unknown> = {},
) => {
  if (!posthogClient) {
    return;
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    return;
  }

  const maskedPhone = maskPhoneNumber(normalizedPhone);

  try {
    posthogClient.identify(normalizedPhone, {
      phone_number: normalizedPhone,
      phone_number_masked: maskedPhone,
      ...properties,
    });

    posthogClient.flush();
  } catch (error) {
    if (__DEV__) {
      console.error('[PostHog] Failed to identify user:', error);
    }
  }
};

/**
 * Categorizes a monetary value into predefined statistical ranges for analytics segmenting.
 *
 * @param value - The numerical or string amount.
 * @returns Range string descriptor.
 */
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
