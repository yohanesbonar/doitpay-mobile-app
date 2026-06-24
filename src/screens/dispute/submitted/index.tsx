import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeSubmittedView } from '@/features/dispute/submitted';

const DisputeSubmittedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    reportId,
    dateLabel,
    issueType,
    description,
    attachmentCount,
    transactionId,
    recipientName,
    amount,
  } = route.params || {};

  return (
    <DisputeSubmittedView
      reportId={reportId || '-'}
      dateLabel={dateLabel || '-'}
      onPressViewReport={() =>
        navigation.replace('DisputeDetail', {
          report: {
            id: reportId || '-',
            transactionId: transactionId || '-',
            issueType: issueType || 'Laporan Masalah',
            date: dateLabel || '-',
            status: 'DIAJUKAN',
            recipientName: recipientName || '-',
            amount: amount || 0,
            description,
            attachmentCount,
          },
        })
      }
      onPressBackToHome={() => navigation.navigate('MainTabs')}
    />
  );
};

export default DisputeSubmittedScreen;
