import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import BankAccountForm from './BankAccountForm';
import SuccessBottomSheet from './SuccessBottomSheet';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles';
import Button from '../../../components/atoms/Button/index.tsx';
import { useNavigation } from '@react-navigation/native';

const BankAccountSchema = Yup.object().shape({
  accountNumber: Yup.string().min(8, 'Minimal 8 digit').required('Wajib diisi'),
});

const AddBankRecipient = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const mockSearchData = [
    { id: '1', ownerName: 'Prabu Suwito', bankName: 'BCA', accountNumber: '12312412031' },
  ];

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title={t('addBankAccount.rekening')}
        withBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <Formik
        initialValues={{ accountNumber: '' }}
        validationSchema={BankAccountSchema}
        onSubmit={() => {
          if (!showResult) setShowResult(true);
          else setShowModal(true);
        }}>
        {(formikProps) => (
          <View style={{ flex: 1 }}>
            <BankAccountForm {...formikProps} showResult={showResult} searchData={mockSearchData} />

            <View style={styles.footer}>
              <Button
                type="regular"
                onPress={() => formikProps.handleSubmit()}
                title={
                  showResult
                    ? t('addBankAccount.continue')
                    : formikProps.values.accountNumber
                      ? t('addBankAccount.checkAccount')
                      : t('addBankAccount.skip')
                }
                style={{
                  borderWidth: 1,
                  borderColor: '#D4D4D4',
                }}
                textStyle={{
                  color:
                    showResult || formikProps.values.accountNumber ? colors.white : colors.black,
                }}
                color={formikProps.values.accountNumber ? colors.buttonBlue : colors.buttonWhite}
              />
            </View>

            <SuccessBottomSheet
              isVisible={showModal}
              onClose={() => setShowModal(false)}
              onContinue={() => {
                setShowModal(false);
                // Navigate to Homepage
              }}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddBankRecipient;
