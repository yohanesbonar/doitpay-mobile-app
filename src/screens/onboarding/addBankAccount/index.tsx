import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AddBankRecipientView } from '../../../features/onboarding/addBankAccount';

const AddBankRecipientScreen = () => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessNavigation = () => {
    navigation.navigate('Home');
  };

  return <AddBankRecipientView onPressBack={handleBack} onNavigateHome={handleSuccessNavigation} />;
};

export default AddBankRecipientScreen;
