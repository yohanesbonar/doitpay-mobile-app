import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BankListView } from '../../../features/onboarding/bankList';

const BankListScreen = () => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectBank = (bankId: string) => {
    console.log('Bank Selected:', bankId);

    setTimeout(() => {
      navigation.navigate('AddBankRecipient');
    }, 50);
  };

  const handleNext = (values: any) => {
    console.log('Footer Next Pressed', values);
    navigation.navigate('Home');
  };

  return (
    <BankListView
      onPressBack={handleBack}
      onSelectBank={handleSelectBank}
      onPressNext={handleNext}
    />
  );
};

export default BankListScreen;
