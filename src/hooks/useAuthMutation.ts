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
} from '../api/auth';
import { setStorageItem, StorageKey } from '../storage';
import { useAuthStore } from '../storage/useAuthStore';
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
        setStorageItem(StorageKey.VERIFICATION_TOKEN, session.verificationToken);

        console.log('useRegisterVerifyOtp VERIFICATION_TOKEN saved to MMKV');
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
      if (session?.expiresAt) {
        setExpiresAt(session.expiresAt);
      }
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
        setStorageItem(StorageKey.VERIFICATION_TOKEN, session.verificationToken);

        console.log('useLoginVerifyOtp VERIFICATION_TOKEN saved to MMKV');
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
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      console.log('LOGIN data.message:', data.message);
      console.log('LOGIN data', data);

      const session = data?.data;

      if (session?.accessToken) {
        setToken(session.accessToken);
      }
      if (session?.expiresAt) {
        setExpiresAt(session.expiresAt);
      }
    },
    onError: (error) => {
      console.log('error login', error);
      console.error('error login:', error.message);
    },
  });
};
