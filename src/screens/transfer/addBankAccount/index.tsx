import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddBankRecipientView } from '../../../features/transfer/addBankAccount';

const AddBankRecipientScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fromTabBar = route.params?.fromTabBar;
  const isLoginState = route.params?.isLoginState;
  const bankData = route.params?.bank;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessNavigation = () => {
    navigation.navigate('Home');
  };

  return (
    <AddBankRecipientView
      onPressBack={handleBack}
      onNavigateHome={handleSuccessNavigation}
      fromTabBar={fromTabBar}
      isLoginState={isLoginState}
      bankData={bankData}
    />
  );
};

export default AddBankRecipientScreen;
