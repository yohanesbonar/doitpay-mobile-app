import { useNavigation } from '@react-navigation/native';
import SearchAccountView from '../../../features/transfer/searchAccount';
import React from 'react';
import { trackPostHogEvent } from '@/analytics/posthog';
import { useTransferFeatureAvailability } from '@/features/transfer/hooks/useTransferFeatureAvailability';

const SearchAccountScreen = () => {
  const navigation = useNavigation<any>();
  const { transferEnabled, isLoading: isFeatureLoading } = useTransferFeatureAvailability();

  const onPressBack = () => {
    navigation.goBack();
  };

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
    if (!isFeatureLoading && !transferEnabled) {
      return;
    }

    const { bankData, accountData, beneficiaryId } = params;
    trackPostHogEvent('transfer_started', {
      entry_point: 'search_account_result',
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
    });

    navigation.navigate('TransferDetail', { bankData, accountData, beneficiaryId });
  };
  return <SearchAccountView onPressBack={onPressBack} goToTransferDetail={goToTransferDetail} />;
};

export default SearchAccountScreen;
