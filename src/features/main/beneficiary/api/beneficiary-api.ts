import apiClient from '@/api/client';
import { Beneficiary, GetBeneficiariesQueries } from '../types';
import { ResponseListApi } from '@/api/types';

export const beneficiaryApi = {
  getBeneficiaries: async (
    queries: GetBeneficiariesQueries,
  ): Promise<ResponseListApi<Beneficiary>> => {
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
