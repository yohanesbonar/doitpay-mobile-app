import { useMutation } from '@tanstack/react-query';
import {
  authApi,
  LoginOtpRequestPayload,
  LoginOtpResponse,
  LoginOtpVerifyPayload,
  LoginOtpVerifyResponse,
  LoginPayload,
  LoginResponse,
  RegisterOtpRequestPayload,
  RegisterOtpResponse,
  RegisterOtpVerifyPayload,
  RegisterOtpVerifyResponse,
  RegisterPinSetupPayload,
  RegisterPinSetupResponse,
  ForgotPinOtpRequestPayload,
  ForgotPinOtpRequestResponse,
  ForgotPinOtpVerifyPayload,
  ForgotPinOtpVerifyResponse,
  ForgotPinResetPayload,
  ForgotPinResetResponse,
  DeleteAccountOtpRequestPayload,
  DeleteAccountOtpRequestResponse,
  DeleteAccountOtpVerifyPayload,
  DeleteAccountOtpVerifyResponse,
  DeleteAccountPayload,
  DeleteAccountResponse,
  CancelAccountDeletionResponse,
  ChangePinPayload,
  ChangePinResponse,
} from '../api/auth';
import { setStorageItem, storage, StorageKey } from '../storage';
import { useAuthStore } from '../storage/useAuthStore';
import { Platform } from 'react-native';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { useUpdateDeviceToken } from './useDeviceMutation';
import Toast from 'react-native-toast-message';

export const useRegisterRequestOtp = () => {
  return useMutation<RegisterOtpResponse, Error, RegisterOtpRequestPayload>({
    mutationFn: (payload) => authApi.registerRequestOtp(payload),
    onSuccess: (data) => {
      console.log('useRegisterRequestOtp data.message:', data.message);
      console.log('useRegisterRequestOtp data', data);
    },
    onError: (error) => {
      console.log('error useRegisterRequestOtp', error);
      console.error('useRegisterRequestOtp Request failed:', error.message);
    },
  });
};

export const useRegisterVerifyOtp = () => {
  return useMutation<RegisterOtpVerifyResponse, Error, RegisterOtpVerifyPayload>({
    mutationFn: (payload) => authApi.registerVerifyOtp(payload),
    onSuccess: (data) => {
      console.log('useRegisterVerifyOtp data.message:', data.message);
      console.log('useRegisterVerifyOtp data', data);

      const session = data?.data;

      if (session?.verificationToken) {
        setStorageItem(StorageKey.ACCESS_TOKEN, session.verificationToken);

        console.log('useRegisterVerifyOtp ACCESS_TOKEN saved to MMKV');
      }
    },
    onError: (error) => {
      console.log('error useRegisterVerifyOtp', error);
      console.error('useRegisterVerifyOtp Request failed:', error.message);
    },
  });
};

export const useRegisterPinSetup = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setExpiresAt = useAuthStore((state) => state.setExpiresAt);
  const { mutate: updateDeviceToken } = useUpdateDeviceToken();

  const requestFcmToken = async () => {
    const existingToken = storage.getString(StorageKey.FCM_TOKEN);
    if (existingToken) {
      return existingToken;
    }

    try {
      const token = await getToken(getMessaging());
      if (token) {
        setStorageItem(StorageKey.FCM_TOKEN, token);
        return token;
      }
    } catch (error) {
      console.error('useRegisterPinSetup: failed to request FCM token', error);
    }

    return null;
  };

  const sendFcmTokenToBackend = async () => {
    const fcmToken = await requestFcmToken();
    if (!fcmToken) {
      console.log('useRegisterPinSetup: no FCM token available, skipping device update');
      return;
    }

    updateDeviceToken({
      fcmToken,
      platform: Platform.OS as 'ios' | 'android',
    });
  };

  return useMutation<RegisterPinSetupResponse, Error, RegisterPinSetupPayload>({
    mutationFn: (payload) => authApi.registerPinSetup(payload),
    onSuccess: (data) => {
      console.log('useRegisterPinSetup data.message:', data?.message);
      console.log('useRegisterPinSetup data', data);

      Toast.show({
        type: 'success',
        text1: 'Register Berhasil',
      });

      const session = data?.data;

      if (session?.accessToken) {
        setToken(session.accessToken, true);
      }
      if (session?.refreshToken) {
        setStorageItem(StorageKey.REFRESH_TOKEN, session.refreshToken);
      }
      if (session?.expiresAt) {
        setExpiresAt(session.expiresAt);
      }

      sendFcmTokenToBackend();
    },
    onError: (error) => {
      console.log('error useRegisterPinSetup', error);
      console.error('useRegisterPinSetup Request failed:', error?.message);
    },
  });
};

