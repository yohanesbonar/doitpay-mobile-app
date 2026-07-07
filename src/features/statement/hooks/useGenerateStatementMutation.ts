import { useMutation } from '@tanstack/react-query';
import { statementApi } from '../api/statement';
import { GenerateStatementPayload, StatementData, StatementResponse } from '../types';

type GenerateStatementVariables = {
  payload: GenerateStatementPayload;
  idempotencyKey: string;
};

export const useGenerateStatementMutation = () => {
  return useMutation<StatementResponse<StatementData>, Error, GenerateStatementVariables>({
    mutationFn: ({ payload, idempotencyKey }) =>
      statementApi.generateStatement(payload, idempotencyKey),
  });
};
