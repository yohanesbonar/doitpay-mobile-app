import React from 'react';
import { CommonActions, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { AddBankRecipientView } from '../../../features/transfer/addBankAccount';

const AddBankRecipientScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fromTabBar = route.params?.fromTabBar;
  const fromProfile = route.params?.fromProfile;
  const isLoginState = route.params?.isLoginState;
  const bankData = route.params?.bank;
  const method = route.params?.method;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessNavigation = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  };

  const onBackToBankAccount = () => {
    navigation.dispatch(StackActions.pop(2));
  };

  const onClickContinue = (method: 'send' | 'receive', bankData: any, accountData: any) => {
    if (method === 'send') {
      console.log('Navigate to transfer page with bankData:', bankData);
      navigation.navigate({
        name: 'TransferDetail',
        merge: true,
        params: { fromTabBar: true, bankData: bankData, accountData: accountData, method: method },
      });
      // to transfer page
    } else if (method === 'receive') {
      console.log('Navigate to receive page with bankData:', bankData);
      navigation.navigate({
        name: 'PaymentInstruction',
        merge: true,
        params: { fromTabBar: true, bankData: bankData, accountData: accountData, method: method },
      });
      // to receive page
    }
  };

  return (
    <AddBankRecipientView
      onPressBack={handleBack}
      onNavigateHome={handleSuccessNavigation}
      fromTabBar={fromTabBar}
      isLoginState={isLoginState}
      bankData={bankData}
      method={method}
      onClickContinue={onClickContinue}
      fromProfile={fromProfile}
      onBackToBankAccount={onBackToBankAccount}
    />
  );
};

export default AddBankRecipientScreen;
