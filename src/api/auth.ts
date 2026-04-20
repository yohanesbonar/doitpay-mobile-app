import apiClient from './client';

export interface OtpRequestPayload {
  phoneNumber: string;
  method: 'SMS' | 'WHATSAPP';
}

export interface OtpVerifyPayload {
  phoneNumber: string;
  otpCode: string;
}

export interface PinSetupPayload {
  phoneNumber: string;
  pin: string;
}

export type OtpResponse = {
  status: string;
  message: string;
  data: {
    resendAfterSeconds: number;
  };
};

export type OtpVerifyResponse = {
  status: string;
  message: string;
  data: {
    verificationToken: string;
    session: {
      currentStep: string;
      expiredAt: string;
      sessionId: string;
    }
  };
};

export type PinSetupResponse = {
  status: string;
  message: string;
  data: {
    verificationToken: string;
    session: {
      accessToken: string;
      expiredIn: string;
      refreshToken: string;
    }
  };
}

export const authApi = {
  requestOtp: async (payload: OtpRequestPayload): Promise<OtpResponse> => {
    const { data } = await apiClient.post<OtpResponse>('/v1/onboarding/otp/request', payload);
    return data;
  },
  verifyOtp: async (payload: OtpVerifyPayload): Promise<OtpVerifyResponse> => {
    const { data } = await apiClient.post<OtpVerifyResponse>('/v1/onboarding/otp/verify', payload);
    return data;
  },
  pinSetup: async (payload: PinSetupPayload): Promise<PinSetupResponse> => {
    const { data } = await apiClient.post<PinSetupResponse>('/v1/onboarding/pin-setup', payload);
    return data; 
  }
  // Contoh penambahan fungsi lain nanti:
  // login: (credentials) => apiClient.post('/login', credentials),
};