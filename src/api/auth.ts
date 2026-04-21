import apiClient from './client';

// REGISTER
export interface RegisterOtpRequestPayload {
  phoneNumber: string;
  method: 'SMS' | 'WHATSAPP';
}

export interface RegisterOtpVerifyPayload {
  phoneNumber: string;
  otpCode: string;
}

export interface RegisterPinSetupPayload {
  phoneNumber: string;
  pin: string;
}

export type RegisterOtpResponse = {
  status: string;
  message: string;
  data: {
    resendAfterSeconds: number;
  };
};

export type RegisterOtpVerifyResponse = {
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

export type RegisterPinSetupResponse = {
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

// LOGIN
export interface LoginOtpRequestPayload {
  phoneNumber: string;
  method: 'SMS' | 'WHATSAPP';
}

export interface LoginOtpVerifyPayload {
  phoneNumber: string;
  otpCode: string;
}

export interface LoginPayload {
  phoneNumber: string;
  pin: string;
}

export type LoginOtpResponse = {
  status: string;
  message: string;
  data: {
    resendAfterSeconds: number;
  };
};

export type LoginOtpVerifyResponse = {
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

export type LoginResponse = {
  status: string; 
  message: string;
  data: {

  }
}



export const authApi = {
  registerRequestOtp: async (payload: RegisterOtpRequestPayload): Promise<RegisterOtpResponse> => {
    const { data } = await apiClient.post<RegisterOtpResponse>('/v1/onboarding/otp/request', payload);
    return data;
  },
  registerVerifyOtp: async (payload: RegisterOtpVerifyPayload): Promise<RegisterOtpVerifyResponse> => {
    const { data } = await apiClient.post<RegisterOtpVerifyResponse>('/v1/onboarding/otp/verify', payload);
    return data;
  },
  registerPinSetup: async (payload: RegisterPinSetupPayload): Promise<RegisterPinSetupResponse> => {
    const { data } = await apiClient.post<RegisterPinSetupResponse>('/v1/onboarding/pin-setup', payload);
    return data; 
  }, 
  loginRequestOtp: async (payload: LoginOtpRequestPayload): Promise<LoginOtpResponse> => {
    const { data } = await apiClient.post<LoginOtpResponse>('v1/auth/login/otp/request', payload);
    return data;
  },
  loginVerifyOtp: async (payload: LoginOtpVerifyPayload): Promise<LoginOtpVerifyResponse> => {
    const { data } = await apiClient.post<LoginOtpVerifyResponse>('v1/auth/login/otp/verify', payload);
    return data;
  }, 
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('v1/auth/login', payload);
    return data;
  }
  // Contoh penambahan fungsi lain nanti:
  // login: (credentials) => apiClient.post('/login', credentials),
};