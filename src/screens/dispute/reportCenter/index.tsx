import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeReportCenterView } from '@/features/dispute/reportCenter';

const DisputeReportCenterScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { transactionId, orderReferenceId, recipientName, amount, disputeType } = route.params || {};
  const resolvedDisputeType = disputeType || (transactionId ? 'TRANSFER' : 'ALL');

  return (
    <DisputeReportCenterView
      transactionId={transactionId}
      recipientName={recipientName}
      amount={amount}
      onPressBack={() => navigation.goBack()}
      onPressCreateReport={() =>
        navigation.navigate('DisputeIssueType', {
          transactionId,
          orderReferenceId,
          recipientName,
          amount,
          disputeType: resolvedDisputeType,
        })
      }
      onPressMyReports={() => navigation.navigate('DisputeList')}
    />
  );
};

export default DisputeReportCenterScreen;
