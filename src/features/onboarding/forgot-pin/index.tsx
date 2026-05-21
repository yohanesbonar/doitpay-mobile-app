import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../authEntry/styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import InputPhoneNumber from '../authEntry/components/InputPhoneNumber';
import InputOTPNumber from '../authEntry/components/InputOTPNumber';
import CreateAndConfirmPIN from '../authEntry/components/CreateAndConfirmPIN';
import {
  useForgotPinRequestOtp,
  useForgotPinVerifyOtp,
  useForgotPinReset,
} from '@/hooks/useAuthMutation';

interface PhoneFormValues {
  phoneNumber: string;
  countryCode: string;
}

const PhoneSchema = Yup.object().shape({
  phoneNumber: Yup.string().min(9, 'Nomor terlalu pendek').required('Wajib diisi'),
});

const CELL_COUNT_OTP = 6;
const PIN_LENGTH = 6;

export const ForgotPin = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [currentStep, setCurrentStep] = useState(1);
  const [bottomSpacing, setBottomSpacing] = useState(32);

  const [phoneNumbData, setPhoneNumbData] = useState({ phoneNumber: '', countryCode: '' });
  const [valueOTP, setValueOTP] = useState('');
  const [timerOTP, setTimerOTP] = useState(30);

  const [pin, setPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);

  const formikRef = useRef<FormikProps<PhoneFormValues>>(null);
  const inputRef = useRef<TextInput>(null);
  const enableButtonNextRef = useRef(false);

  const [otpFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: valueOTP,
    setValue: setValueOTP,
  });
  useBlurOnFulfill({ value: valueOTP, cellCount: CELL_COUNT_OTP });

  const { mutate: requestOtp, isPending: isRequesting } = useForgotPinRequestOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useForgotPinVerifyOtp();
  const { mutate: resetPin, isPending: isResetting } = useForgotPinReset();

  useEffect(() => {
    if (currentStep === 2) setValueOTP('');
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerOTP((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      enableButtonNextRef.current = !!(formikRef.current?.isValid && formikRef.current?.dirty);
    }
  }, [formikRef.current?.isValid, formikRef.current?.dirty, currentStep]);

  // Auto-submit OTP when 6 digits entered
  useEffect(() => {
    if (valueOTP.length !== CELL_COUNT_OTP || currentStep !== 2) return;
    const formattedPhone = (phoneNumbData.countryCode + phoneNumbData.phoneNumber).replace('+', '');
    verifyOtp(
      { phoneNumber: formattedPhone, otpCode: valueOTP },
      {
        onSuccess: () => {
          setCurrentStep(3);
        },
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Kode OTP salah' });
        },
      },
    );
  }, [valueOTP]);

  const handleSendOtp = () => {
    const formattedPhone = (phoneNumbData.countryCode + phoneNumbData.phoneNumber).replace('+', '');
    requestOtp(
      { phoneNumber: formattedPhone, method: 'SMS' },
      {
        onSuccess: (res) => setTimerOTP(res.data.retryAfterSeconds || 30),
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Gagal mengirim OTP' });
        },
      },
    );
  };

  const handlePINChange = (text: string) => {
    if (isErrorPIN) setIsErrorPIN(false);
    if (text.length > PIN_LENGTH) return;

    if (currentStep === 3) {
      setPin(text);
    } else {
      setConfirmationPin(text);
    }

    if (text.length === PIN_LENGTH) {
      if (currentStep === 3) {
        setTimeout(() => setCurrentStep(4), 250);
        return;
      }
      if (text !== pin) {
        setIsErrorPIN(true);
        setConfirmationPin('');
        return;
      }
      resetPin(
        { pin: text },
        {
          onSuccess: () => {
            Keyboard.dismiss();
            Toast.show({ type: 'success', text1: 'PIN berhasil direset' });
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
          },
          onError: (err: any) => {
            setConfirmationPin('');
            Toast.show({ type: 'error', text1: err?.message || 'Gagal mereset PIN' });
          },
        },
      );
    }
  };

  const renderDotsPIN = (code: string, hasError: boolean) =>
    Array.from({ length: PIN_LENGTH }).map((_, i) => (
      <View
        key={i}
        style={[styles.dot, i < code.length && styles.dotFilled, hasError && styles.dotError]}
      />
    ));

  const onPressNext = () => {
    Keyboard.dismiss();
    if (currentStep !== 1) return;
    const values = formikRef.current?.values;
    if (!values) return;
    const formattedPhone = (values.countryCode + values.phoneNumber).replace('+', '');
    requestOtp(
      { phoneNumber: formattedPhone, method: 'SMS' },
      {
        onSuccess: (res) => {
          setPhoneNumbData({ phoneNumber: values.phoneNumber, countryCode: values.countryCode });
          setTimerOTP(res.data.retryAfterSeconds || 30);
          setCurrentStep(2);
        },
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Gagal mengirim OTP' });
        },
      },
    );
  };

  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Formik<PhoneFormValues>
            innerRef={formikRef}
            initialValues={{ phoneNumber: '', countryCode: '+62' }}
            validationSchema={PhoneSchema}
            onSubmit={() => {}}>
            <InputPhoneNumber styles={styles} />
          </Formik>
        );
      case 2:
        return (
          <InputOTPNumber
            styles={styles}
            valueOTP={valueOTP}
            setValueOTP={setValueOTP}
            timerOTP={timerOTP}
            phoneNumbData={phoneNumbData}
            CELL_COUNT_OTP={CELL_COUNT_OTP}
            otpFieldProps={otpFieldProps}
            getCellOnLayoutHandler={getCellOnLayoutHandler}
            onResendOtp={handleSendOtp}
            isPending={isRequesting || isVerifying}
          />
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

  const titleMap: Record<number, string> = {
    1: 'Reset PIN',
    2: 'Reset PIN',
    3: 'Reset PIN',
    4: 'Reset PIN',
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: colors.pageBackground }}
        enabled>
        <View style={{ flex: 1 }}>
          <HeaderToolbar
            title={titleMap[currentStep] ?? '-'}
            onPressBack={() => {
              if (currentStep > 1) setCurrentStep((prev) => prev - 1);
              else navigation.goBack();
            }}
            titlePosition="center"
            titleStyle="regular"
          />

          {stepContent()}

          <View style={{ position: 'absolute', bottom: bottomSpacing, left: 16, right: 16 }}>
            {currentStep === 1 && (
              <Button
                type="regular"
                onPress={onPressNext}
                loading={isRequesting}
                title={t('authEntry.sendOTPNumber')}
                style={{
                  backgroundColor:
                    enableButtonNextRef.current && !isRequesting
                      ? colors.buttonBlue
                      : colors.disableButton,
                }}
                color={colors.buttonBlue}
                textColor="white"
                disable={!enableButtonNextRef.current || isRequesting}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
