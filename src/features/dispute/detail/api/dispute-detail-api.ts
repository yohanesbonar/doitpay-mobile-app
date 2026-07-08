import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

export interface DisputeStatusCheckpointApi {
  status: string;
  timestamp?: string;
  isActive?: boolean;
}

export interface DisputeEvidenceFileApi {
  id: string;
  fileKey: string;
  createdAt?: string;
}

export interface DisputeDetailApi {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  estimatedAt?: string;
  customReason?: string;
  detail?: string;
  reasonId?: string;
  reasonLabel?: string;
  orderReferenceId?: string;
  transactionId?: string;
  reportType?: string;
  status?: string;
  statusCheckpoints?: DisputeStatusCheckpointApi[];
  evidenceFiles?: DisputeEvidenceFileApi[];
}

export type GetDisputeDetailResponse = ResponseApi<DisputeDetailApi>;

export const disputeDetailApi = {
  getCustomerReportDetail: async (id: string): Promise<GetDisputeDetailResponse> => {
    const { data } = await apiClient.get<GetDisputeDetailResponse>(`/v1/customer-reports/${id}`);
    return data;
  },
};
