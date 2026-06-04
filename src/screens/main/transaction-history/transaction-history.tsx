import { History } from '@/features/main/history';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export const TransactionHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const navigateToDetailTransaction = (id: string) => {
    navigation.navigate('TransactionDetail', { transactionId: id });
  };

  return <History navigateToDetail={navigateToDetailTransaction} />;
};
