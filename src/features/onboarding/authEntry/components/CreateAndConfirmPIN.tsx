import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NumericPinKeypad } from '@/components/molecules/NumericPinKeypad';

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
  biometricAction?: React.ReactNode;
  onBiometricLoginPress?: () => void;
  isBiometricLoginPending?: boolean;
  showNumericKeypad?: boolean;
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
  biometricAction,
  onBiometricLoginPress,
  isBiometricLoginPending,
  showNumericKeypad = false,
  PIN_LENGTH,
}: CreateAndConfirmPINProps) => {
  const { t } = useTranslation();
  const currentPin = step === 3 ? pin : confirmationPin;

  const handleDigitPress = (digit: string) => {
    if (currentPin.length < PIN_LENGTH) onChangeText(`${currentPin}${digit}`);
  };

  const handleDeletePress = () => {
    onChangeText(currentPin.slice(0, -1));
  };

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
      {showNumericKeypad ? (
        <View style={[styles.dotsContainer, { marginTop: 56 }]}>
          {renderDotsPIN(currentPin, isErrorPIN)}
        </View>
      ) : (
        <Pressable style={styles.dotsContainer} onPress={handlePressPIN}>
          {renderDotsPIN(currentPin, isErrorPIN)}
        </Pressable>
      )}

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
        editable={!showNumericKeypad}
        autoFocus={!showNumericKeypad && !(step === 4 && isLoginState && biometricLoginAvailable)}
      />
      {showNumericKeypad ? (
        <NumericPinKeypad
          onDigitPress={handleDigitPress}
          onDeletePress={handleDeletePress}
          deleteAccessibilityLabel={t('appLock.deleteLastDigit')}
          leftAction={step === 4 && isLoginState ? biometricAction : undefined}
          onLeftActionPress={onBiometricLoginPress}
          isLeftActionPending={Boolean(isBiometricLoginPending)}
          disabled={Boolean(isBiometricLoginPending)}
        />
      ) : step === 4 && isLoginState && biometricLoginAvailable && biometricAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onBiometricLoginPress}
          disabled={isBiometricLoginPending}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
          }}>
          {isBiometricLoginPending ? <ActivityIndicator color="#4A80F0" /> : biometricAction}
        </Pressable>
      ) : null}
      {Boolean(onForgotPinPress) && (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 32,
            gap: 4,
          }}>
          <Text>Lupa PIN?</Text>
          <TouchableOpacity onPress={onForgotPinPress}>
            <Text style={{ color: '#3981FF', fontWeight: '700' }}>Reset PIN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateAndConfirmPIN;
