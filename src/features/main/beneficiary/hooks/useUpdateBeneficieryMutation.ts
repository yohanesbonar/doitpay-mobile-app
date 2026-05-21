import { AxiosError } from 'axios';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { UpdateBeneficiaryPayload } from '../types';
import { beneficiaryApi } from '../api/beneficiary-api';

export const useUpdateBeneficieryMutation = (
  id: string,
  options?: UseMutationOptions<unknown, AxiosError, UpdateBeneficiaryPayload>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBeneficiaryPayload): Promise<void> => {
      return beneficiaryApi.updateBeneficiary(id, {
        isFavorite: payload.isFavorite,
      });
    },
    ...options,
    onSuccess(response, variables, context, mutationContext) {
      queryClient.invalidateQueries({
        queryKey: ['beneficiaries'],
      });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context, mutationContext);
      }
    },
  });
};
