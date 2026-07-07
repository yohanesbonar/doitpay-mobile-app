import apiClient from '@/api/client';
import {
  GenerateStatementPayload,
  StatementData,
  StatementDetailData,
  StatementResponse,
} from '../types';

export const statementApi = {
  generateStatement: async (
    payload: GenerateStatementPayload,
    idempotencyKey: string,
  ): Promise<StatementResponse<StatementData>> => {
    const { data } = await apiClient.post<StatementResponse<StatementData>>(
      '/v1/statements',
      payload,
      { headers: { 'X-Idempotency-Key': idempotencyKey } },
    );
    return data;
  },
  getStatementById: async (id: string): Promise<StatementResponse<StatementDetailData>> => {
    const { data } = await apiClient.get<StatementResponse<StatementDetailData>>(
      `/v1/statements/${id}`,
    );
    return data;
  },
};
