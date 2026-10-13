import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '@/features/onboarding/authEntry/styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import CreateAndConfirmPIN from '@/features/onboarding/authEntry/components/CreateAndConfirmPIN';
import { useChangePin } from '@/hooks/useAuthMutation';
import { NumericPinKeypad } from '@/components/molecules/NumericPinKeypad';
import { useTranslation } from 'react-i18next';
import { navigationRef } from '@/navigation/navigationRef';

const PIN_LENGTH = 6;

export const ChangePin = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [oldPin, setOldPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const { mutate: changePin, isPending } = useChangePin(() => {
    Keyboard.dismiss();
    try {
      if (navigationRef.isReady()) {
        navigationRef.resetRoot({
          index: 0,
          routes: [{ name: 'ChangePinSuccess' }],
        });
      } else {
        navigation.replace('ChangePinSuccess');
      }
    } catch (error) {
      console.error('Failed to open ChangePinSuccess after PIN change', error);
    }
  });

  useEffect(() => {
    if (currentStep === 1) setOldPin('');
    else if (currentStep === 3) setPin('');
    else if (currentStep === 4) setConfirmationPin('');
  }, [currentStep]);

  const renderDotsPIN = (code: string, hasError: boolean) =>
    Array.from({ length: PIN_LENGTH }).map((_, i) => (
      <View
        key={i}
        style={[styles.dot, i < code.length && styles.dotFilled, hasError && styles.dotError]}
      />
    ));

  const handleOldPinChange = (text: string) => {
    if (text.length > PIN_LENGTH) return;
    setOldPin(text);
    if (text.length === PIN_LENGTH) {
      setTimeout(() => setCurrentStep(3), 250);
    }
  };

  const currentPin = currentStep === 1 ? oldPin : currentStep === 3 ? pin : confirmationPin;
  const handleDigitPress = (digit: string) => {
    if (isPending || currentPin.length >= PIN_LENGTH) return;
    const nextPin = `${currentPin}${digit}`;
    if (currentStep === 1) handleOldPinChange(nextPin);
    else handlePINChange(nextPin);
  };
  const handleDeletePress = () => {
    if (isPending) return;
    const nextPin = currentPin.slice(0, -1);
    if (currentStep === 1) setOldPin(nextPin);
    else handlePINChange(nextPin);
  };

  function handlePINChange(text: string) {
    if (isErrorPIN) setIsErrorPIN(false);
    if (text.length > PIN_LENGTH) return;

    if (currentStep === 3) {
      setPin(text);
      if (text.length === PIN_LENGTH) {
        setTimeout(() => setCurrentStep(4), 250);
      }
      return;
    }

    setConfirmationPin(text);
    if (text.length === PIN_LENGTH) {
      if (text !== pin) {
        setIsErrorPIN(true);
        setConfirmationPin('');
        return;
      }
      changePin(
        { oldPin, newPin: text },
        {
          onError: (err: any) => {
            const code = err?.response?.data?.error?.code ?? err?.error?.code;
            const message = err?.response?.data?.error?.message ?? err?.error?.message;
            const remainingAttempts =
              err?.response?.data?.error?.remainingAttempts ?? err?.error?.remainingAttempts;

            setConfirmationPin('');
            setPin('');
            setOldPin('');
            setCurrentStep(1);

            if (code === 'PIN_LOCKED') {
              Toast.show({
                type: 'error',
                text1: message || 'PIN diblokir sementara',
                text2: 'Silakan coba lagi nanti',
                visibilityTime: 4000,
              });
              navigation.goBack();
              return;
            }

            Toast.show({
              type: 'error',
              text1: message || 'Gagal mengubah PIN',
              text2:
                typeof remainingAttempts === 'number'
                  ? `Sisa percobaan: ${remainingAttempts}`
                  : undefined,
            });
          },
        },
      );
    }
  }

  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={styles.titleStep}>Masukkan PIN lama</Text>
            <Text style={styles.descStep}>Masukkan PIN 6 digit kamu saat ini</Text>
            <View style={[styles.dotsContainer, { marginTop: 56 }]}>
              {renderDotsPIN(oldPin, false)}
            </View>
            <TextInput
              ref={inputRef}
              value={oldPin}
              editable={false}
              maxLength={PIN_LENGTH}
              style={styles.hiddenInput}
            />
            <NumericPinKeypad
              onDigitPress={handleDigitPress}
              onDeletePress={handleDeletePress}
              deleteAccessibilityLabel={t('appLock.deleteLastDigit')}
              disabled={isPending}
            />
          </View>
        );
      case 3:
      case 4:
        return (
          <CreateAndConfirmPIN
            step={currentStep}
            isLoginState={false}
            pin={pin}
            confirmationPin={confirmationPin}
            isErrorPIN={isErrorPIN}
            styles={styles}
            inputRef={inputRef}
            handlePressPIN={() => inputRef.current?.focus()}
            renderDotsPIN={renderDotsPIN}
            PIN_LENGTH={PIN_LENGTH}
            onChangeText={handlePINChange}
            showNumericKeypad
            disabled={isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
      <HeaderToolbar
        title="Ubah PIN"
        onPressBack={() => {
          if (currentStep === 3) setCurrentStep(1);
          else if (currentStep === 4) setCurrentStep(3);
          else navigation.goBack();
        }}
        titlePosition="center"
        titleStyle="medium"
      />
      {stepContent()}
    </View>
  );
};
