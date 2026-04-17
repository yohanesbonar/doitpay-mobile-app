import { useMutation } from '@tanstack/react-query';
import { authApi, OtpRequestPayload, OtpResponse, OtpVerifyPayload, OtpVerifyResponse } from '../api/auth';

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
    },
    onError: (error) => {
      console.log('error useVerifyOtp', error);
      console.error('useVerifyOtp Request failed:', error.message);
    },
  })
}