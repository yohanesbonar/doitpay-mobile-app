import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ConfirmDataView from '@/features/kyc/confirmData';

const ConfirmDataScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ConfirmDataView
      onPressBack={() => navigation.goBack()}
      onSubmitData={() => navigation.navigate('KycDataSubmitted')}
    />
  );
};

export default ConfirmDataScreen;
