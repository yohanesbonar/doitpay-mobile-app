import apiClient from './client';

export type OtpRequestPayload = {
  phoneNumber: string;
  method: string;
};

export type OtpResponse = {
  status: string;
  message: string;
  data: {
    resendAfterSeconds: number;
  };
};

export const requestOtp = async (payload: OtpRequestPayload): Promise<OtpResponse> => {
  const { data } = await apiClient.post<OtpResponse>('/v1/onboarding/otp/request', payload);
  return data;
};