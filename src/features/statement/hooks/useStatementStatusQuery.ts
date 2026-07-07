import { useQuery } from '@tanstack/react-query';
import { statementApi } from '../api/statement';
import { StatementStatus } from '../types';

export const useStatementStatusQuery = (statementId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['statementStatus', statementId],
    queryFn: () => statementApi.getStatementById(statementId!),
    enabled: !!statementId && enabled,
    refetchInterval: (query) => {
      const currentStatus = query.state.data?.data?.status;
      const isFinalStatus =
        currentStatus === StatementStatus.READY || currentStatus === StatementStatus.FAILED;

      return isFinalStatus ? false : 2000;
    },
    staleTime: 0,
  });
};
