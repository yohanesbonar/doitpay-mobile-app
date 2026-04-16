import { useMutation } from '@tanstack/react-query';
import { requestOtp, OtpRequestPayload, OtpResponse } from '../api/auth';

export const useRequestOtp = () => {
  return useMutation<OtpResponse, Error, OtpRequestPayload>({
    mutationFn: requestOtp,
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
