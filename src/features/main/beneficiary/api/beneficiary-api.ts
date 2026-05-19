import apiClient from '@/api/client';
import { GetBeneficiariesQueries, GetBeneficiariesResponse } from '../types';

export const beneficiaryApi = {
  getBeneficiaries: async (queries: GetBeneficiariesQueries): Promise<GetBeneficiariesResponse> => {
    const { data } = await apiClient.get(`/v1/beneficiaries`, {
      params: queries,
    });
    return data;
  },
  updateBeneficiary: async (beneficiaryId: string, payload: { isFavorite: boolean }) => {
    const { data } = await apiClient.patch(`/v1/beneficiaries/${beneficiaryId}`, payload);
    return data;
  },
};
