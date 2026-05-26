export interface PendingAction {
  code: string;
  message: string;
}

export interface RecentBeneficiary {
  id: string;
  imageUrl: string;
  name: string;
}

export interface RecentTransaction {
  amount: number;
  beneficiaryAccountHolderName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankShortName: string;
  createdAt: string;
  id: string;
  remark: string;
}

export interface TransferLimit {
  amountReceived: number;
  maxAmount: number;
  usage: number;
  usagePercentage: number;
}

export interface HomeAggregate {
  pendingActions: PendingAction[];
  recentBeneficiaries: RecentBeneficiary[];
  recentTransactions: RecentTransaction[];
  transferLimit: TransferLimit;
  unreadNotificationCount: number;
}
