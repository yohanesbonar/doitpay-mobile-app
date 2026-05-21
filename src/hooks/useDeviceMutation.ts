import { deviceApi, UpdateDeviceHeader, UpdateDevicePayload, UpdateDeviceResponse } from '@/api/device';
import { useMutation } from '@tanstack/react-query';

export const useUpdateDeviceToken = () => {
  return useMutation<UpdateDeviceResponse, Error, UpdateDevicePayload>({
    mutationFn: async (payload) => {
      return await deviceApi.updateDeviceToken(payload);
    },
    onSuccess: (data) => {
      console.log('Device token synced successfully via global interceptor:', data);
    },
  });
};