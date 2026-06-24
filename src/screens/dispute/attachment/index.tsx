import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeAttachmentView } from '@/features/dispute/attachment';

const DisputeAttachmentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { issueType, transactionId, recipientName, amount } = route.params || {};

  return (
    <DisputeAttachmentView
      issueType={issueType || '-'}
      transactionId={transactionId}
      onPressBack={() => navigation.goBack()}
      onContinue={(description, attachmentCount) =>
        navigation.navigate('DisputeReview', {
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

export default DisputeAttachmentScreen;
