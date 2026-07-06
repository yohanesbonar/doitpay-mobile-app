import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

export type DisputeReasonType = 'TRANSFER' | 'RECEIVE' | 'ALL';

export interface DisputeReason {
  id: string;
  label: string;
  type: DisputeReasonType | string;
}

export interface DisputeReasonsData {
  reasons: DisputeReason[];
}

export type GetDisputeReasonsResponse = ResponseApi<DisputeReasonsData>;

export const disputeReasonsApi = {
  getReasons: async (type: DisputeReasonType = 'TRANSFER'): Promise<GetDisputeReasonsResponse> => {
    const { data } = await apiClient.get<GetDisputeReasonsResponse>('/v1/disputes/reasons', {
      params: { type },
    });

    return data;
  },

  getCustomerReportReasons: async (): Promise<GetDisputeReasonsResponse> => {
    const { data } = await apiClient.get<GetDisputeReasonsResponse>('/v1/customer-reports/reasons');
    return data;
  },
};
