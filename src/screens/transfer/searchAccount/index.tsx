import { useNavigation } from '@react-navigation/native';
import SearchAccountView from '../../../features/transfer/searchAccount';
import React from 'react';

const SearchAccountScreen = () => {
  const navigation = useNavigation<any>();

  const onPressBack = () => {
    navigation.goBack();
  };

  const goToTransferDetail = (params: { bankData: any; accountData: any }) => {
    const { bankData, accountData } = params;
    navigation.navigate('TransferDetail', { bankData, accountData });
  };
  return <SearchAccountView onPressBack={onPressBack} goToTransferDetail={goToTransferDetail} />;
};

export default SearchAccountScreen;
