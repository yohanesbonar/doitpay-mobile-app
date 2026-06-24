import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeAddResponseView } from '@/features/dispute/addResponse';

const DisputeAddResponseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const report = route.params?.report;

  return (
    <DisputeAddResponseView
      reportId={report?.id || '-'}
      onPressBack={() => navigation.goBack()}
      onSubmitSuccess={() => navigation.goBack()}
    />
  );
};

export default DisputeAddResponseScreen;
