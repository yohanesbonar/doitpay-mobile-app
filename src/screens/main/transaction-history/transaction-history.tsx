import { History } from '@/features/main/history';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export const TransactionHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const navigateToDetailTransaction = (params: {
    id: string;
    referenceId: string;
    type: string;
    status: string;
  }) => {
    navigation.navigate('TransactionDetail', {
      transactionId: params.id,
      referenceId: params.referenceId,
      type: params.type,
      status: params.status,
    });
  };

  return <History navigateToDetail={navigateToDetailTransaction} />;
};
