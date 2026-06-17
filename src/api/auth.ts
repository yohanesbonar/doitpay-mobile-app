import apiClient from './client';
import { generateUUID } from '@/utils/uuid';

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
    retryAfterSeconds: number;
  };
};

export type RegisterOtpVerifyResponse = {
  status: string;
  message: string;
  data: {
    verificationToken: string;
    session: {
      currentStep: string;
      expiresAt: string;
      sessionId: string;
    };
  };
};

export type RegisterPinSetupResponse = {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
};

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
    retryAfterSeconds: number;
  };
};

export type LoginOtpVerifyResponse = {
  status: string;
  message: string;
  data: {
    verificationToken: string;
    session: {
      currentStep: string;
      expiresAt: string;
      sessionId: string;
    };
  };
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
};

//Refresh Token
export interface RefreshTokenPayload {
  refreshToken: string;
}

export type RefreshTokenResponse = {
  status: string;
  message: string;
  data: {
    accessToken: string;
    expiresAt: string;
    refreshToken: string;
  };
};

// FORGOT PIN
export interface ForgotPinOtpRequestPayload {
  phoneNumber: string;
  method: 'SMS' | 'WHATSAPP';
}

export type ForgotPinOtpRequestResponse = {
  status: string;
  message: string;
  data: {
    retryAfterSeconds: number;
  };
};

export interface ForgotPinOtpVerifyPayload {
  phoneNumber: string;
  otpCode: string;
}

export type ForgotPinOtpVerifyResponse = {
  status: string;
  message: string;
  data: {
    verificationToken: string;
  };
};

export interface ForgotPinResetPayload {
  pin: string;
}

export type ForgotPinResetResponse = {
  status: string;
  message: string;
  data: {};
};

// DELETE ACCOUNT
export interface DeleteAccountOtpRequestPayload {
  method: 'SMS' | 'WHATSAPP';
}

export type DeleteAccountOtpRequestResponse = {
  status: string;
  message: string;
  data: {
    retryAfterSeconds: number;
  };
};

export interface DeleteAccountOtpVerifyPayload {
  otpCode: string;
}

export type DeleteAccountOtpVerifyResponse = {
  status: string;
  message: string;
  data: {
    expiresAt: string;
    verificationToken: string;
  };
};

export interface DeleteAccountPayload {
  pin: string;
  reason: string;
  verifyToken: string;
}

export type DeleteAccountResponse = {
  status: string;
  message: string;
  data: {};
};

export type CancelAccountDeletionResponse = {
  status: string;
  message: string;
  data: {};
};

export type LogoutResponse = {
  status: string;
  message: string;
  data: {};
};

// CHANGE PIN
export interface ChangePinPayload {
  oldPin: string;
  newPin: string;
}

export type ChangePinResponse = {
  status: string;
  message: string;
  data: {};
};

export const authApi = {
  registerRequestOtp: async (payload: RegisterOtpRequestPayload): Promise<RegisterOtpResponse> => {
    const { data } = await apiClient.post<RegisterOtpResponse>(
      '/v1/onboarding/otp/request',
      payload,
      { noNeedAuth: true },
    );
    return data;
  },
  registerVerifyOtp: async (
    payload: RegisterOtpVerifyPayload,
  ): Promise<RegisterOtpVerifyResponse> => {
    const { data } = await apiClient.post<RegisterOtpVerifyResponse>(
      '/v1/onboarding/otp/verify',
      payload,
      { noNeedAuth: true },
    );
    return data;
  },
  registerPinSetup: async (payload: RegisterPinSetupPayload): Promise<RegisterPinSetupResponse> => {
    const { data } = await apiClient.post<RegisterPinSetupResponse>(
      '/v1/onboarding/pin-setup',
      payload,
    );
    return data;
  },
  loginRequestOtp: async (payload: LoginOtpRequestPayload): Promise<LoginOtpResponse> => {
    const { data } = await apiClient.post<LoginOtpResponse>('v1/auth/login/otp/request', payload, {
      noNeedAuth: true,
    });
    return data;
  },
  loginVerifyOtp: async (payload: LoginOtpVerifyPayload): Promise<LoginOtpVerifyResponse> => {
    const { data } = await apiClient.post<LoginOtpVerifyResponse>(
      'v1/auth/login/otp/verify',
      payload,
      { noNeedAuth: true },
    );
    return data;
  },
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('v1/auth/login', payload);
    return data;
  },
  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>('v1/auth/refresh', payload);
    return data;
  },
  forgotPinRequestOtp: async (
    payload: ForgotPinOtpRequestPayload,
  ): Promise<ForgotPinOtpRequestResponse> => {
    const { data } = await apiClient.post<ForgotPinOtpRequestResponse>(
      '/v1/pin/forgot/otp/request',
      payload,
      { noNeedAuth: true },
    );
    return data;
  },
  forgotPinVerifyOtp: async (
    payload: ForgotPinOtpVerifyPayload,
  ): Promise<ForgotPinOtpVerifyResponse> => {
    const { data } = await apiClient.post<ForgotPinOtpVerifyResponse>(
      '/v1/pin/forgot/otp/verify',
      payload,
      { noNeedAuth: true },
    );
    return data;
  },
  forgotPinReset: async (payload: ForgotPinResetPayload): Promise<ForgotPinResetResponse> => {
    const { data } = await apiClient.post<ForgotPinResetResponse>('/v1/pin/reset', payload, {
      headers: { 'X-Idempotency-Key': generateUUID() },
    });
    return data;
  },
  deleteAccountRequestOtp: async (
    payload: DeleteAccountOtpRequestPayload,
  ): Promise<DeleteAccountOtpRequestResponse> => {
    const { data } = await apiClient.post<DeleteAccountOtpRequestResponse>(
      '/v1/account/delete/otp/request',
      payload,
    );
    return data;
  },
  deleteAccountVerifyOtp: async (
    payload: DeleteAccountOtpVerifyPayload,
  ): Promise<DeleteAccountOtpVerifyResponse> => {
    const { data } = await apiClient.post<DeleteAccountOtpVerifyResponse>(
      '/v1/account/delete/otp/verify',
      payload,
    );
    return data;
  },
  deleteAccount: async ({
    verifyToken,
    ...body
  }: DeleteAccountPayload): Promise<DeleteAccountResponse> => {
    const { data } = await apiClient.post<DeleteAccountResponse>('/v1/account/delete', body, {
      headers: { 'Verify-Token': verifyToken },
    });
    return data;
  },
  cancelAccountDeletion: async (): Promise<CancelAccountDeletionResponse> => {
    const { data } = await apiClient.post<CancelAccountDeletionResponse>(
      '/v1/account/delete/cancel',
    );
    return data;
  },
  logout: async (accessToken: string): Promise<LogoutResponse> => {
    const { data } = await apiClient.post<LogoutResponse>('/v1/auth/logout', undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },
  changePin: async (payload: ChangePinPayload): Promise<ChangePinResponse> => {
    const { data } = await apiClient.post<ChangePinResponse>('/v1/pin/change', payload, {
      headers: { 'X-Idempotency-Key': generateUUID() },
    });
    return data;
  },
};
