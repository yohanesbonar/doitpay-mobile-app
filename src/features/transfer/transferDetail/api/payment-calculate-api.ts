import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

export type PaymentCalculatePayload = {
  amount: number;
  productType: 'TRANSFER' | string;
  payMethod: 'VIRTUAL_ACCOUNT' | 'QRIS' | string;
  payChannel: string;
};

export type PaymentCalculateData = {
  amount: number;
  dailyLimitTotal: number;
  dailyLimitUsed: number;
  fee: number;
  feePerTransaction: number;
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
