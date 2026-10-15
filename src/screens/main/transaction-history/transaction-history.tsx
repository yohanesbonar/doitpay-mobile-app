import { History } from '@/features/main/history';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export const TransactionHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const navigateToDetailTransaction = (params: {
    id: string;
    originTab?: 'home' | 'history';
    referenceId: string;
    type: string;
    status: string;
    transactionMethod: string;
    amount: number;
    createdAt: string;
    accountHolderName: string;
    accountNumber?: string;
    bankShortName: string;
  }) => {
    if (
      params.status?.toUpperCase() === 'VERIFYING' &&
      params.transactionMethod?.toUpperCase() === 'MANUAL_BANK' &&
      params.referenceId
    ) {
      navigation.navigate('ManualBankVerification', {
        originTab: params.originTab ?? 'history',
        transferData: {
          id: params.referenceId,
          status: params.status,
          amount: params.amount,
          createdAt: params.createdAt,
        },
        accountData: {
          accountHolderName: params.accountHolderName,
          accountNumber: params.accountNumber,
          bankName: params.bankShortName,
        },
        bankData: {
          name: params.bankShortName,
          shortName: params.bankShortName,
        },
      });
      return;
    }

    navigation.navigate('TransactionDetail', {
      originTab: params.originTab ?? 'history',
      transactionId: params.id,
      referenceId: params.referenceId,
      type: params.type,
      status: params.status,
    });
  };

  return <History navigateToDetail={navigateToDetailTransaction} />;
};
