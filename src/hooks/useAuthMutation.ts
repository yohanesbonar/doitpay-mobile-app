import { useMutation } from '@tanstack/react-query';
import { authApi, OtpRequestPayload, OtpResponse, OtpVerifyPayload, OtpVerifyResponse, PinSetupPayload, PinSetupResponse } from '../api/auth';
import { setStorageItem, StorageKey } from '../storage';

export const useRequestOtp = () => {
  return useMutation<OtpResponse, Error, OtpRequestPayload>({
    mutationFn: (payload) => authApi.requestOtp(payload), 
    onSuccess: (data) => {
      console.log('OTP sent data.message:', data.message);
      console.log('OTP sent data', data);
    },
    onError: (error) => {
      console.log('error useRequestOtp', error);
      console.error('Request failed:', error.message);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation<OtpVerifyResponse, Error, OtpVerifyPayload>({
    mutationFn: (payload) => authApi.verifyOtp(payload), 
    onSuccess: (data) => {
      console.log('useVerifyOtp sent data.message:', data.message);
      console.log('useVerifyOtp sent data', data);

      const session = data?.data;

      if (session?.verificationToken) {
        setStorageItem(StorageKey.VERIFICATION_TOKEN, session.verificationToken);
        
        console.log('VERIFICATION_TOKEN saved to MMKV');
      }
    },
    onError: (error) => {
      console.log('error useVerifyOtp', error);
      console.error('useVerifyOtp Request failed:', error.message);
    },
  })
}

export const usePinSetup = () => {
  return useMutation<PinSetupResponse, Error, PinSetupPayload>({
    mutationFn: (payload) => authApi.pinSetup(payload), 
    onSuccess: (data) => {
      console.log('usePinSetup sent data.message:', data?.message);
      console.log('usePinSetup sent data', data);

      const session = data?.data;

      if (session?.accessToken) {
        setStorageItem(StorageKey.ACCESS_TOKEN, session.accessToken);
        setStorageItem(StorageKey.REFRESH_TOKEN, session.refreshToken);
        
        console.log('ACCESS_TOKEN & REFRESH_TOKEN saved to MMKV');
      }
    },
    onError: (error) => {
      console.log('error usePinSetup', error);
      console.error('usePinSetup Request failed:', error?.message);
    },
  })
}