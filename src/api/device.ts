import apiClient from './client';

export interface UpdateDevicePayload {
  fcmToken: string;
  platform: 'ios' | 'android';
}

export interface UpdateDeviceHeader {
  deviceId: string;
}

export interface UpdateDeviceResponse {
  status: 'success' | 'failed';
  data: Record<string, never>;
  message: string;
}

export const deviceApi = {
  updateDeviceToken: async (payload: UpdateDevicePayload): Promise<UpdateDeviceResponse> => {
    const { data } = await apiClient.put<UpdateDeviceResponse>('/v1/devices', payload);
    return data;
  },
};
