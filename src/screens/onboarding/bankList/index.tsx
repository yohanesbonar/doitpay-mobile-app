import React from 'react';
import { useNavigation, useRoute, CommonActions, StackActions } from '@react-navigation/native';
import { BankListView } from '../../../features/onboarding/bankList';
import { useAuthStore } from '@/storage/useAuthStore';

const BankListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fromTabBar = route.params?.fromTabBar;
  const isLoginState = route.params?.isLoginState;

  const accessToken = useAuthStore((state) => state.accessToken);
  const state = navigation.getState();
  const hasHomeRoute = state.routeNames.includes('Home');

  const handleBack = () => {
    if (fromTabBar) {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: { screen: 'Home' },
        }),
      );
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.dispatch(StackActions.replace('MainTabs'));
      }
    }
  };

  const handleSelectBank = (bankId: string) => {
    console.log('Bank Selected:', bankId);

    setTimeout(() => {
      navigation.navigate('AddBankRecipient');
    }, 50);
  };

  const handleNext = (values: any) => {
    navigation.dispatch(StackActions.replace('MainTabs'));
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
