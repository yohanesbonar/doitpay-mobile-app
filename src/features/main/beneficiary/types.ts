import { PaginationQueries } from '@/types/pagination';

export type Beneficiary = {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankCode: string;
  isFavorite: boolean;
  lastUsedAt: string;
  bankShortName: string;
};

export interface GetBeneficiariesQueries extends PaginationQueries {
  search?: string;
  isFavorite?: boolean;
}

export type UpdateBeneficiaryPayload = {
  isFavorite: boolean;
};
