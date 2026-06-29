import apiClient from './client';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import type { ResponseApi } from './types';
import type { UpdateAction, UpdateAppData } from '@/components/molecules/UpdateAppBottomSheet';

interface VersionCheckApiData {
  action?: string;
  latestVersion?: string;
  latest_version?: string;
  minimumVersion?: string;
  minimum_version?: string;
  description?: string | string[];
  mandatory?: boolean;
  updateUrl?: string;
  update_url?: string;
}

const APP_UPDATE_URL_IOS_KEY = 'app_update_url_ios';
const APP_UPDATE_URL_ANDROID_KEY = 'app_update_url_android';

const logUpdateDebug = (label: string, payload?: Record<string, unknown>) => {
  if (!__DEV__) {
    return;
  }

  console.log(`[UpdateApp] ${label}`, payload ?? {});
};

const normalizeAction = (action?: string): UpdateAction => {
  if (!action) {
    return 'OK';
  }

  if (action === 'FORCE_UPDATE') {
    return 'FORCE_UPDATE';
  }

  if (action === 'SOFT_UPDATE' || action === 'FLEXIBLE_UPDATE') {
    return 'SOFT_UPDATE';
  }

  return 'OK';
};

const normalizeVersionString = (version?: string): string => {
  if (!version) {
    return '0.0.0';
  }

  return version.trim().replace(/^v/i, '');
};

const compareSemver = (currentVersion: string, targetVersion: string): number => {
  const currentParts = normalizeVersionString(currentVersion)
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
  const targetParts = normalizeVersionString(targetVersion)
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);

  const maxLength = Math.max(currentParts.length, targetParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const current = currentParts[index] ?? 0;
    const target = targetParts[index] ?? 0;

    if (current > target) {
      return 1;
    }

    if (current < target) {
      return -1;
    }
  }

  return 0;
};

const deriveActionByVersion = (
  defaultAction: UpdateAction,
  minimumVersion?: string,
  latestVersion?: string,
): UpdateAction => {
  const currentAppVersion = Config.VERSION_NAME ?? Config.APP_VERSION ?? '0.0.0';
  const compareWithMinimum = minimumVersion
    ? compareSemver(currentAppVersion, minimumVersion)
    : undefined;
  const compareWithLatest = latestVersion ? compareSemver(currentAppVersion, latestVersion) : undefined;

  let finalAction: UpdateAction;
  let decision = 'fallback to default action';

  if (typeof compareWithMinimum === 'number' && compareWithMinimum < 0) {
    finalAction = 'OK';
    decision = 'below minimum version';
  } else if (typeof compareWithLatest === 'number' && compareWithLatest < 0) {
    finalAction = defaultAction === 'FORCE_UPDATE' ? 'FORCE_UPDATE' : 'SOFT_UPDATE';
    decision = 'between minimum and latest version';
  } else if (minimumVersion || latestVersion) {
    finalAction = 'OK';
    decision = 'already at/above latest version';
  } else {
    finalAction = defaultAction;
  }

  logUpdateDebug('Version decision', {
    currentAppVersion,
    minimumVersion,
    latestVersion,
    compareWithMinimum,
    compareWithLatest,
    defaultAction,
    finalAction,
    decision,
  });

  return finalAction;
};

const getRemoteConfigUpdateUrl = async (): Promise<string | undefined> => {
  try {
    const rc = remoteConfig();

    await rc.setConfigSettings({
      fetchTimeMillis: 10_000,
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3_600_000,
    });

    await rc.setDefaults({
      [APP_UPDATE_URL_IOS_KEY]: '',
      [APP_UPDATE_URL_ANDROID_KEY]: '',
    });

    await rc.fetchAndActivate();

    const platformKey = Platform.OS === 'ios' ? APP_UPDATE_URL_IOS_KEY : APP_UPDATE_URL_ANDROID_KEY;
    const platformUrl = rc.getValue(platformKey).asString().trim();

    logUpdateDebug('Remote config URL fetched', {
      platform: Platform.OS,
      platformKey,
      hasPlatformUrl: Boolean(platformUrl),
      platformUrl,
    });

    if (platformUrl) {
      return platformUrl;
    }

    return undefined;
  } catch (error) {
    return undefined;
  }
};

const mapVersionCheckData = (data?: VersionCheckApiData): UpdateAppData => {
  const normalizedAction = normalizeAction(data?.action);
  const latestVersion = data?.latest_version ?? data?.latestVersion;
  const minimumVersion = data?.minimum_version ?? data?.minimumVersion;
  const finalAction = deriveActionByVersion(normalizedAction, minimumVersion, latestVersion);

  return {
    action: finalAction,
    latest_version: latestVersion,
    minimum_version: minimumVersion,
    description: data?.description,
    mandatory: finalAction === 'FORCE_UPDATE' ? true : (data?.mandatory ?? false),
    update_url: data?.update_url ?? data?.updateUrl,
  };
};

export const updateAppApi = {
  checkVersion: async (): Promise<UpdateAppData> => {
    let response;
    let endpointUsed = '/v1/app/version-check';

    try {
      response = await apiClient.get<ResponseApi<VersionCheckApiData>>('/v1/app/version-check');
    } catch (error: any) {
      if (error?.status === 404 || error?.response?.status === 404) {
        endpointUsed = '/v1/version/check';
        response = await apiClient.get<ResponseApi<VersionCheckApiData>>('/v1/version/check');
      } else {
        throw error;
      }
    }

    const { data } = response;

    const mappedData = mapVersionCheckData(data.data);
    const remoteConfigUrl = await getRemoteConfigUpdateUrl();

    logUpdateDebug('Version check result', {
      endpointUsed,
      rawAction: data?.data?.action,
      latestVersion: mappedData.latest_version,
      minimumVersion: mappedData.minimum_version,
      finalAction: mappedData.action,
      backendUpdateUrl: data?.data?.update_url ?? data?.data?.updateUrl,
      remoteConfigUrl,
      finalUpdateUrl: remoteConfigUrl ?? mappedData.update_url,
    });

    return {
      ...mappedData,
      update_url: remoteConfigUrl ?? mappedData.update_url,
    };
  },
};
