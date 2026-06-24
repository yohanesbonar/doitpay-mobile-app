import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeReportCenterView } from '@/features/dispute/reportCenter';

const DisputeReportCenterScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { transactionId, recipientName, amount } = route.params || {};

  return (
    <DisputeReportCenterView
      transactionId={transactionId}
      recipientName={recipientName}
      amount={amount}
      onPressBack={() => navigation.goBack()}
      onPressCreateReport={() =>
        navigation.navigate('DisputeIssueType', {
          transactionId,
          recipientName,
          amount,
        })
      }
      onPressMyReports={() => navigation.navigate('DisputeList')}
    />
  );
};

export default DisputeReportCenterScreen;
