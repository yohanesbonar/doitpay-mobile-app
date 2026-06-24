import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { DisputeHelpCenterView } from '@/features/dispute/helpCenter';

const DisputeHelpCenterScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <DisputeHelpCenterView
      onPressBack={() => navigation.goBack()}
      onPressReportCenter={() => navigation.navigate('DisputeReportCenter')}
    />
  );
};

export default DisputeHelpCenterScreen;
