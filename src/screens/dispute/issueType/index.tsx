import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeIssueTypeView } from '@/features/dispute/issueType';
import { DisputeReasonType } from '@/features/dispute/issueType/api/dispute-reasons-api';
import { useDisputeReasonsQuery } from '@/features/dispute/issueType/hooks/useDisputeReasonsQuery';

const DisputeIssueTypeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    disputeId,
    transactionId,
    orderReferenceId,
    recipientName,
    amount,
    disputeType = 'TRANSFER',
  } = route.params || {};
  const { data: reasonsData, isLoading } = useDisputeReasonsQuery(disputeType as DisputeReasonType);

  const issueOptions = reasonsData?.data?.reasons ?? [];

  return (
    <DisputeIssueTypeView
      onPressBack={() => navigation.goBack()}
      issueOptions={issueOptions}
      isLoading={isLoading}
      onContinue={(selectedReason, description) => {
        const commonParams = {
          issueType: selectedReason.label,
          issueReasonId: selectedReason.id,
          issueReasonType: selectedReason.type,
          description,
          disputeId,
          transactionId,
          orderReferenceId,
          recipientName,
          amount,
        };

        if (transactionId) {
          navigation.navigate('DisputeReview', {
            ...commonParams,
            attachmentCount: 0,
          });
          return;
        }

        navigation.navigate('DisputeAttachment', commonParams);
      }}
    />
  );
};

export default DisputeIssueTypeScreen;
