import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import HeaderToolbar from '../../components/molecules/HeaderToolbar/index.tsx';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FlowIndicator from '../../components/molecules/FlowIndicator/index.tsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@/src/components/atoms/Button/index.tsx';

export const AuthEntry = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);

  const PhoneSchema = Yup.object().shape({
    phoneNumber: Yup.string().min(9, 'Nomor terlalu pendek').required('Wajib diisi'),
  });

  const detailStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={styles.titleStep}>{t('authEntry.enterPhoneNumber')}</Text>
            <Text style={styles.descStep}>{t('authEntry.descEnterPhoneNumber')}</Text>
            <Formik
              initialValues={{ phoneNumber: '', countryCode: '+62' }}
              validationSchema={PhoneSchema}
              onSubmit={(values) => console.log('Form Data:', values)}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formWrapper}>
                  <Text style={styles.label}>Label</Text>

                  <View style={styles.inputGroup}>
                    <TouchableOpacity style={styles.countryPicker} activeOpacity={0.7}>
                      <View style={styles.flagContainer}>
                        <View style={styles.flagRed} />
                        <View style={styles.flagWhite} />
                      </View>
                      <Text style={styles.countryCode}>{values.countryCode}</Text>
                      <Text style={styles.chevron}>⌄</Text>
                    </TouchableOpacity>

                    <TextInput
                      style={[
                        styles.input,
                        touched.phoneNumber && errors.phoneNumber && styles.inputError,
                      ]}
                      placeholder="Value"
                      placeholderTextColor="#A9A9A9"
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                    />
                  </View>

                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}
                </View>
              )}
            </Formik>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                {t('authEntry.descTerms1')}{' '}
                <Text style={styles.link}>{t('authEntry.descTerms2')}</Text>{' '}
                {t('authEntry.descTerms3')}{' '}
                <Text style={styles.link}>{t('authEntry.descTerms4')}</Text>{' '}
                {t('authEntry.descTerms5')}
              </Text>
            </View>
          </View>
        );
      //   case 2:
      //     return t('authEntry.verificationCode');
      //   case 3:
      //     return t('authEntry.setPassword');
      default:
        return '';
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
        <HeaderToolbar
          title={t('authEntry.phoneNumber')}
          withBackButton={true}
          onPressBack={() => navigation.goBack()}
          withCloseButton={true}
          onPressRightButton={() => navigation.goBack()}
          titlePosition="center"
        />
        <FlowIndicator totalSteps={3} currentStep={1} />
        {detailStep()}
        <View style={{ position: 'absolute', bottom: 32, left: 16, right: 16 }}>
          <Button
            type="regular"
            onPress={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
            title={t('authEntry.next')}
            style={{
              backgroundColor: colors.buttonBlue,
            }}
            color={colors.buttonBlue}
            textColor="white"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
