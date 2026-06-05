import { TransactionDetail } from '@/features/transaction/transaction-detail';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';

export const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const transactionId: string = route.params?.transactionId ?? '';

  return (
    <TransactionDetail
      transactionId={transactionId}
      onPressBack={() => navigation.goBack()}
    />
  );
};
