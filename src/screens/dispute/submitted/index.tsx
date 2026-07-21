import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeSubmittedView } from '@/features/dispute/submitted';

const formatEstimatedAt = (value?: string) => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const DisputeSubmittedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    reportId,
    estimatedAt,
    issueType,
    description,
    attachmentCount,
    transactionId,
    recipientName,
    amount,
  } = route.params || {};

  const estimatedAtLabel = formatEstimatedAt(estimatedAt);

  return (
    <DisputeSubmittedView
      reportId={reportId || '-'}
      dateLabel={estimatedAtLabel}
      onPressViewReport={() =>
        navigation.replace('DisputeDetail', {
          report: {
            id: reportId || '-',
            transactionId: transactionId || '-',
            issueType: issueType || 'Laporan Masalah',
            date: estimatedAtLabel,
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
