import React from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Fingerprint } from 'lucide-react-native';

interface CreateAndConfirmPINProps {
  step: number;
  isLoginState: boolean;
  pin: string;
  confirmationPin: string;
  isErrorPIN: boolean;
  styles: any;
  inputRef: React.RefObject<TextInput | null>;
  handlePressPIN: () => void;
  renderDotsPIN: (code: string, hasError: boolean) => React.ReactNode;
  onChangeText: (text: string) => void;
  onForgotPinPress?: () => void;
  biometricLoginAvailable?: boolean;
  isBiometricLoginPending?: boolean;
  onBiometricLoginPress?: () => void;
  PIN_LENGTH: number;
}

const CreateAndConfirmPIN = ({
  step,
  isLoginState,
  pin,
  confirmationPin,
  isErrorPIN,
  styles,
  inputRef,
  handlePressPIN,
  renderDotsPIN,
  onChangeText,
  onForgotPinPress,
  biometricLoginAvailable,
  isBiometricLoginPending,
  onBiometricLoginPress,
  PIN_LENGTH,
}: CreateAndConfirmPINProps) => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={styles.titleStep}>
        {t(
          step === 4 && isLoginState
            ? 'authEntry.inputPIN'
            : step === 3
              ? 'authEntry.createPIN'
              : 'authEntry.confirmationPIN',
        )}
      </Text>
      <Text style={styles.descStep}>
        {t(
          step === 4 && isLoginState
            ? 'authEntry.descInputPIN'
            : step === 3
              ? 'authEntry.descCreatePIN'
              : 'authEntry.descConfirmationPIN',
        )}
      </Text>
      <Pressable style={styles.dotsContainer} onPress={handlePressPIN}>
        {renderDotsPIN(step === 3 ? pin : confirmationPin, isErrorPIN)}
      </Pressable>

      {step === 4 && isErrorPIN && (
        <Text style={styles.errorTextPIN}>
          PIN yang Anda masukan tidak cocok. Silakan coba lagi.
        </Text>
      )}

      <TextInput
        ref={inputRef}
        value={step === 3 ? pin : confirmationPin}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={PIN_LENGTH}
        style={styles.hiddenInput}
        autoFocus={true}
      />
      {Boolean(onForgotPinPress) && (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 18,
            gap: 4,
          }}>
          <Text>Lupa PIN?</Text>
          <TouchableOpacity onPress={onForgotPinPress}>
            <Text style={{ color: '#3981FF', fontWeight: '700' }}>Reset PIN</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 4 && isLoginState && biometricLoginAvailable && (
        <TouchableOpacity
          onPress={onBiometricLoginPress}
          disabled={isBiometricLoginPending}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            opacity: isBiometricLoginPending ? 0.5 : 1,
          }}>
          <Fingerprint size={20} color="#3981FF" />
          <Text style={{ color: '#3981FF', fontWeight: '700' }}>
            {t('authEntry.loginWithBiometrics')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateAndConfirmPIN;
