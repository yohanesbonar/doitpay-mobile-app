import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeAttachmentView } from '@/features/dispute/attachment';

const DisputeAttachmentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    issueType,
    issueReasonId,
    issueReasonType,
    disputeId,
    transactionId,
    orderReferenceId,
    recipientName,
    amount,
  } =
    route.params || {};

  return (
    <DisputeAttachmentView
      issueType={issueType || '-'}
      transactionId={transactionId}
      onPressBack={() => navigation.goBack()}
      onContinue={(description, attachmentCount, attachmentUris) =>
        navigation.navigate('DisputeReview', {
          issueType,
          issueReasonId,
          issueReasonType,
          disputeId,
          description,
          attachmentCount,
          attachmentUris,
          transactionId,
          orderReferenceId,
          recipientName,
          amount,
        })
      }
    />
  );
};

export default DisputeAttachmentScreen;
