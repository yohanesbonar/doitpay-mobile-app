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

export interface PaymentStatusPayload {
  id: string;
}

export interface PaymentStatusData {
  amount: string;
  providerReference: string;
  status: 'success' | 'pending' | 'failed' | string;
}

export interface TransferStatusPayload {
  id: string;
}

export interface BeneficiaryData {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  logoUrl: string;
}

export type TransferApiStatus = 
  | 'WAITING_PAYMENT' 
  | 'DISBURSING' 
  | 'DISBURSING_FAILED' 
  | 'COMPLETED' 
  | 'CANCELLED';
export interface TransferStatusData {
  amount: number;
  beneficiary: BeneficiaryData;
  lastUpdatedAt: string; 
  processedAt: string;
  status: TransferApiStatus;
}

export type TransferStatusResponse = BaseResponse<TransferStatusData>;

export type PaymentStatusResponse = BaseResponse<PaymentStatusData>;

export interface QrisDetailData {
  content: string;
  nmid: string;
  recipientName: string;
}

export interface VaDetailData {
  code: string;
  logoUrl: string;
  name: string;
  number: string;
}

export interface GetTransferDetailResponseData {
  amount: number;
  createdAt: string;
  id: string;
  paymentExpiredAt: string;
  paymentId: string;
  qris: QrisDetailData | null;
  status: 'CREATED' | 'PAID' | 'COMPLETED' | 'CANCELLED' | string;
  va: VaDetailData | null;
}

export type GetTransferDetailResponse = BaseResponse<GetTransferDetailResponseData>;

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
  getPaymentStatus: async (payload: PaymentStatusPayload): Promise<PaymentStatusResponse> => {
    const { data } = await apiClient.get<PaymentStatusResponse>(`/v1/payment/${payload.id}`);
    return data;
  },
  getTransferStatus: async (payload: TransferStatusPayload): Promise<TransferStatusResponse> => {
    const { data } = await apiClient.get<TransferStatusResponse>(
      `/v1/transfers/${payload.id}/status`,
    );
    return data;
  },
  getTransferDetailById: async (payload: { id: string }): Promise<GetTransferDetailResponse> => {
    const { data } = await apiClient.get<GetTransferDetailResponse>(`/v1/transfers/${payload.id}`);
    return data;
  },
  getTransferReceipt: async (payload: { id: string }): Promise<GetTransferDetailResponse> => {
    const { data } = await apiClient.get<GetTransferDetailResponse>(`/v1/transfers/${payload.id}/receipt`);
    return data;
  },
  getReceiveReceipt: async (payload: PaymentStatusPayload): Promise<PaymentStatusResponse> => {
    const { data } = await apiClient.get<PaymentStatusResponse>(`/v1/receive/${payload.id}/receipt`);
    return data;
  },
};
