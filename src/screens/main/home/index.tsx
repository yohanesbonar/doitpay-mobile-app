import { useNavigation } from '@react-navigation/native';
import { HomeView } from '../../../features/main/home';
import React from 'react';
import { trackPostHogEvent } from '@/analytics/posthog';
import { useTransferFeatureAvailability } from '@/features/transfer/hooks/useTransferFeatureAvailability';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { transferEnabled, isLoading: isFeatureLoading } = useTransferFeatureAvailability();

  const canTransfer = isFeatureLoading || transferEnabled;

  const goToSearchAccount = () => {
    trackPostHogEvent('transfer_started', {
      entry_point: 'home_search_account',
    });

    navigation.navigate('SearchAccount');
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const goToBankAccounts = () => {
    navigation.navigate('BankAccounts');
  };

  const goToNotifications = () => {
    navigation.navigate('Notification');
  };

  const goToTransactionDetail = (params: {
    id: string;
    referenceId?: string;
    type?: string;
    status?: string;
    transactionMethod?: string;
    amount: number;
    createdAt: string;
    beneficiaryAccountHolderName: string;
    beneficiaryAccountNumber: string;
    beneficiaryBankShortName: string;
  }) => {
    if (
      params.status?.toUpperCase() === 'VERIFYING' &&
      params.transactionMethod?.toUpperCase() === 'MANUAL_BANK' &&
      params.referenceId
    ) {
      navigation.navigate('ManualBankVerification', {
        transferData: {
          id: params.referenceId,
          status: params.status,
          amount: params.amount,
          createdAt: params.createdAt,
        },
        accountData: {
          accountHolderName: params.beneficiaryAccountHolderName,
          accountNumber: params.beneficiaryAccountNumber,
          bankName: params.beneficiaryBankShortName,
        },
        bankData: {
          name: params.beneficiaryBankShortName,
          shortName: params.beneficiaryBankShortName,
        },
      });
      return;
    }

    navigation.navigate('TransactionDetail', {
      transactionId: params.id,
      referenceId: params.referenceId ?? '',
      type: params.type ?? '',
      status: params.status,
    });
  };

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
    if (!canTransfer) {
      return;
    }

    trackPostHogEvent('transfer_started', {
      entry_point: 'home_recent_beneficiary',
      destination_bank: params.bankData?.shortName || params.bankData?.name || 'unknown',
    });

    navigation.navigate('TransferDetail', params);
  };

  return (
    <HomeView
      goToSearchAccount={goToSearchAccount}
      onPressBack={onPressBack}
      goToBankAccounts={goToBankAccounts}
      goToNotification={goToNotifications}
      goToTransactionDetail={goToTransactionDetail}
      goToTransferDetail={goToTransferDetail}
    />
  );
};

export default HomeScreen;
