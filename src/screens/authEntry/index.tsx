import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import HeaderToolbar from '../../components/molecules/HeaderToolbar/index.tsx';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FlowIndicator from '../../components/molecules/FlowIndicator/index.tsx';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/atoms/Button/index.tsx';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { CreditCard, Sun, User, AlertCircle } from 'lucide-react-native';
import _ from 'lodash';
import { useRequestOtp } from '../../hooks/useAuthMutation.ts';
import InputPhoneNumber from './components/InputPhoneNumber';
import InputOTPNumber from './components/InputOTPNumber';
import Toast from 'react-native-toast-message';

export const AuthEntry = ({ route }) => {
  const { isLoginState } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const CELL_COUNT_OTP = 6;
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

  const { mutate, isPending } = useRequestOtp();

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
    const interval = setInterval(() => {
      setTimerOTP((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const PhoneSchema = Yup.object().shape({
    phoneNumber: Yup.string().min(9, 'Nomor terlalu pendek').required('Wajib diisi'),
  });

  const formikRef = useRef<FormikProps<any>>(null);

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

  const createAndConfirmPIN = (step: number) => {
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
            PIN yang Anda masukkan tidak cocok. Silakan coba lagi.
          </Text>
        )}

        <TextInput
          ref={inputRef}
          value={step === 3 ? pin : confirmationPin}
          onChangeText={(text) => {
            if (isErrorPIN) setIsErrorPIN(false);

            if (text.length <= PIN_LENGTH) {
              if (step === 3) {
                setPin(text);
              } else {
                setConfirmationPin(text);
              }
            }

            if (text.length === PIN_LENGTH) {
              if (step === 3) {
                setTimeout(() => {
                  setCurrentStep(4);
                }, 250);
              } else {
                if (!isLoginState) {
                  if (text === pin) {
                    setTimeout(() => {
                      setCurrentStep((prev) => Math.min(prev + 1, 10));
                    }, 250);
                  } else {
                    setIsErrorPIN(true);
                    setConfirmationPin('');
                  }
                } else {
                  // if pin is true
                  navigation.navigate('Home', { isLoginState: isLoginState });
                }
              }
            }
          }}
          keyboardType="number-pad"
          maxLength={PIN_LENGTH}
          style={styles.hiddenInput}
          autoFocus={true}
        />
      </View>
    );
  };

  const identityVerification = () => {
    return (
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <Text style={styles.titleStep}>{t('authEntry.identityVerification')}</Text>
        <Text style={styles.descStep}>
          {t('authEntry.descIdentityVerification')}{' '}
          <Text style={styles.boldText}>{t('authEntry.descIdentityVerification2')}</Text>
        </Text>

        <TouchableOpacity style={[styles.cardVerif, styles.activeCardVerif]}>
          <View style={[styles.iconBoxVerif, styles.blueIconBoxVerif]}>
            <CreditCard color="#FFF" size={24} />
          </View>
          <View style={styles.cardTextContentVerif}>
            <Text style={styles.cardTitleVerif}>{t('authEntry.verifyNow')}</Text>
            <Text style={styles.cardSubtitleVerif}>{t('authEntry.idCardSelfie')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardVerif} onPress={() => navigation.navigate('BankList')}>
          <View style={[styles.iconBoxVerif, styles.yellowIconBoxVerif]}>
            <AlertCircle color="#EAB308" size={24} />
          </View>
          <View style={styles.cardTextContentVerif}>
            <Text style={styles.cardTitleVerif}>{t('authEntry.maybeLater')}</Text>
            <Text style={styles.cardSubtitleVerif}>{t('authEntry.limitDaily')}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoContainerVerif}>
          <Text style={styles.infoTitleVerif}>{t('authEntry.thingsToPrepare')}</Text>

          <View style={styles.infoRowVerif}>
            <CreditCard color="#666" size={22} style={styles.infoIconVerif} />
            <Text style={styles.infoTextVerif}>{t('authEntry.originalIDCard')}</Text>
          </View>

          <View style={styles.infoRowVerif}>
            <Sun color="#666" size={22} style={styles.infoIconVerif} />
            <Text style={styles.infoTextVerif}>{t('authEntry.lightRoom')}</Text>
          </View>

          <View style={styles.infoRowVerif}>
            <User color="#666" size={22} style={styles.infoIconVerif} />
            <Text style={styles.infoTextVerif}>{t('authEntry.clearFace')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const detailStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Formik
            innerRef={formikRef}
            initialValues={{ phoneNumber: '', countryCode: '+62' }}
            validationSchema={PhoneSchema}
            onSubmit={(values) => console.log('Form Data:', values)}>
            {(formikProps) => <InputPhoneNumber styles={styles} formik={formikProps} />}
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
            otpFieldProps={props} // ini dari useClearByFocusCell
            getCellOnLayoutHandler={getCellOnLayoutHandler}
            // onResendOtp={handleSendOtp} // Fungsi mutasi API Anda
            isPending={isPending}
          />
        );
      case 3:
        return createAndConfirmPIN(currentStep);
      case 4:
        return createAndConfirmPIN(currentStep);
      case 5:
        return identityVerification();
      default:
        return '';
    }
  };

  useEffect(() => {
    if (currentStep == 1) {
      if (!formikRef.current?.isValid || !formikRef.current?.dirty) {
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

  const onPressNext = () => {
    if (currentStep === 1) {
      const { phoneNumber, countryCode } = formikRef.current?.values;

      const formattedPhone = (countryCode + phoneNumber).replace('+', '');

      mutate(
        {
          phoneNumber: formattedPhone,
          method: 'SMS',
        },
        {
          onSuccess: (res) => {
            setTimerOTP(res.data.resendAfterSeconds || 30);
            setCurrentStep(2);
          },
          onError: (err) => {
            console.error('error OTP request', err);
            Toast.show({
              type: 'error',
              text1: err.message,
            });
          },
        },
      );
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
      <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
        <HeaderToolbar
          title={title}
          withBackButton={true}
          onPressBack={() => {
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
          }}
          withCloseButton={true}
          onPressRightButton={() => navigation.goBack()}
          titlePosition="center"
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
        <View style={{ position: 'absolute', bottom: 32, left: 16, right: 16 }}>
          {currentStep == 3 || currentStep == 4 || currentStep == 5 ? null : (
            <Button
              type="regular"
              onPress={() => onPressNext()}
              title={t(currentStep == 1 ? 'authEntry.sendOTPNumber' : 'authEntry.verification')}
              style={{
                backgroundColor: enableButtonNextRef.current
                  ? colors.buttonBlue
                  : colors.disableButton,
              }}
              color={colors.buttonBlue}
              textColor="white"
              disable={!enableButtonNextRef.current}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
