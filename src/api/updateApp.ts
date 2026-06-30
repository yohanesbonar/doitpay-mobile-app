import apiClient from './client';
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
  latestChangelogs?: unknown;
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

const extractChangelogText = (item: unknown): string => {
  if (typeof item === 'string') {
    return item.trim();
  }

  if (item && typeof item === 'object') {
    const candidate = [
      (item as any).description,
      (item as any).text,
      (item as any).title,
      (item as any).changelog,
      (item as any).content,
      (item as any).label,
    ].find((value) => typeof value === 'string' && value.trim().length > 0);

    return typeof candidate === 'string' ? candidate.trim() : '';
  }

  return '';
};

const mapDescriptionList = (data?: VersionCheckApiData): string[] => {
  const source = data?.latestChangelogs ?? data?.description;
  const list = Array.isArray(source) ? source : source ? [source] : [];

  return list.map(extractChangelogText).filter((item) => item.length > 0);
};

const mapVersionCheckData = (data?: VersionCheckApiData): UpdateAppData => {
  const normalizedAction = normalizeAction(data?.action);
  const latestVersion = data?.latest_version ?? data?.latestVersion;
  const minimumVersion = data?.minimum_version ?? data?.minimumVersion;
  const finalAction = normalizedAction;
  const descriptionList = mapDescriptionList(data);

  logUpdateDebug('Version decision', {
    rawAction: data?.action,
    finalAction,
    latestVersion,
    minimumVersion,
    decision: 'use action from API response',
  });

  return {
    action: finalAction,
    latest_version: latestVersion,
    minimum_version: minimumVersion,
    description: descriptionList,
    latestChangelogs: descriptionList,
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
