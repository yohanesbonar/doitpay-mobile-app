import apiClient from '@/api/client';

export type QrisActivationStatus =
  | 'KYC_INCOMPLETE'
  | 'CAN_ACTIVATE'
  | 'PENDING'
  | 'ACTIVE'
  | 'REJECTED';

export interface QrisActivationEligibility {
  activationStatus: QrisActivationStatus;
  rejectionReason?: string;
}

type QrisActivationApiResponse = {
  status: string;
  message: string;
  data: {
    status: QrisActivationStatus;
    rejectionReason?: string;
  };
};

export const qrisApi = {
  getActivationEligibility: async (): Promise<QrisActivationEligibility> => {
    const { data } = await apiClient.get<QrisActivationApiResponse>('/v1/qris/activation');

    return {
      activationStatus: data?.data?.status,
      rejectionReason: data?.data?.rejectionReason,
    };
  },
};