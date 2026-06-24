import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeIssueTypeView } from '@/features/dispute/issueType';

const DisputeIssueTypeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { transactionId, recipientName, amount } = route.params || {};

  return (
    <DisputeIssueTypeView
      onPressBack={() => navigation.goBack()}
      onContinue={(issueType, description) =>
        navigation.navigate('DisputeAttachment', {
          issueType,
          description,
          transactionId,
          recipientName,
          amount,
        })
      }
    />
  );
};

export default DisputeIssueTypeScreen;
