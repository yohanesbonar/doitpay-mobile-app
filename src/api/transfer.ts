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

export interface VAMethodsPayload {}

export type VAMethodsResponse = {
  status: string;
  message: string;
  data: null;
};

export interface PaymentInstructionPayload {
  paymentCode: string;
}

export interface PaymentInstructionData {
  instructionTitle?: string;
  steps?: string[];
  [key: string]: any;
}

export type PaymentInstructionResponse = BaseResponse<PaymentInstructionData>;

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
  postReceive: async (
    payload: TransferPayload,
    idempotencyKey: string,
  ): Promise<CreateTransferResponse> => {
    const { data } = await apiClient.post<CreateTransferResponse>('/v1/receive', payload, {
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });
    return data;
  },
  getVAMethods: async (payload: VAMethodsPayload): Promise<VAMethodsResponse> => {
    const { data } = await apiClient.get<VAMethodsResponse>('/v1/payment/va/methods');
    return data;
  },
  getPaymentInstruction: async (
    payload: PaymentInstructionPayload,
  ): Promise<PaymentInstructionResponse> => {
    const { data } = await apiClient.get<PaymentInstructionResponse>('/v1/payment/instruction', {
      params: {
        paymentCode: payload.paymentCode, 
      },
    });
    return data;
  },
};
