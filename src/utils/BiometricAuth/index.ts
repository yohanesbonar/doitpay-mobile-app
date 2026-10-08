import * as Keychain from 'react-native-keychain';

const BIOMETRIC_LOGIN_SERVICE = 'com.doitpay.mobile.biometric-login';

export interface BiometricLoginCredential {
  phoneNumber: string;
  pin: string;
}

export const getSupportedBiometryType = () => Keychain.getSupportedBiometryType();

export const saveBiometricLoginCredential = async (
  phoneNumber: string,
  pin: string,
  promptTitle: string,
) => {
  const result = await Keychain.setGenericPassword(phoneNumber, pin, {
    service: BIOMETRIC_LOGIN_SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    authenticationPrompt: { title: promptTitle },
  });

  if (!result) {
    throw new Error('Could not store biometric login credentials securely.');
  }
};

export const getBiometricLoginCredential = async (
  promptTitle: string,
): Promise<BiometricLoginCredential | null> => {
  const result = await Keychain.getGenericPassword({
    service: BIOMETRIC_LOGIN_SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    authenticationPrompt: { title: promptTitle },
  });

  if (!result) return null;

  return {
    phoneNumber: result.username,
    pin: result.password,
  };
};

export const clearBiometricLoginCredential = async () => {
  const hasCredential = await Keychain.hasGenericPassword({
    service: BIOMETRIC_LOGIN_SERVICE,
  });

  if (!hasCredential) return;

  const wasRemoved = await Keychain.resetGenericPassword({
    service: BIOMETRIC_LOGIN_SERVICE,
  });

  if (!wasRemoved) {
    throw new Error('Could not remove biometric login credentials.');
  }
};
