import apiClient from './client';

export interface BankAccountPayload {}

export type BankAccountResponse = {
  status: string;
  message: string;
  data: {
    id: string;
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export interface BankAccountPostPayload {
    accountInquiryID: string;
}

export type BankAccountPostResponse = {
    status: string;
    message: string;
    data: {
        accountHolderName: string;
        accountNumber: string;
        bankCode: string;
        bankShortName: string;
        createdAt: string;
        id: string;
        updatedAt: string;
    };
};

export interface BankAccountDeletePayload {
    id: string;
}

export type BankAccountDeleteResponse = {
    status: string;
    message: string;
    data: null;
};


export const bankAccountApi = {
    getBankAccounts: async (): Promise<BankAccountResponse> => {
        const { data } = await apiClient.get<BankAccountResponse>('/v1/me/bankAccount');
        return data;
    }, 
    postBankAccount: async (payload: BankAccountPostPayload): Promise<BankAccountPostResponse> => {
        const { data } = await apiClient.post<BankAccountPostResponse>('/v1/me/bankAccount', payload);
        return data;
    },
    deleteBankAccount: async (payload: BankAccountDeletePayload): Promise<BankAccountDeleteResponse> => {
        const { data } = await apiClient.delete<BankAccountDeleteResponse>(`/v1/me/bankAccount/${payload.id}`);
        return data;
    }

};  
