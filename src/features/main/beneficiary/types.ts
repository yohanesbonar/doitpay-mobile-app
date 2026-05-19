import { PaginationQueries } from '@/types/pagination';

export type Beneficiary = {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankCode: string;
  isFavorite: boolean;
  lastUsedAt: string;
};

export interface GetBeneficiariesResponse {
  data: {
    items: Beneficiary[];
    nextCursor: string | null;
  };
  message: string;
  status: string;
}

export interface GetBeneficiariesQueries extends PaginationQueries {
  search?: string;
  isFavorite?: boolean;
}

export type UpdateBeneficiaryPayload = {
  isFavorite: boolean;
};
