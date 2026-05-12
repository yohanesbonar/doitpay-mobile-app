import React from 'react';
import { useNavigation, useRoute, CommonActions, StackActions } from '@react-navigation/native';
import { BankListView } from '../../../features/transfer/bankList';
import { useAuthStore } from '@/storage/useAuthStore';

const BankListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fromTabBar = route.params?.fromTabBar;
  const fromProfile = route.params?.fromProfile;
  const isLoginState = route.params?.isLoginState;

  const accessToken = useAuthStore((state) => state.accessToken);
  const state = navigation.getState();
  const hasHomeRoute = state.routeNames.includes('Home');

  const handleBack = () => {
    if (fromTabBar) {
      navigation.goBack();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.dispatch(StackActions.replace('MainTabs'));
      }
    }
  };

  const handleSelectBank = (bank: any, method: 'send' | 'receive') => {
    setTimeout(() => {
      navigation.navigate({
        name: 'AddBankRecipient',
        merge: true,
        params: { fromTabBar: true, bank: bank, method: method, fromProfile: fromProfile },
      });
    }, 50);
  };

  const handleNext = (values: any) => {
    navigation.dispatch(StackActions.replace('MainTabs'));
  };

  const goToBankAccounts = () => {
    navigation.navigate('BankAccounts');
  };

  return (
    <BankListView
      onPressBack={handleBack}
      onSelectBank={handleSelectBank}
      onPressNext={handleNext}
      isLoginState={isLoginState}
      fromTabBar={fromTabBar}
      fromProfile={fromProfile}
      goToBankAccounts={goToBankAccounts}
    />
  );
};

export default BankListScreen;
