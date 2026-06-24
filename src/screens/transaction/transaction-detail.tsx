import { TransactionDetail } from '@/features/transaction/transaction-detail';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';

export const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId = '', referenceId = '', type = '', status } = route.params ?? {};

  return (
    <TransactionDetail
      transactionId={transactionId}
      referenceId={referenceId}
      type={type}
      status={status}
      onPressBack={() => navigation.goBack()}
      onPressReportIssue={() =>
        navigation.navigate('DisputeReportCenter', {
          transactionId,
          recipientName: '',
          amount: 0,
        })
      }
    />
  );
};
