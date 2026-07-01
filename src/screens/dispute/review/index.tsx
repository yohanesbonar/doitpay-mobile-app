import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeReviewView } from '@/features/dispute/review';

const DisputeReviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    issueType,
    issueReasonId,
    disputeId,
    description,
    attachmentCount,
    attachmentUris,
    transactionId,
    orderReferenceId,
    recipientName,
    amount,
  } = route.params || {};

  return (
    <DisputeReviewView
      issueType={issueType || '-'}
      issueReasonId={issueReasonId}
      disputeId={disputeId}
      description={description || '-'}
      attachmentCount={attachmentCount || 0}
      attachmentUris={attachmentUris || []}
      transactionId={transactionId}
      orderReferenceId={orderReferenceId}
      onPressBack={() => navigation.goBack()}
      onSubmit={(latestDescription, latestAttachmentCount, disputeId, estimatedAt) =>
        navigation.replace('DisputeSubmitted', {
          reportId: disputeId || `LAPORAN-${Date.now().toString().slice(-6)}`,
          estimatedAt,
          issueType,
          description: latestDescription,
          attachmentCount: latestAttachmentCount,
          transactionId,
          recipientName,
          amount,
        })
      }
    />
  );
};

export default DisputeReviewScreen;
