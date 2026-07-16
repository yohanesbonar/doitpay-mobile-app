import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '@/features/onboarding/authEntry/styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import CreateAndConfirmPIN from '@/features/onboarding/authEntry/components/CreateAndConfirmPIN';
import { useChangePin } from '@/hooks/useAuthMutation';
import { usePostHog } from 'posthog-react-native';

const PIN_LENGTH = 6;

export const ChangePin = () => {
  const posthog = usePostHog();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();

  const [currentStep, setCurrentStep] = useState(1);
  const [bottomSpacing, setBottomSpacing] = useState(32);

  const [oldPin, setOldPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const { mutate: changePin, isPending } = useChangePin();

  useEffect(() => {
    if (currentStep === 1) setOldPin('');
    else if (currentStep === 3) setPin('');
    else if (currentStep === 4) setConfirmationPin('');
  }, [currentStep]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, () => setBottomSpacing(16));
    const hideSub = Keyboard.addListener(hideEvt, () =>
      setBottomSpacing(Platform.OS === 'ios' ? 32 : -35),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  const handlePINChange = (text: string) => {
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
          onSuccess: () => {
            posthog.capture('pin_changed');
            Keyboard.dismiss();
            Toast.show({ type: 'success', text1: 'PIN berhasil diubah' });
            navigation.goBack();
          },
          onError: (err: any) => {
            setConfirmationPin('');
            setPin('');
            setOldPin('');
            setCurrentStep(1);
            Toast.show({ type: 'error', text1: err?.message || 'Gagal mengubah PIN' });
          },
        },
      );
    }
  };

  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={styles.titleStep}>Masukkan PIN lama</Text>
            <Text style={styles.descStep}>Masukkan PIN 6 digit kamu saat ini</Text>
            <Pressable style={styles.dotsContainer} onPress={() => inputRef.current?.focus()}>
              {renderDotsPIN(oldPin, false)}
            </Pressable>
            <TextInput
              ref={inputRef}
              value={oldPin}
              onChangeText={handleOldPinChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              style={styles.hiddenInput}
              autoFocus
              editable={!isPending}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: colors.pageBackground }}
        enabled>
        <View style={{ flex: 1 }}>
          <HeaderToolbar
            title="Ubah PIN"
            onPressBack={() => {
              if (currentStep === 3) setCurrentStep(1);
              else if (currentStep === 4) setCurrentStep(3);
              else navigation.goBack();
            }}
            titlePosition="center"
            titleStyle="regular"
          />
          {stepContent()}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
