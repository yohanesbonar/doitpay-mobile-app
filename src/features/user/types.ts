import { KycStatus } from '../onboarding/kyc/types';

export type User = {
  createdAt: string;
  email: string;
  fullName: string;
  hasBankAccount: boolean;
  id: string;
  isEmailVerified: boolean;
  kycStatus: KycStatus;
  phoneNumber: string;
  status: UserStatus;
  tier: number;
  isRequestDeleteAccount: boolean;
};

export type UserLimit = {
  dailyLimitTotal: number;
  dailyLimitUsed: number;
  fee: number;
  feePerTransaction: number;
  freeQuotaRemaining: number;
  freeQuotaTotal: number;
  isFreeTransfer: boolean;
};

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ACTIVATION_PENDING = 'ACTIVATION_PENDING',
}

export enum UserLimitType {
  TRANSFER = 'TRANSFER',
  RECEIVE = 'RECEIVE',
}
