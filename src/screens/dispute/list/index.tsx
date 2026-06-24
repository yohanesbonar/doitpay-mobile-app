import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { DisputeListView } from '@/features/dispute/list';
import { DisputeReport } from '@/features/dispute/types';

const DisputeListScreen = () => {
  const navigation = useNavigation<any>();

  const handleOpenReport = (report: DisputeReport) => {
    navigation.navigate('DisputeDetail', { report });
  };

  return (
    <DisputeListView
      onPressBack={() => navigation.goBack()}
      onPressReport={handleOpenReport}
    />
  );
};

export default DisputeListScreen;
