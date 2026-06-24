import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeReviewView } from '@/features/dispute/review';

const DisputeReviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { issueType, description, attachmentCount, transactionId, recipientName, amount } =
    route.params || {};

  return (
    <DisputeReviewView
      issueType={issueType || '-'}
      description={description || '-'}
      attachmentCount={attachmentCount || 0}
      onPressBack={() => navigation.goBack()}
      onSubmit={() =>
        navigation.replace('DisputeSubmitted', {
          reportId: `LAPORAN-${Date.now().toString().slice(-6)}`,
          dateLabel: new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          issueType,
          description,
          attachmentCount,
          transactionId,
          recipientName,
          amount,
        })
      }
    />
  );
};

export default DisputeReviewScreen;