export const useLoginRequestOtp = () => {
  return useMutation<LoginOtpResponse, Error, LoginOtpRequestPayload>({
    mutationFn: (payload) => authApi.loginRequestOtp(payload),
    onSuccess: (data) => {
      console.log('useLoginRequestOtp data.message:', data.message);
      console.log('useLoginRequestOtp data', data);
    },
    onError: (error) => {
      console.log('error useLoginRequestOtp', error);
      console.error('useLoginRequestOtp Request failed:', error.message);
    },
  });
};

export const useLoginVerifyOtp = () => {
  return useMutation<LoginOtpVerifyResponse, Error, LoginOtpVerifyPayload>({
    mutationFn: (payload) => authApi.loginVerifyOtp(payload),
    onSuccess: (data) => {
      console.log('useLoginVerifyOtp sent data.message:', data.message);
      console.log('useLoginVerifyOtp sent data', data);

      const session = data?.data;

      if (session?.verificationToken) {
        setStorageItem(StorageKey.ACCESS_TOKEN, session.verificationToken);

        console.log('useLoginVerifyOtp ACCESS_TOKEN saved to MMKV');
      }
    },
    onError: (error) => {
      console.log('error useLoginVerifyOtp', error);
      console.error('useLoginVerifyOtp Request failed:', error.message);
    },
  });
};

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setExpiresAt = useAuthStore((state) => state.setExpiresAt);
  const { mutate: updateDeviceToken } = useUpdateDeviceToken();

  const requestFcmToken = async () => {
    const existingToken = storage.getString(StorageKey.FCM_TOKEN);
    if (existingToken) {
      return existingToken;
    }

    try {
      const token = await getToken(getMessaging());
      if (token) {
        setStorageItem(StorageKey.FCM_TOKEN, token);
        return token;
      }
    } catch (error) {
      console.error('useLogin: failed to request FCM token', error);
    }

    return null;
  };

  const sendFcmTokenToBackend = async () => {
    const fcmToken = await requestFcmToken();
    if (!fcmToken) {
      console.log('useLogin: no FCM token available, skipping device update');
      return;
    }

    updateDeviceToken({
      fcmToken,
      platform: Platform.OS as 'ios' | 'android',
    });
  };

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      console.log('LOGIN data.message:', data.message);
      console.log('LOGIN data', data);

      const session = data?.data;

      if (session?.accessToken) {
        setToken(session.accessToken);
      }
      if (session?.refreshToken) {
        setStorageItem(StorageKey.REFRESH_TOKEN, session.refreshToken);
      }
      if (session?.expiresAt) {
        setExpiresAt(session.expiresAt);
      }

      sendFcmTokenToBackend();
    },
    onError: (error) => {
      console.log('error login', error);
      console.error('error login:', error.message);
    },
  });
};

export const useForgotPinRequestOtp = () => {
  return useMutation<ForgotPinOtpRequestResponse, Error, ForgotPinOtpRequestPayload>({
    mutationFn: (payload) => authApi.forgotPinRequestOtp(payload),
  });
};

export const useForgotPinVerifyOtp = () => {
  return useMutation<ForgotPinOtpVerifyResponse, Error, ForgotPinOtpVerifyPayload>({
    mutationFn: (payload) => authApi.forgotPinVerifyOtp(payload),
    onSuccess: (data) => {
      const session = data?.data;
      if (session?.verificationToken) {
        setStorageItem(StorageKey.ACCESS_TOKEN, session.verificationToken);
      }
    },
  });
};

export const useForgotPinReset = () => {
  return useMutation<ForgotPinResetResponse, Error, ForgotPinResetPayload>({
    mutationFn: (payload) => authApi.forgotPinReset(payload),
  });
};

export const useDeleteAccountRequestOtp = () => {
  return useMutation<DeleteAccountOtpRequestResponse, Error, DeleteAccountOtpRequestPayload>({
    mutationFn: (payload) => authApi.deleteAccountRequestOtp(payload),
  });
};

export const useDeleteAccountVerifyOtp = () => {
  return useMutation<DeleteAccountOtpVerifyResponse, Error, DeleteAccountOtpVerifyPayload>({
    mutationFn: (payload) => authApi.deleteAccountVerifyOtp(payload),
  });
};

export const useDeleteAccount = () => {
  return useMutation<DeleteAccountResponse, Error, DeleteAccountPayload>({
    mutationFn: (payload) => authApi.deleteAccount(payload),
  });
};

export const useCancelAccountDeletion = () => {
  return useMutation<CancelAccountDeletionResponse, Error, void>({
    mutationFn: () => authApi.cancelAccountDeletion(),
  });
};

export const useChangePin = () => {
  return useMutation<ChangePinResponse, Error, ChangePinPayload>({
    mutationFn: (payload) => authApi.changePin(payload),
  });
};
