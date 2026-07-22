import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DataSubmittedView from '@/features/kyc/dataSubmitted';

const DataSubmittedScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <DataSubmittedView
      onContinueHome={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      }
    />
  );
};

export default DataSubmittedScreen;
