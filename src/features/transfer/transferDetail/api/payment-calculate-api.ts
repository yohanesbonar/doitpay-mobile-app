import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

export type PaymentCalculatePayload = {
  amount: number;
  productType: 'TRANSFER' | 'RECEIVE';
  payMethod: 'VIRTUAL_ACCOUNT' | 'QRIS' | 'MANUAL_BANK';
  payChannel: string;
};

export type PaymentCalculateData = {
  amount: number;
  dailyLimitTotal: number;
  dailyLimitUsed: number;
  defaultFeePerTransaction?: number | null;
  fee: number;
  feePerTransaction: number;
  uniqueCode?: number;
  freeQuotaRemaining: number;
  freeQuotaTotal: number;
  isFreeTransfer: boolean;
  totalAmount: number;
};

export type PaymentCalculateResponse = ResponseApi<PaymentCalculateData>;

export const paymentApi = {
  calculatePayment: async (payload: PaymentCalculatePayload): Promise<PaymentCalculateResponse> => {
    const { data } = await apiClient.post<PaymentCalculateResponse>(
      '/v1/payment/calculate',
      payload,
    );
    return data;
  },
};
