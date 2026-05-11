import apiClient from './client';

export interface TransferPayload {
  amount: string;
  inquiryId: string;
  payChannel: string;
  payMethod: string;
  pin: string;
  remark: string;
}

export interface PaymentInstrument {
  amount: number;
  bankCode: string;
  expiredAt: string;
  method: 'QRIS' | 'VA' | string;
  qrString: string;
  vaNumber: string;
}

export interface TransferResponseData {
  accountHolderName: string;
  accountNumber: string;
  amount: number;
  bankCode: string;
  bankShortName: string;
  createdAt: string;
  fee: number;
  id: string;
  paymentInstrument: PaymentInstrument;
  referenceId: string;
  remark: string;
  statusInternal: 'PAYMENT_INITIATED' | string;
  statusUser: 'INITIATED' | string;
  totalAmount: number;
}

export interface BaseResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

export type CreateTransferResponse = BaseResponse<TransferResponseData>;

export const transferApi = {
  postTransfers: async (
    payload: TransferPayload,
    idempotencyKey: string,
  ): Promise<CreateTransferResponse> => {
    const { data } = await apiClient.post<CreateTransferResponse>('/v1/transfers', payload, {
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });
    return data;
  },
  postReceive: async (payload: TransferPayload, idempotencyKey: string): Promise<CreateTransferResponse> => {
    const { data } = await apiClient.post<CreateTransferResponse>('/v1/receive', payload{
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });
    return data;
  },
};
