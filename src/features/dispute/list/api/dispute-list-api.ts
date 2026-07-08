import apiClient from '@/api/client';
import { ResponseListApi } from '@/api/types';

export interface GetDisputesQueries {
  status?: string;
  cursor?: string;
  limit?: number;
}

export interface DisputeListItemApi {
  id: string;
  transactionId?: string;
  reasonLabel?: string;
  createdAt?: string;
  updatedAt?: string;
  estimatedAt?: string;
  customReason?: string;
  detail?: string;
  reasonId?: string;
  orderReferenceId?: string;
  status?: string;
}

export type ReportListItemApi = DisputeListItemApi;

export type GetDisputesResponse = ResponseListApi<DisputeListItemApi>;

export const disputeListApi = {
  getDisputes: async (queries?: GetDisputesQueries): Promise<GetDisputesResponse> => {
    const { data } = await apiClient.get<GetDisputesResponse>('/v1/disputes', { params: queries });
    return data;
  },
  getCustomerReportsDisputes: async (queries?: GetDisputesQueries): Promise<GetDisputesResponse> => {
    const { data } = await apiClient.get<GetDisputesResponse>('/v1/customer-reports', { params: queries });
    return data;
  },
};
