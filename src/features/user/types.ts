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
  amountLimit: number;
  amountUsed: number;
  countLimit: number;
  countUsed: number;
  type: UserLimitType;
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
