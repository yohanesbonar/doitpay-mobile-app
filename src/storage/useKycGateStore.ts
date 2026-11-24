import { create } from 'zustand';
import { KycStatus } from '@/features/onboarding/kyc/types';

// Drives the single KycRequiredSheet rendered in RootNavigator, so any screen can trigger it
// through useKycGate without rendering its own copy.
interface KycGateState {
  gateStatus: KycStatus | null;
  gateEntryPoint: string | null;
  openGate: (status: KycStatus, entryPoint: string) => void;
  closeGate: () => void;
}

export const useKycGateStore = create<KycGateState>((set) => ({
  gateStatus: null,
  gateEntryPoint: null,
  openGate: (status, gateEntryPoint) => set({ gateStatus: status, gateEntryPoint }),
  closeGate: () => set({ gateStatus: null, gateEntryPoint: null }),
}));
