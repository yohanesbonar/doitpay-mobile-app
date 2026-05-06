import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import BankAccountForm from './BankAccountForm.tsx';
import SuccessBottomSheet from './SuccessBottomSheet.tsx';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar/index.tsx';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import Button from '../../../components/atoms/Button/index.tsx';
import { storage, StorageKey } from '@/storage';

interface AddBankRecipientViewProps {
  onPressBack: () => void;
  onNavigateHome: () => void;
  isLoginState: boolean;
  fromTabBar: boolean;
  bankData: any;
  method: 'send' | 'receive';
  onClickContinue?: (method: 'send' | 'receive', bankData: any, accountData: any) => void;
  fromProfile?: boolean;
  onBackToBankAccount?: () => void;
}

const BankAccountSchema = Yup.object().shape({
  accountNumber: Yup.string().min(8, 'Minimal 8 digit').required('Wajib diisi'),
});

export const AddBankRecipientView = ({
  onPressBack,
  onNavigateHome,
  isLoginState,
  fromTabBar,
  bankData,
  method,
  onClickContinue,
  fromProfile,
  onBackToBankAccount,
}: AddBankRecipientViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const getMockData = (accountNumber: string) => [
    {
      id: '12313123',
      ownerName: 'Prabu Suwito',
      bank: bankData?.name || 'Bank BCA',
      bankName: bankData?.name || 'Bank BCA',
      accNo: accountNumber,
      accountNumber: accountNumber,
      isVerified: true,
      isActive: false,
      image: require('../../../assets/images/ic-BCA.png'),
    },
  ];

  const handleAccountSelect = (item: any) => {
    console.log('Selected item:', item);
    setSelectedId(item.id);

    const existingDataStr = storage.getString(StorageKey.BANK_ACCOUNTS);
    let updatedAccounts = [];
    const newEntry = {
      id: item.id,
      bank: item.bankName,
      name: item.ownerName,
      accNo: item.accountNumber,
      isVerified: true,
      isActive: false,
      image: item.image,
    };

    if (existingDataStr) {
      const parsedData = JSON.parse(existingDataStr);
      if (!parsedData.some((a: any) => a.accNo === newEntry.accNo)) {
        updatedAccounts = [...parsedData, newEntry];
      } else {
        updatedAccounts = parsedData;
      }
    } else {
      newEntry.isActive = true;
      updatedAccounts = [newEntry];
    }
    storage.set(StorageKey.BANK_ACCOUNTS, JSON.stringify(updatedAccounts));
    setSelectedAccount(newEntry);

    setTimeout(() => {
      setShowModal(true);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title={bankData?.name ? `${bankData?.name}` : t('addBankAccount.rekening')}
        onPressBack={onPressBack}
        titleStyle="normal"
        titlePosition={fromTabBar ? 'left' : 'center'}
      />
      <Formik
        initialValues={{ accountNumber: '' }}
        validationSchema={BankAccountSchema}
        onSubmit={() => {
          setShowResult(true);
        }}>
        {(formikProps) => (
          <View style={{ flex: 1 }}>
            <BankAccountForm
              {...formikProps}
              showResult={showResult}
              searchData={getMockData(formikProps.values.accountNumber)}
              onSelectItem={handleAccountSelect}
              selectedId={selectedId}
            />

            <View style={styles.footer}>
              {!showResult && formikProps.values.accountNumber ? (
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
                  style={{ borderWidth: 1, borderColor: '#D4D4D4' }}
                  textStyle={{
                    color:
                      showResult || formikProps.values.accountNumber ? colors.white : colors.black,
                  }}
                  color={formikProps.values.accountNumber ? colors.buttonBlue : colors.buttonWhite}
                />
              ) : null}
            </View>

            <SuccessBottomSheet
              isVisible={showModal}
              onClose={() => setShowModal(false)}
              onContinue={onNavigateHome}
              onGoToBankList={() => {
                setShowModal(false);
                onBackToBankAccount();
              }}
              accountData={selectedAccount}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};
