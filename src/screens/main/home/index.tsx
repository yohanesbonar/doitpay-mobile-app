import { useNavigation } from '@react-navigation/native';
import { HomeView } from '../../../features/main/home';
import React from 'react';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const goToSearchAccount = () => {
    navigation.navigate('SearchAccount');
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const goToBankAccounts = () => {
    navigation.navigate('BankAccounts');
  };

  return (
    <HomeView
      goToSearchAccount={goToSearchAccount}
      onPressBack={onPressBack}
      goToBankAccounts={goToBankAccounts}
    />
  );
};

export default HomeScreen;
