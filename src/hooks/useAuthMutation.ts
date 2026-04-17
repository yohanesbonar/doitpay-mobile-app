import { useMutation } from '@tanstack/react-query';
import { authApi, OtpRequestPayload, OtpResponse } from '../api/auth';

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