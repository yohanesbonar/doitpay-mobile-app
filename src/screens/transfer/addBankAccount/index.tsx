import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddBankRecipientView } from '../../../features/transfer/addBankAccount';

const AddBankRecipientScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fromTabBar = route.params?.fromTabBar;
  const isLoginState = route.params?.isLoginState;
  const bankData = route.params?.bank;
  const method = route.params?.method;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessNavigation = () => {
    navigation.navigate('Home');
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
    />
  );
};

export default AddBankRecipientScreen;
