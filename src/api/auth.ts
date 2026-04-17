import apiClient from './client';

export interface OtpRequestPayload {
  phoneNumber: string;
  method: 'SMS' | 'WHATSAPP';
}

export type OtpResponse = {
  status: string;
  message: string;
  data: {
    resendAfterSeconds: number;
  };
};

export const authApi = {
  requestOtp: async (payload: OtpRequestPayload): Promise<OtpResponse> => {
    const { data } = await apiClient.post<OtpResponse>('/v1/onboarding/otp/request', payload);
    return data;
  },
  // Contoh penambahan fungsi lain nanti:
  // login: (credentials) => apiClient.post('/login', credentials),
};