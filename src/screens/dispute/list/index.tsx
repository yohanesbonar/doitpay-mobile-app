import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeListView } from '@/features/dispute/list';
import { DisputeReport } from '@/features/dispute/types';

const DisputeListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId } = route.params || {};

  const handleOpenReport = (report: DisputeReport) => {
    navigation.navigate('DisputeDetail', { report });
  };

  return (
    <DisputeListView
      transactionId={transactionId}
      onPressBack={() => navigation.goBack()}
      onPressReport={handleOpenReport}
    />
  );
};

export default DisputeListScreen;
