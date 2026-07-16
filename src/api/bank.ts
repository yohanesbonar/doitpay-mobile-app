import apiClient from './client';

export interface BankTransferPayload {
  name?: string;
}

export type BankTransferResponse = {
  status: string;
  message: string;
  data: {
    all: [
      {
        code: string;
        id: number;
        logoUrl: string;
        name: string;
        shortName: string;
        swiftCode: string;
      },
    ];
    popular: [
      {
        code: string;
        id: number;
        logoUrl: string;
        name: string;
        shortName: string;
        swiftCode: string;
      },
    ];
  };
};

export interface BankInquiryPayload {
  accountNumber: string;
  bankId: number;
}

export type BankInquiryResponse = {
  status: string;
  message: string;
  data: {
    accountHolderName: string;
    accountNumber: string;
    bank: {
      code: string;
      id: number;
      logoUrl: string;
      name: string;
      shortName: string;
      swiftCode: string;
    };
    id: string;
  };
};

export const bankApi = {
  getBanks: async (payload?: BankTransferPayload): Promise<BankTransferResponse> => {
    const { data } = await apiClient.get<BankTransferResponse>('/v1/banks', {
      params: payload,
    });
    return data;
  },
  postBankInquiry: async (payload: BankInquiryPayload): Promise<BankInquiryResponse> => {
    const { data } = await apiClient.post<BankInquiryResponse>('/v1/banks/inquiry', payload);
    return data;
  },
};
