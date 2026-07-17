import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import { useBankInquiry, useBanks } from '@/hooks/useBankMutation.ts';
import { useAddBankAccount } from '@/hooks/useMeMutation.ts';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trackPostHogEvent } from '@/analytics/posthog';

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
  console.log('AddBankRecipientView Props:', {
    onPressBack,
    onNavigateHome,
    isLoginState,
    fromTabBar,
    bankData,
    method,
    onClickContinue,
    fromProfile,
    onBackToBankAccount,
  });
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const { mutate: fetchBanks, isPending: isFetchingBanks } = useBankInquiry();
  const [resultData, setResultData] = useState<any>(null);
  const { mutate: postBankAccount, isPending: isPostingBankAccount } = useAddBankAccount();

  const accountNumberInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      accountNumberInputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleAccountSelect = (item: any) => {
    console.log('Selected item:', item);
    setSelectedId(item.id);
    setSelectedAccount(item);

    if (fromProfile) {
      postBankAccount(
        {
          accountInquiryID: item.id,
        } as any,
        {
          onSuccess: (data) => {
            console.log('Bank account added successfully:', data);
            setTimeout(() => {
              setShowModal(true);
            }, 800);
          },
          onError: (error) => {
            console.error('Error adding bank account:', error);
          },
        },
      );
    } else {
      console.log('Continuing with selected account:', item);
      onClickContinue(method, bankData, item);
    }
  };

  const searchInquiry = (accountNumber: string) => {
    Keyboard.dismiss();
    console.log('Initiating bank inquiry with:', { accountNumber, bankData: bankData });
    fetchBanks(
      { accountNumber, bankId: bankData?.id },
      {
        onSuccess: (data) => {
          console.log('Bank inquiry result:', data);
          if (data.data) {
            trackPostHogEvent('recipient_verified', {
              destination_bank: bankData?.shortName || bankData?.name || 'unknown',
              account_status: 'ACTIVE',
            });
            setResultData(data?.data);
            setShowResult(true);
          }
        },
        onError: (error) => {
          const timer = setTimeout(() => {
            accountNumberInputRef.current?.focus();
          }, 150);
          console.log('error fetchBanks', error);
          trackPostHogEvent('recipient_verification_failed', {
            destination_bank: bankData?.shortName || bankData?.name || 'unknown',
            failure_reason: error?.error?.message ?? 'gagal_memeriksa_rekening',
          });
          Toast.show({
            type: 'error',
            text1: error?.error?.message ?? 'Gagal memeriksa rekening',
          });
        },
      },
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.white }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.container}>
          <HeaderToolbar
            title={bankData?.shortName ? `${bankData?.shortName}` : t('addBankAccount.rekening')}
            onPressBack={onPressBack}
            titleStyle="normal"
            titlePosition={fromTabBar ? 'left' : 'center'}
          />
          <Formik
            initialValues={{ accountNumber: '' }}
            validationSchema={BankAccountSchema}
            onSubmit={(values) => {
              searchInquiry(values.accountNumber);
            }}>
            {(formikProps) => (
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <BankAccountForm
                    {...formikProps}
                    showResult={showResult}
                    searchData={resultData ? [resultData] : []}
                    onSelectItem={handleAccountSelect}
                    selectedId={selectedId}
                    setShowResult={setShowResult}
                    setResultData={setResultData}
                    inputRef={accountNumberInputRef}
                  />
                </View>

                {!showResult && formikProps.values.accountNumber ? (
                  <View
                    style={[
                      styles.footer,
                      {
                        paddingBottom: Platform.OS === 'android' ? 24 : 24,
                      },
                    ]}>
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
                      style={{ borderWidth: 1, borderColor: '#D4D4D4', width: '100%' }}
                      textStyle={{
                        color:
                          showResult || formikProps.values.accountNumber
                            ? colors.white
                            : colors.black,
                      }}
                      color={
                        formikProps.values.accountNumber ? colors.buttonBlue : colors.buttonWhite
                      }
                      loading={isFetchingBanks}
                    />
                  </View>
                ) : null}

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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
