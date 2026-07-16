import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar/index.tsx';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FlowIndicator from '../../../components/molecules/FlowIndicator/index.tsx';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '../../../components/atoms/Button/index.tsx';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import _ from 'lodash';
import {
  useRegisterRequestOtp,
  useRegisterVerifyOtp,
  useRegisterPinSetup,
  useLoginRequestOtp,
  useLoginVerifyOtp,
  useLogin,
} from '../../../hooks/useAuthMutation.ts';
import InputPhoneNumber from './components/InputPhoneNumber.tsx';
import InputOTPNumber from './components/InputOTPNumber.tsx';
import Toast from 'react-native-toast-message';
import CreateAndConfirmPIN from './components/CreateAndConfirmPIN.tsx';
import crashlytics from '@react-native-firebase/crashlytics';

export interface PhoneNumberFormValues {
  phoneNumber: string;
  countryCode: string;
}

export const AuthEntry = ({ route }) => {
  const { isLoginState } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  // total steps set 2 because KYC is not ready
  const totalSteps = 2;

  const CELL_COUNT_OTP = 6;
  const [bottomSpacing, setBottomSpacing] = useState(32);
  const [valueOTP, setValueOTP] = useState('');
  const [timerOTP, setTimerOTP] = useState(30);
  const [phoneNumbData, setPhoneNumData] = useState({ phoneNumber: '', countryCode: '' });
  const ref = useBlurOnFulfill({ value: valueOTP, cellCount: CELL_COUNT_OTP });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: valueOTP,
    setValue: setValueOTP,
  });

  const [pin, setPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const PIN_LENGTH = 6;
  const enableButtonNextRef = useRef(false);

  const { mutate: registerRequestOTP, isPending: isRequesting } = useRegisterRequestOtp();
  const { mutate: registerVerifyOTP, isPending: isVerifying } = useRegisterVerifyOtp();
  const { mutate: registerSetupPin, isPending: isSettingPin } = useRegisterPinSetup();

  const { mutate: loginRequestOTP, isPending: isLoginRequesting } = useLoginRequestOtp();
  const { mutate: loginVerifyOTP, isPending: isLoginVerifying } = useLoginVerifyOtp();
  const { mutate: loginMutate, isPending: isSettingPinLogin } = useLogin();

  const handlePressPIN = () => {
    inputRef.current?.focus();
  };

  const renderDotsPIN = (code: string, hasError: boolean) => {
    const dots = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      const isFilled = i < code.length;
      dots.push(
        <View
          key={i}
          style={[styles.dot, isFilled && styles.dotFilled, hasError && styles.dotError]}
        />,
      );
    }
    return dots;
  };

  const formikRef = useRef<FormikProps<PhoneNumberFormValues>>(null);

  useEffect(() => {
    if (currentStep == 3) {
      setPin('');
    } else if (currentStep == 4) {
      setConfirmationPin('');
    } else if (currentStep == 2) {
      setValueOTP('');
    }
  }, [currentStep]);

  useEffect(() => {
    if (valueOTP?.length === 6 && currentStep === 2) {
      const { phoneNumber, countryCode } = phoneNumbData;
      const formattedPhone = (countryCode + phoneNumber).replace('+', '');

      if (!isLoginState) {
        registerVerifyOTP(
          {
            phoneNumber: formattedPhone,
            otpCode: valueOTP,
          },
          {
            onSuccess: (res: any) => {
              if (res?.status === 'error') {
                setValueOTP('');
                Toast.show({
                  type: 'error',
                  text1: res?.error?.message ?? 'OTP invalid',
                });
                return;
              }
              setCurrentStep(3);
            },
            onError: (err: any) => {
              setValueOTP('');
              const msg = err?.response?.data?.error?.message ?? err?.error?.message ?? 'OTP tidak valid';
              Toast.show({
                type: 'error',
                text1: msg,
              });
            },
          },
        );
      } else {
        loginVerifyOTP(
          {
            phoneNumber: formattedPhone,
            otpCode: valueOTP,
          },
          {
            onSuccess: (res: any) => {
              if (res?.status === 'error') {
                setValueOTP('');
                Toast.show({
                  type: 'error',
                  text1: res?.error?.message ?? 'OTP tidak valid',
                });
                return;
              }
              setCurrentStep(4);
            },
            onError: (err: any) => {
              setValueOTP('');
              const msg = err?.response?.data?.error?.message ?? err?.error?.message ?? 'OTP tidak valid';
              Toast.show({
                type: 'error',
                text1: msg,
              });
            },
          },
        );
      }
      return;
    }
  }, [valueOTP]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const keyboardDidShowListener = Keyboard.addListener(showEvt, () => {
      setBottomSpacing(16);
    });

    const keyboardDidHideListener = Keyboard.addListener(hideEvt, () => {
      setBottomSpacing(24);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerOTP((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const PhoneSchema = Yup.object().shape({
    phoneNumber: Yup.string().min(9, 'Nomor terlalu pendek').required('Wajib diisi'),
  });

  useEffect(() => {
    if (formikRef?.current) {
      const { phoneNumber, countryCode } = formikRef?.current?.values;
      if (!_.isEmpty(phoneNumber)) {
        let data = {
          phoneNumber: phoneNumber,
          countryCode: countryCode,
        };
        setPhoneNumData(data);
      }
    }
  }, [formikRef?.current?.values]);

  const detailStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Formik<PhoneNumberFormValues>
            innerRef={formikRef}
            initialValues={{ phoneNumber: '', countryCode: '+62' }}
            validationSchema={PhoneSchema}
            onSubmit={(values) => console.log('Form Data:', values)}>
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
            otpFieldProps={props}
            getCellOnLayoutHandler={getCellOnLayoutHandler}
            onResendOtp={handleSendOtp}
            isPending={isRequesting || isLoginRequesting}
          />
        );
      case 3:
      case 4:
        return (
          <CreateAndConfirmPIN
            step={currentStep}
            isLoginState={isLoginState}
            pin={pin}
            confirmationPin={confirmationPin}
            isErrorPIN={isErrorPIN}
            styles={styles}
            inputRef={inputRef}
            handlePressPIN={handlePressPIN}
            renderDotsPIN={renderDotsPIN}
            PIN_LENGTH={PIN_LENGTH}
            onChangeText={(text) => {
              handlePINChange(text);
            }}
            onForgotPinPress={isLoginState ? () => (navigation as any).navigate('ForgotPin') : undefined}
          />
        );
      // disable this step because KYC is not ready
      // case 5:
      //   return (
      //     <IdentityVerification
      //       styles={styles}
      //       onVerifyNow={() => console.log('Verify Now')}
      //       onMaybeLater={() => navigation.navigate('BankList')}
      //     />
      //   );
      default:
        return '';
    }
  };

  const handleSendOtp = () => {
    const { phoneNumber, countryCode } = phoneNumbData;
    const formattedPhone = (countryCode + phoneNumber).replace('+', '');

    if (!isLoginState) {
      registerRequestOTP(
        {
          phoneNumber: formattedPhone,
          method: 'SMS',
        },
        {
          onSuccess: (res) => {
            setTimerOTP(res.data.retryAfterSeconds || 30);
            setCurrentStep(2);
          },
          onError: (err) => {
            console.error('error registerRequestOTP', err);
            Toast.show({
              type: 'error',
              text1: err?.error?.message ?? '',
            });
          },
        },
      );
    } else {
      loginRequestOTP(
        {
          phoneNumber: formattedPhone,
          method: 'SMS',
        },
        {
          onSuccess: (res) => {
            setTimerOTP(res.data.retryAfterSeconds || 30);
            setCurrentStep(2);
          },
          onError: (err) => {
            console.error('error loginRequestOTP', err);
            Toast.show({
              type: 'error',
              text1: err?.error?.message ?? '',
            });
          },
        },
      );
    }
  };

  useEffect(() => {
    if (currentStep == 1) {
      const isValid = formikRef.current?.isValid;
      const isDirty = formikRef.current?.dirty;
      if (!isValid || !isDirty) {
        enableButtonNextRef.current = false;
      } else {
        enableButtonNextRef.current = true;
      }
    } else if (currentStep == 2) {
      if (valueOTP.length == 6) {
        enableButtonNextRef.current = true;
      } else {
        enableButtonNextRef.current = false;
      }
    }
  }, [formikRef.current?.isValid, formikRef.current?.dirty, currentStep, valueOTP]);

  const handlePINChange = (text: string) => {
    if (isErrorPIN) setIsErrorPIN(false);

    if (text.length <= PIN_LENGTH) {
      if (currentStep === 3) {
        setPin(text);
      } else {
        setConfirmationPin(text);
      }
    }

    if (text.length === PIN_LENGTH) {
      if (currentStep === 3) {
        setTimeout(() => {
          setCurrentStep(4);
        }, 250);
      } else {
        if (!isLoginState) {
          if (text === pin) {
            const { phoneNumber, countryCode } = phoneNumbData;
            const formattedPhone = (countryCode + phoneNumber).replace('+', '');

            registerSetupPin(
              {
                phoneNumber: formattedPhone,
                pin: text,
              },
              {
                onSuccess: (res) => {
                  crashlytics().log('User register setup pin');
                  crashlytics().setUserId(formattedPhone);
                  setTimeout(() => {
                    navigation.navigate('MainTabs', { isLoginState });
                  }, 500);
                  Keyboard.dismiss();
                },
                onError: (err: any) => {
                  setConfirmationPin('');
                  Toast.show({
                    type: 'error',
                    text1: err?.error?.message ?? '',
                  });
                },
              },
            );
          } else {
            setIsErrorPIN(true);
            setConfirmationPin('');
          }
        } else {
          const { phoneNumber, countryCode } = phoneNumbData;
          const formattedPhone = (countryCode + phoneNumber).replace('+', '');

          loginMutate(
            {
              phoneNumber: formattedPhone,
              pin: text,
            },
            {
              onSuccess: (res) => {
                crashlytics().log('User login success');
                crashlytics().setUserId(formattedPhone);
                console.log('Login success:', res);
                Toast.show({
                  type: 'success',
                  text1: 'Berhasil login',
                });

                Keyboard.dismiss();
                navigation.navigate('MainTabs', { isLoginState });
              },
              onError: (err: any) => {
                setConfirmationPin('');
                const msg = err?.response?.data?.error?.message ?? err?.error?.message ?? 'PIN salah';
                Toast.show({
                  type: 'error',
                  text1: msg,
                });
              },
            },
          );
        }
      }
    }
  };

  const onPressNext = () => {
    // STEP 1: Request OTP
    Keyboard.dismiss();
    if (currentStep === 1) {
      const values = formikRef.current?.values;
      if (values) {
        const { phoneNumber, countryCode } = values;
        const formattedPhone = (countryCode + phoneNumber).replace('+', '');

        if (!isLoginState) {
          registerRequestOTP(
            {
              phoneNumber: formattedPhone,
              method: 'SMS',
            },
            {
              onSuccess: (res) => {
                setTimerOTP(res.data.retryAfterSeconds || 30);
                setCurrentStep(2);
              },
              onError: (err) => {
                console.error('error registerRequestOTP', err?.error?.message);
                Toast.show({
                  type: 'error',
                  text1: err?.error?.message ?? '',
                });
              },
            },
          );
        } else {
          loginRequestOTP(
            {
              phoneNumber: formattedPhone,
              method: 'SMS',
            },
            {
              onSuccess: (res) => {
                setTimerOTP(res.data.retryAfterSeconds || 30);
                setCurrentStep(2);
              },
              onError: (err) => {
                console.error('error registerRequestOTP', err?.error?.message);
                Toast.show({
                  type: 'error',
                  text1: err?.error?.message ?? '',
                });
              },
            },
          );
        }
      }
      return;
    }

    if (currentStep == 5) {
      navigation.navigate('Home', { isLoginState });
    }
    if (currentStep == 1 || currentStep == 2) {
      enableButtonNextRef.current = false;
    }
    if (!isLoginState) {
      console.log('bonlog 1');
      setCurrentStep((prev) => Math.min(prev + 1, 10));
    } else {
      console.log('bonlog 1');
      if (currentStep == 2) {
        setCurrentStep((prev) => Math.min(prev + 2, 10));
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 10));
      }
    }
  };

  const title = t(
    currentStep == 1
      ? 'authEntry.phoneNumber'
      : currentStep == 2 || currentStep == 5
        ? 'authEntry.verification'
        : currentStep == 3 || currentStep == 4
          ? 'authEntry.pin'
          : '-',
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: colors.pageBackground }}
        enabled={true}>
        <View style={{ flex: 1 }}>
          <HeaderToolbar
            title={title}
            onPressBack={
              currentStep == 3
                ? undefined
                : () => {
                    if (currentStep > 1) {
                      if (!isLoginState) {
                        setCurrentStep((prev) => Math.max(prev - 1, 1));
                      } else {
                        if (currentStep == 4) {
                          setCurrentStep((prev) => Math.max(prev - 2, 1));
                        } else {
                          setCurrentStep((prev) => Math.max(prev - 1, 1));
                        }
                      }
                    } else navigation.goBack();
                  }
            }
            titlePosition="center"
            titleStyle="regular"
          />
          {!isLoginState ? (
            <FlowIndicator
              totalSteps={totalSteps}
              currentStep={Math.ceil(currentStep / 2)}
              barStep={currentStep}
            />
          ) : (
            <View style={{ marginBottom: -22 }} />
          )}

          {detailStep()}
          <View
            style={{
              position: 'absolute',
              bottom: bottomSpacing,
              left: 16,
              right: 16,
            }}>
            {currentStep == 3 || currentStep == 4 || currentStep == 5 || currentStep == 2 ? null : (
              <Button
                type="regular"
                onPress={() => onPressNext()}
                loading={isRequesting || isVerifying || isLoginRequesting || isLoginVerifying}
                title={t(currentStep === 1 ? 'authEntry.sendOTPNumber' : 'authEntry.verification')}
                style={{
                  backgroundColor:
                    enableButtonNextRef.current &&
                    !isVerifying &&
                    !isRequesting &&
                    !isLoginRequesting &&
                    !isLoginVerifying
                      ? colors.buttonBlue
                      : colors.disableButton,
                }}
                color={colors.buttonBlue}
                textColor="white"
                disable={
                  !enableButtonNextRef.current ||
                  isVerifying ||
                  isRequesting ||
                  isLoginRequesting ||
                  isLoginVerifying
                }
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
