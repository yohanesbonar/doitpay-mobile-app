export interface PaginationMeta {
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  perPage: number;
  total: number;
}

export interface PageableResponse<T> {
  statusCode: number;
  date: Date;
  message: string;
  result: {
    data: T[];
    meta: PaginationMeta;
  };
}

export interface PaginationQueries {
  limit?: number;
  cursor?: string;
}
