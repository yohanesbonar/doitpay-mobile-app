import { useMutation } from '@tanstack/react-query';
import {
  bankApi,
  BankInquiryPayload,
  BankInquiryResponse,
  BankTransferPayload,
  BankTransferResponse,
} from '../api/bank';

export const useBanks = () => {
  return useMutation<BankTransferResponse, Error, BankTransferPayload>({
    mutationFn: (payload) => bankApi.getBanks(),
    onSuccess: (data) => {
      console.log('useBanks data.message:', data.message);
      console.log('useBanks data', data);
    },
    onError: (error) => {
      console.error('Error fetching banks:', error);
    },
  });
};

export const useBankInquiry = () => {
  return useMutation<BankInquiryResponse, Error, BankInquiryPayload>({
    mutationFn: (payload) => bankApi.postBankInquiry(payload),
    onSuccess: (data) => {
      console.log('useBankInquiry data.message:', data.message);
      console.log('useBankInquiry data', data);
    },
  });
};
