export enum StatementStatus {
  QUEUED = 'QUEUED',
  READY = 'READY',
  FAILED = 'FAILED',
}

export interface GenerateStatementPayload {
  periodStart: string;
  periodEnd: string;
}

export interface StatementData {
  id: string;
  periodStart: string;
  periodEnd: string;
  status: StatementStatus;
}

export interface StatementDetailData extends StatementData {
  fileUrl: string | null;
  errorMessage: string | null;
  fileExpireAt: string | null;
}

export interface StatementResponse<T> {
  status: string;
  data: T;
  message: string;
}
