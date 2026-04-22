import React from 'react';
import { useNavigation, StackActions, useRoute } from '@react-navigation/native';
import { BankListView } from '../../../features/onboarding/bankList';

const BankListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isLoginState = route.params?.isLoginState;

  const handleBack = () => {
    navigation.dispatch(StackActions.replace('Home', { isLoginState }));
  };

  const handleSelectBank = (bankId: string) => {
    console.log('Bank Selected:', bankId);

    setTimeout(() => {
      navigation.navigate('AddBankRecipient');
    }, 50);
  };

  const handleNext = (values: any) => {
    navigation.navigate('Home', { isLoginState });
  };

  return (
    <BankListView
      onPressBack={handleBack}
      onSelectBank={handleSelectBank}
      onPressNext={handleNext}
      isLoginState={isLoginState}
    />
  );
};

export default BankListScreen;
